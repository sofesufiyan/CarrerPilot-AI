import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration using Vite environment variables to prevent hardcoding secrets.
// These variables must be defined in your frontend environment configuration (.env file).
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize the Firebase App instance
const app = console.log("Firebase Config:", firebaseConfig);

// Initialize Firebase Authentication client
export const auth = getAuth(app);

// Instantiate Google Auth Provider for Google Sign-In support
export const googleProvider = new GoogleAuthProvider();

export default app;
