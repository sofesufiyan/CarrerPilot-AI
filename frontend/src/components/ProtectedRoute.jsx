import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Route guard component that protects access to authenticated features.
 * 
 * - Shows a centered loading spinner while session initialization is in progress.
 * - Redirects unauthenticated users to the Login view.
 * - Renders children when the session resolves to an authenticated user.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div 
        className="auth-loading-container" 
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
          background: "transparent",
        }}
      >
        <div 
          className="auth-spinner" 
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "50%",
            borderTopColor: "#3b82f6",
            animation: "auth-spin 1s linear infinite",
          }}
        ></div>
        <style>{`
          @keyframes auth-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // If no user session is active, redirect to Login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Render children once user is validated
  return children;
};

export default ProtectedRoute;
