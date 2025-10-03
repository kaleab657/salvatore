import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft as ArrowLeftIcon, Send as SendIcon, Image as ImageIcon, MoreVertical as MoreVerticalIcon, Phone as PhoneIcon, Loader as LoaderIcon } from 'lucide-react';
import BottomNavigation from '../components/layout/BottomNavigation';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../services/userService';
import { createOrGetChat, sendMessage, subscribeToMessages, markMessagesAsRead, Message } from '../services/messageService';
import { UserProfile } from '../services/userService';
interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
  read: boolean;
}
const Chat: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    currentUser
  } = useAuth();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  // Get other user info from location state or params
  const otherUserId = location.state?.otherUserId || '';
  const productInfo = location.state?.product;
  const [otherUser, setOtherUser] = useState<UserProfile | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  // Fetch other user profile and create/get chat
  useEffect(() => {
    const initializeChat = async () => {
      if (!currentUser || !otherUserId) {
        setLoading(false);
        return;
      }
      try {
        // Fetch other user profile
        const userProfile = await getUserProfile(otherUserId);
        setOtherUser(userProfile);
        // Create or get chat
        const newChatId = await createOrGetChat(currentUser.uid, otherUserId);
        setChatId(newChatId);
      } catch (error) {
        console.error('Error initializing chat:', error);
      } finally {
        setLoading(false);
      }
    };
    initializeChat();
  }, [currentUser, otherUserId]);
  // Subscribe to messages
  useEffect(() => {
    if (!chatId) return;
    const unsubscribe = subscribeToMessages(chatId, newMessages => {
      setMessages(newMessages.map(msg => ({
        id: msg.id!,
        senderId: msg.senderId,
        text: msg.text,
        createdAt: msg.createdAt,
        read: msg.read
      })));
      // Mark messages as read
      if (currentUser) {
        markMessagesAsRead(chatId, currentUser.uid).catch(error => {
          console.error('Error marking messages as read:', error);
        });
      }
    });
    return () => unsubscribe();
  }, [chatId, currentUser]);
  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  // Handle sending a message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser || !otherUser || !chatId) return;
    setSendingMessage(true);
    try {
      await sendMessage(chatId, currentUser.uid, otherUser.uid, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };
  // Format timestamp
  const formatTime = (timestamp: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  // Format date for message groups
  const formatDate = (timestamp: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };
  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: {
      date: string;
      messages: ChatMessage[];
    }[] = [];
    messages.forEach(message => {
      const messageDate = formatDate(message.createdAt);
      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup.date === messageDate) {
        lastGroup.messages.push(message);
      } else {
        groups.push({
          date: messageDate,
          messages: [message]
        });
      }
    });
    return groups;
  };
  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <LoaderIcon className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading chat...</p>
      </div>;
  }
  if (!otherUser) {
    return <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm p-6 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Chat Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The chat you're looking for doesn't exist or you don't have access.
          </p>
          <button onClick={() => navigate('/chat-list')} className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg">
            Go to Chat List
          </button>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white px-4 py-3 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="mr-3">
            <ArrowLeftIcon className="w-6 h-6 text-gray-800" />
          </button>
          <div className="flex items-center" onClick={() => navigate(`/user/${otherUser.uid}`)}>
            <img src={otherUser.photoURL || 'https://via.placeholder.com/40?text=User'} alt={otherUser.displayName} className="w-10 h-10 rounded-full object-cover mr-3" />
            <div>
              <h2 className="font-medium text-gray-900">
                {otherUser.displayName}
              </h2>
              <p className="text-xs text-gray-500">
                {otherUser.location || 'No location'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center" onClick={() => window.location.href = `tel:${otherUser.phoneNumber}`}>
            <PhoneIcon className="w-5 h-5 text-gray-700" />
          </button>
          <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
            <MoreVerticalIcon className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </header>

      {/* Product Info (if available) */}
      {productInfo && <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <div className="flex items-center">
            <img src={productInfo.image} alt={productInfo.title} className="w-12 h-12 rounded-md object-cover mr-3" />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 text-sm">
                {productInfo.title}
              </h3>
              <p className="text-blue-600 font-bold text-sm">
                {productInfo.price.toLocaleString()} ETB
              </p>
            </div>
          </div>
        </div>}

      {/* Chat Messages */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50" style={{
      minHeight: '60vh'
    }}>
        {groupMessagesByDate().map((group, groupIndex) => <div key={groupIndex} className="space-y-3">
            <div className="flex justify-center">
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {group.date}
              </span>
            </div>
            {group.messages.map((msg, msgIndex) => {
          const isCurrentUser = currentUser && msg.senderId === currentUser.uid;
          return <div key={msg.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${isCurrentUser ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none shadow-sm'}`}>
                    <p>{msg.text}</p>
                    <div className={`text-xs mt-1 flex items-center ${isCurrentUser ? 'text-blue-100 justify-end' : 'text-gray-500'}`}>
                      {formatTime(msg.createdAt)}
                      {isCurrentUser && <span className="ml-1">{msg.read ? '✓✓' : '✓'}</span>}
                    </div>
                  </div>
                </div>;
        })}
          </div>)}
        {messages.length === 0 && <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MessageIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No messages yet
            </h3>
            <p className="text-gray-500 max-w-xs">
              Send a message to start the conversation with{' '}
              {otherUser.displayName}
            </p>
          </div>}
      </div>

      {/* Message Input */}
      <div className="bg-white px-4 py-3 border-t border-gray-200">
        <div className="flex items-center">
          <button className="p-2 rounded-full hover:bg-gray-100 mr-2">
            <ImageIcon className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex-1 relative">
            <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type a message..." className="w-full py-2 px-4 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" onKeyPress={e => {
            if (e.key === 'Enter' && !sendingMessage) {
              handleSendMessage();
            }
          }} />
          </div>
          <button className={`p-2 rounded-full ml-2 ${newMessage.trim() && !sendingMessage ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`} onClick={handleSendMessage} disabled={!newMessage.trim() || sendingMessage}>
            {sendingMessage ? <LoaderIcon className="w-6 h-6 animate-spin" /> : <SendIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <BottomNavigation />
    </div>;
};
const MessageIcon = ({
  className
}: {
  className?: string;
}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>;
export default Chat;