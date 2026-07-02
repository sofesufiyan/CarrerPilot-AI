import os
import json
import logging
import firebase_admin
from firebase_admin import credentials

logger = logging.getLogger("uvicorn.error")

def initialize_firebase():
    """
    Initializes the Firebase Admin SDK exactly once.
    
    Supports loading credentials from three strategies:
    1. Local service account JSON file path (FIREBASE_SERVICE_ACCOUNT_PATH).
    2. Raw credentials JSON string in environment variables (FIREBASE_SERVICE_ACCOUNT_JSON).
    3. Google Application Default Credentials (ADC) fallback.
    
    Raises:
        FileNotFoundError: If the certificate file path does not exist.
        ValueError: If the environment JSON string is malformed.
        Exception: General failures during SDK initialization.
    """
    # Guard initialization to execute exactly once
    if firebase_admin._apps:
        logger.info("Firebase Admin SDK already initialized.")
        return firebase_admin.get_app()

    service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH")
    service_account_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")

    try:
        if service_account_path:
            # Strategy 1: Local Certificate File Path
            if not os.path.exists(service_account_path):
                raise FileNotFoundError(
                    f"Firebase service account file not found at: {service_account_path}"
                )
            logger.info(f"Initializing Firebase Admin using file: {service_account_path}")
            cred = credentials.Certificate(service_account_path)
            app = firebase_admin.initialize_app(cred)
            
        elif service_account_json:
            # Strategy 2: Raw Environment Variable JSON String (ideal for Render config)
            logger.info("Initializing Firebase Admin using credentials JSON string.")
            try:
                cred_dict = json.loads(service_account_json)
                cred = credentials.Certificate(cred_dict)
                app = firebase_admin.initialize_app(cred)
            except json.JSONDecodeError as je:
                raise ValueError(
                    f"Malformed JSON loaded from FIREBASE_SERVICE_ACCOUNT_JSON: {je}"
                )
                
        else:
            # Strategy 3: Google Application Default Credentials
            logger.info("Initializing Firebase Admin using Application Default Credentials (ADC).")
            app = firebase_admin.initialize_app()
            
        logger.info("Firebase Admin SDK initialized successfully.")
        return app
        
    except Exception as e:
        logger.error(f"CRITICAL: Failed to initialize Firebase Admin SDK: {e}")
        # Crash application on startup if auth configuration is broken
        raise e
