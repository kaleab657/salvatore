import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, MessageSquare as MessageSquareIcon, Loader as LoaderIcon } from 'lucide-react';
import Header from '../components/layout/Header';
import BottomNavigation from '../components/layout/BottomNavigation';
import { useAuth } from '../contexts/AuthContext';
import { getUserChats, subscribeToUserChats, Chat } from '../services/messageService';
import { getUserProfile } from '../services/userService';
import { UserProfile } from '../services/userService';
interface ChatWithUserInfo extends Chat {
  otherUser: UserProfile | null;
  lastMessageTime: string;
}
const ChatList: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    isGuest
  } = useAuth();
  const [chats, setChats] = useState<ChatWithUserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    if (isGuest) {
      navigate('/login', {
        state: {
          message: 'Please sign in to access messages'
        }
      });
      return;
    }
    if (!currentUser) return;
    const fetchChats = async () => {
      setLoading(true);
      try {
        // Set up real-time subscription to chats
        const unsubscribe = subscribeToUserChats(currentUser.uid, async fetchedChats => {
          const enhancedChats = await Promise.all(fetchedChats.map(async chat => {
            // Find the other user in the chat
            const otherUserId = chat.participants.find(id => id !== currentUser.uid);
            let otherUser = null;
            if (otherUserId) {
              otherUser = await getUserProfile(otherUserId);
            }
            // Format the last message timestamp
            let lastMessageTime = '';
            if (chat.lastMessageTimestamp) {
              const date = new Date(chat.lastMessageTimestamp);
              const now = new Date();
              const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
              if (diffDays === 0) {
                lastMessageTime = date.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                });
              } else if (diffDays === 1) {
                lastMessageTime = 'Yesterday';
              } else if (diffDays < 7) {
                lastMessageTime = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
              } else {
                lastMessageTime = date.toLocaleDateString();
              }
            }
            return {
              ...chat,
              otherUser,
              lastMessageTime
            };
          }));
          setChats(enhancedChats);
          setLoading(false);
        });
        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching chats:', error);
        setLoading(false);
      }
    };
    fetchChats();
  }, [currentUser, navigate, isGuest]);
  const handleChatSelect = (chatId: string, otherUserId: string) => {
    navigate('/chat', {
      state: {
        chatId,
        otherUserId
      }
    });
  };
  const filteredChats = chats.filter(chat => {
    if (!searchTerm) return true;
    return chat.otherUser?.displayName?.toLowerCase().includes(searchTerm.toLowerCase());
  });
  return <div className="min-h-screen bg-gray-50 pb-20">
      <Header showBack title="Messages" />
      <div className="p-4">
        {/* Search Box */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input type="text" className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search conversations..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        {loading ? <div className="flex flex-col items-center justify-center py-12">
            <LoaderIcon className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading conversations...</p>
          </div> : filteredChats.length === 0 ? <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MessageSquareIcon className="w-8 h-8 text-gray-400" />
            </div>
            {searchTerm ? <>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No matches found
                </h3>
                <p className="text-gray-500 text-center">
                  Try a different search term
                </p>
              </> : <>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No messages yet
                </h3>
                <p className="text-gray-500 text-center">
                  Start a conversation by contacting a seller
                </p>
              </>}
          </div> : <div className="space-y-2">
            {filteredChats.map(chat => {
          const otherUser = chat.otherUser;
          const unreadCount = chat.unreadCount?.[currentUser?.uid || ''] || 0;
          const otherUserId = chat.participants.find(id => id !== currentUser?.uid) || '';
          return <div key={chat.id} className="bg-white rounded-xl p-3 shadow-sm flex items-center cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors" onClick={() => handleChatSelect(chat.id, otherUserId)}>
                  <div className="relative">
                    <img src={otherUser?.photoURL || 'https://via.placeholder.com/40?text=User'} alt={otherUser?.displayName || 'User'} className="w-12 h-12 rounded-full object-cover" />
                    {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-900">
                        {otherUser?.displayName || 'Unknown User'}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {chat.lastMessageTime}
                      </span>
                    </div>
                    <p className={`text-sm ${unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-600'} truncate pr-4`}>
                      {chat.lastMessage || 'No messages yet'}
                    </p>
                  </div>
                </div>;
        })}
          </div>}
      </div>
      <BottomNavigation />
    </div>;
};
export default ChatList;