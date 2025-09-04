import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  Timestamp 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase/config";
import { Ad, User, Message } from "../types";

// Ads
export const createAd = async (adData: Omit<Ad, "id" | "createdAt" | "updatedAt">) => {
  const docRef = await addDoc(collection(db, "ads"), {
    ...adData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateAd = async (id: string, updates: Partial<Ad>) => {
  const docRef = doc(db, "ads", id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
};

export const deleteAd = async (id: string) => {
  const docRef = doc(db, "ads", id);
  await deleteDoc(docRef);
};

export const getAds = async (filters?: any) => {
  let q = query(collection(db, "ads"));
  
  if (filters?.category) {
    q = query(q, where("category", "==", filters.category));
  }
  if (filters?.userId) {
    q = query(q, where("userId", "==", filters.userId));
  }
  if (filters?.featured) {
    q = query(q, where("featured", "==", true));
  }
  
  q = query(q, orderBy("createdAt", "desc"));
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as Ad[];
};

export const getAd = async (id: string) => {
  const docRef = doc(db, "ads", id);
  const snapshot = await getDoc(docRef);
  
  if (snapshot.exists()) {
    return {
      id: snapshot.id,
      ...snapshot.data(),
      createdAt: snapshot.data().createdAt?.toDate(),
      updatedAt: snapshot.data().updatedAt?.toDate(),
    } as Ad;
  }
  return null;
};

// Users
export const createUser = async (userData: Omit<User, "id" | "createdAt">) => {
  const docRef = await addDoc(collection(db, "users"), {
    ...userData,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateUser = async (id: string, updates: Partial<User>) => {
  const docRef = doc(db, "users", id);
  await updateDoc(docRef, updates);
};

export const getUser = async (id: string) => {
  const docRef = doc(db, "users", id);
  const snapshot = await getDoc(docRef);
  
  if (snapshot.exists()) {
    return {
      id: snapshot.id,
      ...snapshot.data(),
      createdAt: snapshot.data().createdAt?.toDate(),
    } as User;
  }
  return null;
};

// Messages
export const sendMessage = async (messageData: Omit<Message, "id" | "timestamp">) => {
  const docRef = await addDoc(collection(db, "messages"), {
    ...messageData,
    timestamp: Timestamp.now(),
  });
  return docRef.id;
};

export const getMessages = async (chatId: string) => {
  const q = query(
    collection(db, "messages"),
    where("chatId", "==", chatId),
    orderBy("timestamp", "asc")
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp?.toDate(),
  })) as Message[];
};

export const subscribeToMessages = (chatId: string, callback: (messages: Message[]) => void) => {
  const q = query(
    collection(db, "messages"),
    where("chatId", "==", chatId),
    orderBy("timestamp", "asc")
  );
  
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate(),
    })) as Message[];
    callback(messages);
  });
};

// Storage
export const uploadImage = async (file: File, path: string) => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
};

export const uploadAdImages = async (files: File[], adId: string) => {
  const uploadPromises = files.map((file, index) => {
    const path = `ads/${adId}/${index}_${file.name}`;
    return uploadImage(file, path);
  });
  
  return await Promise.all(uploadPromises);
};
