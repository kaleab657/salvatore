import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';
export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  photoURL: string;
  location: string;
  bio: string;
  createdAt: string;
  updatedAt?: string;
}
// Get user profile
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};
// Update user profile
export const updateUserProfile = async (userId: string, data: Partial<UserProfile>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...data,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};
// Upload profile picture
export const uploadProfilePicture = async (userId: string, file: File): Promise<string> => {
  try {
    const storageRef = ref(storage, `users/${userId}/profile.${file.name.split('.').pop()}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    // Update user profile with new photo URL
    await updateDoc(doc(db, 'users', userId), {
      photoURL: downloadURL,
      updatedAt: new Date().toISOString()
    });
    return downloadURL;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
};