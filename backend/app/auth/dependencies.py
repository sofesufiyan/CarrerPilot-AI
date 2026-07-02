from typing import Optional, Dict, Any
import logging
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth
from pydantic import BaseModel

logger = logging.getLogger("uvicorn.error")

from app.core.firebase import initialize_firebase

# Ensure Firebase Admin SDK is initialized
initialize_firebase()

# Disable auto_error to custom-handle and return proper 401 statuses for missing tokens
security = HTTPBearer(auto_error=False)

class UserSession(BaseModel):
    """
    Data model representing the authenticated Firebase user session.
    Provides fields for downstream services, database keys, and role-based access.
    """
    uid: str
    email: Optional[str] = None
    name: Optional[str] = None
    role: str = "user"
    custom_claims: Dict[str, Any] = {}

async def get_current_user(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> UserSession:
    """
    FastAPI dependency to extract, decode, and verify the Firebase JWT token.
    
    Injects the validated UserSession model into request.state.user for downstream 
    access, and returns the session object.
    
    Raises:
        HTTPException: HTTP 401 status for missing, expired, or invalid tokens.
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token is missing",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    try:
        # Decode and verify token signature/expiration via Firebase Admin
        decoded_token = auth.verify_id_token(token)
        
    except auth.ExpiredIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except auth.InvalidIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token is invalid",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        logger.error(f"Authentication token verification failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Extract user metadata
    uid = decoded_token.get("uid")
    email = decoded_token.get("email")
    name = decoded_token.get("name")

    # Filter out standard JWT/Firebase claims to collect custom claims
    standard_claims = {
        "iss", "aud", "auth_time", "user_id", "sub", "iat", 
        "exp", "email", "email_verified", "firebase", "name", "picture"
    }
    custom_claims = {k: v for k, v in decoded_token.items() if k not in standard_claims}

    # Resolve roles for future RBAC integration
    role = "user"
    if custom_claims.get("admin") is True:
        role = "admin"
    elif custom_claims.get("moderator") is True:
        role = "moderator"

    # Assemble UserSession object
    user_session = UserSession(
        uid=uid,
        email=email,
        name=name,
        role=role,
        custom_claims=custom_claims
    )

    # Store user profile info inside request.state for downstream controllers
    request.state.user = user_session

    return user_session
