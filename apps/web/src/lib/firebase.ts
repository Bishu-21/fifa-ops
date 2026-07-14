import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getRemoteConfig, RemoteConfig } from "firebase/remote-config";

const getFirebaseConfig = () => {
  if (typeof window !== "undefined" && (window as any).__FIREBASE_CONFIG__) {
    return (window as any).__FIREBASE_CONFIG__;
  }
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
};

const firebaseConfig = getFirebaseConfig();

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Standard adjustments for popups
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Safe Client-side Remote Config Initialization
let remoteConfig: RemoteConfig | null = null;
if (typeof window !== "undefined") {
  try {
    remoteConfig = getRemoteConfig(app);
    // Set minimal settings for local dev (fetch every 1 minute instead of default 12 hours)
    remoteConfig.settings.minimumFetchIntervalMillis = 60000; 
    remoteConfig.defaultConfig = {
      anomaly_threshold_density: 0.85,
      anomaly_threshold_congestion: 0.80,
      operational_gemini_model: "gemini-3.1-flash-lite",
      maintenance_mode_active: false
    };
  } catch (err) {
    console.warn("Firebase Remote Config failed to initialize (e.g., SSR or missing SDK support):", err);
  }
}

export { app, auth, db, googleProvider, remoteConfig };
