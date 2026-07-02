import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { 
  signUp, 
  login, 
  loginWithGoogle, 
  logout 
} from "../services/AuthService";

// Create React Context for Firebase Authentication state
const AuthContext = createContext(null);

/**
 * Custom React Hook to consume the authentication context.
 * Throws an error if used outside an AuthProvider wrapper.
 * 
 * @returns {{
 *   currentUser: import("firebase/auth").User | null,
 *   loading: boolean,
 *   signUp: Function,
 *   login: Function,
 *   loginWithGoogle: Function,
 *   logout: Function
 * }} Context properties
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/**
 * Provider component that listens to authentication changes and exposes the session state.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to authentication state shifts (login, logout, token refreshes)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Unsubscribe from listener when the component unmounts to prevent memory leaks
    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    loading,
    signUp,
    login,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Block child rendering until Firebase SDK finishes initialization */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
