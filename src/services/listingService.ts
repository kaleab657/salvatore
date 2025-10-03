import { collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy, limit, startAfter, DocumentData, QueryDocumentSnapshot, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';
export interface Listing {
  id?: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  images: string[];
  sellerType: string;
  condition?: string;
  contactMethod: string;
  phone?: string;
  features: Record<string, any>;
  isFeatured: boolean;
  userId: string;
  userDisplayName: string;
  userPhotoURL?: string;
  createdAt: any;
  updatedAt?: any;
}
// Create a new listing
export const createListing = async (listing: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'listings'), {
      ...listing,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating listing:', error);
    throw error;
  }
};
// Get a listing by ID
export const getListingById = async (id: string): Promise<Listing | null> => {
  try {
    const docRef = doc(db, 'listings', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString()
      } as Listing;
    }
    return null;
  } catch (error) {
    console.error('Error getting listing:', error);
    throw error;
  }
};
// Get all listings with pagination
export const getListings = async (lastVisible: QueryDocumentSnapshot<DocumentData> | null = null, pageSize: number = 10, filters: {
  category?: string;
  featured?: boolean;
} = {}): Promise<{
  listings: Listing[];
  lastVisible: QueryDocumentSnapshot<DocumentData> | null;
}> => {
  try {
    let q = collection(db, 'listings');
    let constraints: any[] = [orderBy('createdAt', 'desc'), limit(pageSize)];
    // Add filters if provided
    if (filters.category) {
      constraints.push(where('category', '==', filters.category));
    }
    if (filters.featured) {
      constraints.push(where('isFeatured', '==', true));
    }
    // Add pagination if lastVisible is provided
    if (lastVisible) {
      constraints.push(startAfter(lastVisible));
    }
    const querySnapshot = await getDocs(query(q, ...constraints));
    const listings: Listing[] = [];
    querySnapshot.forEach(doc => {
      const data = doc.data();
      listings.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString()
      } as Listing);
    });
    const newLastVisible = querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null;
    return {
      listings,
      lastVisible: newLastVisible
    };
  } catch (error) {
    console.error('Error getting listings:', error);
    throw error;
  }
};
// Get featured listings
export const getFeaturedListings = async (limit: number = 4): Promise<Listing[]> => {
  try {
    const q = query(collection(db, 'listings'), where('isFeatured', '==', true), orderBy('createdAt', 'desc'), limit(limit));
    const querySnapshot = await getDocs(q);
    const listings: Listing[] = [];
    querySnapshot.forEach(doc => {
      const data = doc.data();
      listings.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString()
      } as Listing);
    });
    return listings;
  } catch (error) {
    console.error('Error getting featured listings:', error);
    throw error;
  }
};
// Get listings by user ID
export const getUserListings = async (userId: string): Promise<Listing[]> => {
  try {
    const q = query(collection(db, 'listings'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const listings: Listing[] = [];
    querySnapshot.forEach(doc => {
      const data = doc.data();
      listings.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString()
      } as Listing);
    });
    return listings;
  } catch (error) {
    console.error('Error getting user listings:', error);
    throw error;
  }
};
// Update a listing
export const updateListing = async (id: string, data: Partial<Listing>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'listings', id), {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating listing:', error);
    throw error;
  }
};
// Delete a listing
export const deleteListing = async (id: string, images: string[]): Promise<void> => {
  try {
    // Delete the listing document
    await deleteDoc(doc(db, 'listings', id));
    // Delete all images associated with the listing
    for (const imageUrl of images) {
      try {
        // Extract the path from the URL
        const imagePath = imageUrl.split('o/')[1].split('?')[0];
        const decodedPath = decodeURIComponent(imagePath);
        const imageRef = ref(storage, decodedPath);
        await deleteObject(imageRef);
      } catch (error) {
        console.error('Error deleting image:', error);
        // Continue with the next image even if this one fails
      }
    }
  } catch (error) {
    console.error('Error deleting listing:', error);
    throw error;
  }
};
// Search listings
export const searchListings = async (searchTerm: string): Promise<Listing[]> => {
  try {
    // Note: Firestore doesn't support full-text search natively
    // This is a simple implementation that searches by title, description, and category
    // For a production app, consider using Algolia or a similar service
    const titleQuery = query(collection(db, 'listings'), where('title', '>=', searchTerm), where('title', '<=', searchTerm + '\uf8ff'), limit(20));
    const categoryQuery = query(collection(db, 'listings'), where('category', '>=', searchTerm), where('category', '<=', searchTerm + '\uf8ff'), limit(20));
    const [titleSnapshot, categorySnapshot] = await Promise.all([getDocs(titleQuery), getDocs(categoryQuery)]);
    const listings: Listing[] = [];
    const addedIds = new Set();
    // Add listings from title search
    titleSnapshot.forEach(doc => {
      if (!addedIds.has(doc.id)) {
        const data = doc.data();
        listings.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString()
        } as Listing);
        addedIds.add(doc.id);
      }
    });
    // Add listings from category search
    categorySnapshot.forEach(doc => {
      if (!addedIds.has(doc.id)) {
        const data = doc.data();
        listings.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString()
        } as Listing);
        addedIds.add(doc.id);
      }
    });
    return listings;
  } catch (error) {
    console.error('Error searching listings:', error);
    throw error;
  }
};
// Upload listing images
export const uploadListingImages = async (userId: string, listingId: string, files: File[]): Promise<string[]> => {
  try {
    const imageUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const storageRef = ref(storage, `listings/${userId}/${listingId}/${i}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      imageUrls.push(downloadURL);
    }
    return imageUrls;
  } catch (error) {
    console.error('Error uploading listing images:', error);
    throw error;
  }
};