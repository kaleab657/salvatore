import { collection, doc, addDoc, getDoc, getDocs, query, where, orderBy, serverTimestamp, onSnapshot, Timestamp, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
export interface Message {
  id?: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  text: string;
  read: boolean;
  createdAt: any;
}
export interface Chat {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTimestamp: any;
  unreadCount: {
    [userId: string]: number;
  };
}
// Create or get a chat between two users
export const createOrGetChat = async (userId1: string, userId2: string): Promise<string> => {
  try {
    // Create a unique chat ID by sorting and joining the user IDs
    const participants = [userId1, userId2].sort();
    const chatId = participants.join('_');
    // Check if the chat already exists
    const chatRef = doc(db, 'chats', chatId);
    const chatDoc = await getDoc(chatRef);
    if (!chatDoc.exists()) {
      // Create a new chat
      await setDoc(chatRef, {
        participants,
        lastMessage: '',
        lastMessageTimestamp: null,
        unreadCount: {
          [userId1]: 0,
          [userId2]: 0
        }
      });
    }
    return chatId;
  } catch (error) {
    console.error('Error creating or getting chat:', error);
    throw error;
  }
};
// Send a message
export const sendMessage = async (chatId: string, senderId: string, receiverId: string, text: string): Promise<string> => {
  try {
    // Add message to messages collection
    const messageRef = await addDoc(collection(db, 'messages'), {
      chatId,
      senderId,
      receiverId,
      text,
      read: false,
      createdAt: serverTimestamp()
    });
    // Update chat with last message info
    const chatRef = doc(db, 'chats', chatId);
    const chatDoc = await getDoc(chatRef);
    if (chatDoc.exists()) {
      const chatData = chatDoc.data() as Chat;
      // Increment unread count for receiver
      const unreadCount = chatData.unreadCount || {};
      unreadCount[receiverId] = (unreadCount[receiverId] || 0) + 1;
      await updateDoc(chatRef, {
        lastMessage: text,
        lastMessageTimestamp: serverTimestamp(),
        unreadCount
      });
    }
    return messageRef.id;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};
// Get messages for a chat
export const getMessages = async (chatId: string): Promise<Message[]> => {
  try {
    const q = query(collection(db, 'messages'), where('chatId', '==', chatId), orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(q);
    const messages: Message[] = [];
    querySnapshot.forEach(doc => {
      const data = doc.data();
      messages.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : null
      } as Message);
    });
    return messages;
  } catch (error) {
    console.error('Error getting messages:', error);
    throw error;
  }
};
// Subscribe to messages for a chat
export const subscribeToMessages = (chatId: string, callback: (messages: Message[]) => void) => {
  const q = query(collection(db, 'messages'), where('chatId', '==', chatId), orderBy('createdAt', 'asc'));
  return onSnapshot(q, querySnapshot => {
    const messages: Message[] = [];
    querySnapshot.forEach(doc => {
      const data = doc.data();
      messages.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : null
      } as Message);
    });
    callback(messages);
  });
};
// Get all chats for a user
export const getUserChats = async (userId: string): Promise<Chat[]> => {
  try {
    const q = query(collection(db, 'chats'), where('participants', 'array-contains', userId), orderBy('lastMessageTimestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    const chats: Chat[] = [];
    querySnapshot.forEach(doc => {
      const data = doc.data();
      chats.push({
        id: doc.id,
        ...data,
        lastMessageTimestamp: data.lastMessageTimestamp instanceof Timestamp ? data.lastMessageTimestamp.toDate().toISOString() : null
      } as Chat);
    });
    return chats;
  } catch (error) {
    console.error('Error getting user chats:', error);
    throw error;
  }
};
// Subscribe to user chats
export const subscribeToUserChats = (userId: string, callback: (chats: Chat[]) => void) => {
  const q = query(collection(db, 'chats'), where('participants', 'array-contains', userId), orderBy('lastMessageTimestamp', 'desc'));
  return onSnapshot(q, querySnapshot => {
    const chats: Chat[] = [];
    querySnapshot.forEach(doc => {
      const data = doc.data();
      chats.push({
        id: doc.id,
        ...data,
        lastMessageTimestamp: data.lastMessageTimestamp instanceof Timestamp ? data.lastMessageTimestamp.toDate().toISOString() : null
      } as Chat);
    });
    callback(chats);
  });
};
// Mark messages as read
export const markMessagesAsRead = async (chatId: string, userId: string): Promise<void> => {
  try {
    // Update all unread messages from the other user
    const q = query(collection(db, 'messages'), where('chatId', '==', chatId), where('receiverId', '==', userId), where('read', '==', false));
    const querySnapshot = await getDocs(q);
    const batch = [];
    querySnapshot.forEach(doc => {
      batch.push(updateDoc(doc.ref, {
        read: true
      }));
    });
    if (batch.length > 0) {
      await Promise.all(batch);
      // Reset unread count in the chat
      const chatRef = doc(db, 'chats', chatId);
      const chatDoc = await getDoc(chatRef);
      if (chatDoc.exists()) {
        const chatData = chatDoc.data() as Chat;
        const unreadCount = chatData.unreadCount || {};
        unreadCount[userId] = 0;
        await updateDoc(chatRef, {
          unreadCount
        });
      }
    }
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
};