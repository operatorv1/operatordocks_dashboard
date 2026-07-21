import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported as analyticsSupported } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";

// Firebase web config for OperatorDocks.
// NOTE: Firebase web `apiKey` is a public identifier — safe to ship in client code.
// Restrict usage via Firebase Console → Authentication → Authorized domains
// and Google Cloud → API Key restrictions.
const API_KEY =
  import.meta.env.VITE_FIREBASE_API_KEY ?? "REPLACE_WITH_YOUR_WEB_API_KEY";

const firebaseConfig = {
  apiKey: "AIzaSyDwQShAFkrOHRH9M-eYgyGjMd2-AtMDOGs",
  authDomain: "operatordocks.firebaseapp.com",
  projectId: "operatordocks",
  storageBucket: "operatordocks.firebasestorage.app",
  messagingSenderId: "246537008195",
  appId: "1:246537008195:web:73d8f29847daba509490f6",
  measurementId: "G-DXKZGM4Y7Q"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();

// Only init Analytics when a real API key is present, otherwise Firebase
// spams 400s from firebaseinstallations.googleapis.com.
const hasRealKey = API_KEY && !API_KEY.startsWith("REPLACE_");
if (hasRealKey && typeof window !== "undefined") {
  analyticsSupported()
    .then((ok) => {
      if (ok) getAnalytics(firebaseApp);
    })
    .catch(() => {});
}

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  fbSignOut,
  onAuthStateChanged,
};
export type { User };
