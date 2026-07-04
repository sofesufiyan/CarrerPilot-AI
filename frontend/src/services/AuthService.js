import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut 
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase";

/**
 * Maps standard Firebase Auth error codes into descriptive user-facing messages.
 * 
 * @param {Object} error - The original error object thrown by Firebase.
 * @returns {string} - A clean, descriptive user-facing message.
 */
const mapAuthError = (error) => {
  if (!error) return "An unknown authentication error occurred.";
  
  switch (error.code) {
    case "auth/email-already-in-use":
      return "This email address is already registered.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password.";
    case "auth/popup-closed-by-user":
      return "Google sign-in popup was closed before completion.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    default:
      return error.message || "An authentication error occurred.";
  }
};

/**
 * Registers a new user with Email and Password.
 * 
 * @param {string} email - User email address
 * @param {string} password - User password (>= 6 characters)
 * @returns {Promise<import("firebase/auth").UserCredential>}
 */
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    throw new Error(mapAuthError(error));
  }
};

/**
 * Authenticates a user with Email and Password.
 * 
 * @param {string} email - User email address
 * @param {string} password - User password
 * @returns {Promise<import("firebase/auth").UserCredential>}
 */
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    throw new Error(mapAuthError(error));
  }
};

/**
 * Authenticates a user with Google Sign-In (Popup-based OAuth).
 * 
 * @returns {Promise<import("firebase/auth").UserCredential>}
 */
export const loginWithGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    return userCredential;
  } catch (error) {
    throw new Error(mapAuthError(error));
  }
};

/**
 * Invalidates the current user session and signs them out.
 * 
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(mapAuthError(error));
  }
};
