import { initializeApp, getApps, getApp, FirebaseApp, FirebaseOptions } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getRemoteConfig, RemoteConfig } from "firebase/remote-config";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Fail gracefully when config is missing to avoid fatal build-time errors
const isConfigValid = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

let app: FirebaseApp = null as unknown as FirebaseApp;
let auth: Auth = null as unknown as Auth;
let db: Firestore = null as unknown as Firestore;
let googleProvider: GoogleAuthProvider = null as unknown as GoogleAuthProvider;
let remoteConfig: RemoteConfig | null = null;

if (isConfigValid) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });

    // Initialize optional Remote Config in client browser context
    if (typeof window !== "undefined") {
      try {
        remoteConfig = getRemoteConfig(app);
        remoteConfig.settings.minimumFetchIntervalMillis = 60000;
        remoteConfig.defaultConfig = {
          anomaly_threshold_density: 0.85,
          anomaly_threshold_congestion: 0.80,
          operational_gemini_model: "gemini-3.1-flash-lite",
          maintenance_mode_active: false
        };
      } catch (rcErr) {
        console.warn("Firebase Remote Config initialization skipped (optional):", rcErr);
      }
    }
  } catch (err) {
    console.error("Firebase services initialization failed:", err);
  }
} else {
  console.warn("Firebase configuration is missing. Ensure NEXT_PUBLIC_FIREBASE_* environment variables are set.");
}

export { app, auth, db, googleProvider, remoteConfig };
