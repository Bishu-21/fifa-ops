'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  signInAnonymously, 
  updateProfile 
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isDemo: boolean;
  getOperatorIdentity: () => string;
  loginWithGoogle: () => Promise<void>;
  loginAsDemo: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    if (!auth) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 0);
      return () => clearTimeout(timer);
    }
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsDemo(!!(firebaseUser && firebaseUser.isAnonymous));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      if (!auth || !googleProvider) {
        throw new Error("Firebase Auth is not configured or disabled.");
      }
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google Sign-in failed:', error);
      throw error;
    }
  };

  const loginAsDemo = async () => {
    try {
      if (!auth) {
        throw new Error("Firebase Auth is not configured or disabled.");
      }
      const credential = await signInAnonymously(auth);
      // Give a default name so the steward has some identity in the UI
      await updateProfile(credential.user, {
        displayName: 'Accredited Steward (Sector South)'
      });
      setIsDemo(true);
    } catch (error) {
      console.error('Demo Sign-in failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (!auth) return;
      await signOut(auth);
    } catch (error) {
      console.error('Sign-out failed:', error);
    }
  };

  // Centralized Identity Helper to ensure consistent format in Firestore records
  const getOperatorIdentity = () => {
    if (!user) return 'Guest_User';
    // If anonymous, prefix it explicitly with "DEMO_" so it's obvious in Firestore
    if (user.isAnonymous) {
      return `DEMO_Steward_${user.uid.substring(0, 5)}`;
    }
    // Avoid assuming user.email always exists. Fallback to displayName or uid prefix
    return user.email || user.displayName || `Steward_${user.uid.substring(0, 5)}`;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isDemo, 
      getOperatorIdentity, 
      loginWithGoogle, 
      loginAsDemo, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
