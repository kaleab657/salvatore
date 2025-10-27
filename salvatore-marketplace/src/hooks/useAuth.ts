import { useState, useEffect } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser 
} from "firebase/auth";
import { auth } from "../firebase/config";
import { createUser, getUser } from "../utils/firebase";
import { User } from "../types";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Get user data from Firestore
        const userData = await getUser(firebaseUser.uid);
        if (userData) {
          setUser(userData);
        } else {
          // Create new user if not exists
          const newUser: Omit<User, "id" | "createdAt"> = {
            name: firebaseUser.displayName || "User",
            email: firebaseUser.email || "",
            photo: firebaseUser.photoURL || undefined,
          };
          await createUser(newUser);
          setUser({ ...newUser, id: firebaseUser.uid, createdAt: new Date() });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, name: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const newUser: Omit<User, "id" | "createdAt"> = {
      name,
      email,
    };
    await createUser(newUser);
    return result;
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result;
  };

  const logout = async () => {
    return await signOut(auth);
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
  };
};
