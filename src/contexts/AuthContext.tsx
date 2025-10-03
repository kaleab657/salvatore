import React, { useEffect, useState, createContext, useContext } from 'react';
import { User as FirebaseUser, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase/config';
// Define the User type that extends FirebaseUser with our custom fields
export interface User extends FirebaseUser {
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
}
// Define the context type
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  isGuest: boolean;
  signInWithGoogle: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: any) => Promise<void>;
  continueAsGuest: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(localStorage.getItem('isGuest') === 'true');
  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user as User;
      // Check if user exists in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      // If user doesn't exist in Firestore, create a new user document
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          phoneNumber: user.phoneNumber || '',
          photoURL: user.photoURL,
          location: '',
          bio: '',
          createdAt: new Date().toISOString()
        });
      }
      // Store auth state in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.removeItem('isGuest');
      setIsGuest(false);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };
  // Sign in with email and password
  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.removeItem('isGuest');
      setIsGuest(false);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };
  // Sign up with email and password
  const signup = async (email: string, password: string, name: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Update profile with display name
      await updateProfile(result.user, {
        displayName: name
      });
      // Create user document in Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        displayName: name,
        email: result.user.email,
        phoneNumber: '',
        photoURL: '',
        location: '',
        bio: '',
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.removeItem('isGuest');
      setIsGuest(false);
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };
  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('isGuest');
      setIsGuest(false);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };
  // Reset password
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  };
  // Update user profile
  const updateUserProfile = async (data: any) => {
    if (!currentUser) throw new Error('No user is signed in');
    try {
      // Update auth profile if name or photo changed
      if (data.displayName || data.photoURL) {
        await updateProfile(currentUser, {
          displayName: data.displayName || currentUser.displayName,
          photoURL: data.photoURL || currentUser.photoURL
        });
      }
      // Update user document in Firestore
      await setDoc(doc(db, 'users', currentUser.uid), {
        ...data,
        updatedAt: new Date().toISOString()
      }, {
        merge: true
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };
  // Continue as guest
  const continueAsGuest = () => {
    localStorage.setItem('isGuest', 'true');
    localStorage.setItem('isAuthenticated', 'true'); // Allow access to protected routes
    setIsGuest(true);
  };
  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user as User);
      setLoading(false);
    });
    return unsubscribe;
  }, []);
  const value = {
    currentUser,
    loading,
    isGuest,
    signInWithGoogle,
    login,
    signup,
    logout,
    resetPassword,
    updateUserProfile,
    continueAsGuest
  };
  return <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>;
};