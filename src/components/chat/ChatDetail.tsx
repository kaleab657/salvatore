import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft as ArrowLeftIcon, Phone as PhoneIcon, MoreVertical as MoreVerticalIcon, ThumbsUp as ThumbsUpIcon, Heart as HeartIcon, Smile as SmileIcon, Frown as FrownIcon, Image as ImageIcon, Check as CheckIcon, CheckCheck as CheckCheckIcon, ExternalLink as ExternalLinkIcon } from 'lucide-react';
import ChatInput from './ChatInput';
import MessageBubble from './MessageBubble';
interface Reaction {
  type: 'like' | 'love' | 'smile' | 'sad';
  count: number;
}
interface Message {
  id: number;
  text: string;
  sender: 'me' | 'other';
  time: string;
  isImage?: boolean;
  isRead?: boolean;
  reactions?: Reaction[];
  productContext?: {
    id: number;
    title: string;
    image: string;
    price: number;
  };
}
interface ConversationProps {
  id: number;
  name: string;
  avatar: string;
  isTyping?: boolean;
  product: {
    id: number;
    title: string;
    image: string;
    price: number;
  };
}
interface ChatDetailProps {
  conversation: ConversationProps;
  onBack: () => void;
}
const ChatDetail: React.FC<ChatDetailProps> = ({
  conversation,
  onBack
}) => {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(conversation.isTyping || false);
  const [messages, setMessages] = useState<Message[]>([{
    id: 1,
    text: 'Hi, is this still available?',
    sender: 'other',
    time: 'Yesterday, 10:30 AM',
    isRead: true,
    productContext: conversation.product
  }, {
    id: 2,
    text: "Yes, it's still available!",
    sender: 'me',
    time: 'Yesterday, 11:45 AM',
    isRead: true
  }, {
    id: 3,
    text: 'Great! Is the price negotiable?',
    sender: 'other',
    time: 'Yesterday, 12:15 PM',
    isRead: true,
    reactions: [{
      type: 'like',
      count: 1
    }]
  }, {
    id: 4,
    text: 'I can offer a small discount if you can pick it up today.',
    sender: 'me',
    time: 'Yesterday, 12:30 PM',
    isRead: true
  }, {
    id: 5,
    text: "That sounds good. I'm available after 5 PM. Would that work for you?",
    sender: 'other',
    time: 'Yesterday, 1:00 PM',
    isRead: true
  }, {
    id: 6,
    text: "Yes, that works for me. Let's meet at 5:30 PM.",
    sender: 'me',
    time: 'Yesterday, 1:15 PM',
    isRead: true,
    reactions: [{
      type: 'love',
      count: 1
    }]
  }, {
    id: 7,
    text: 'Perfect! See you then.',
    sender: 'other',
    time: 'Yesterday, 1:20 PM',
    isRead: true
  }, {
    id: 8,
    text: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=1000&auto=format&fit=crop',
    sender: 'other',
    time: 'Yesterday, 1:25 PM',
    isImage: true,
    isRead: false
  }, {
    id: 9,
    text: "Here's a photo of the product from another angle.",
    sender: 'other',
    time: 'Just now',
    isRead: false
  }]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  // Simulate typing indicator
  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          text: 'By the way, does it come with all the original accessories?',
          sender: 'other',
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          }),
          isRead: false,
          productContext: conversation.product
        }]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isTyping, conversation.product]);
  // Mark messages as read after a delay
  useEffect(() => {
    const unreadMessages = messages.filter(m => !m.isRead);
    if (unreadMessages.length > 0) {
      const timer = setTimeout(() => {
        setMessages(prev => prev.map(m => m.isRead ? m : {
          ...m,
          isRead: true
        }));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [messages]);
  const addReaction = (messageId: number, reactionType: 'like' | 'love' | 'smile' | 'sad') => {
    setMessages(prevMessages => prevMessages.map(msg => {
      if (msg.id === messageId) {
        const existingReactions = msg.reactions || [];
        const existingReaction = existingReactions.find(r => r.type === reactionType);
        let newReactions: Reaction[];
        if (existingReaction) {
          newReactions = existingReactions.map(r => r.type === reactionType ? {
            ...r,
            count: r.count + 1
          } : r);
        } else {
          newReactions = [...existingReactions, {
            type: reactionType,
            count: 1
          }];
        }
        return {
          ...msg,
          reactions: newReactions
        };
      }
      return msg;
    }));
  };
  const handleSendMessage = (text: string, isImage: boolean = false) => {
    const newMessage = {
      id: messages.length + 1,
      text,
      sender: 'me' as const,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      isImage,
      isRead: false
    };
    setMessages([...messages, newMessage]);
  };
  const handleViewProduct = (productId: number) => {
    navigate(`/product/${productId}`);
  };
  return <div className="flex flex-col h-full bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white px-4 py-3 shadow-sm flex items-center z-10">
        <button onClick={onBack} className="mr-3">
          <ArrowLeftIcon className="w-6 h-6 text-gray-800" />
        </button>
        <img src={conversation.avatar} alt={conversation.name} className="w-10 h-10 rounded-full object-cover mr-3" />
        <div className="flex-1">
          <h2 className="font-medium text-gray-900">{conversation.name}</h2>
          <div className="flex items-center">
            {isTyping ? <span className="text-xs text-green-600">Typing...</span> : <>
                <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                <span className="text-xs text-gray-500">Online</span>
              </>}
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <PhoneIcon className="w-5 h-5 text-gray-700" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <MoreVerticalIcon className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Product Info Banner */}
      <div className="bg-blue-50 p-3 flex items-center border-b border-blue-100">
        <div className="w-12 h-12 rounded-lg overflow-hidden mr-3">
          <img src={conversation.product.image} alt={conversation.product.title} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 text-sm">
            {conversation.product.title}
          </h3>
          <p className="text-sm text-gray-700">
            {conversation.product.price.toLocaleString()} ETB
          </p>
        </div>
        <button onClick={() => handleViewProduct(conversation.product.id)} className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium flex items-center">
          <ExternalLinkIcon className="w-3.5 h-3.5 mr-1" />
          View
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map(message => <MessageBubble key={message.id} message={message} onReaction={reactionType => addReaction(message.id, reactionType)} onViewProduct={handleViewProduct} />)}
        {isTyping && <div className="flex justify-start">
            <div className="bg-white rounded-2xl px-4 py-2.5 shadow-sm border border-gray-100 flex items-center space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{
            animationDelay: '0ms'
          }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{
            animationDelay: '150ms'
          }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{
            animationDelay: '300ms'
          }}></div>
            </div>
          </div>}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <ChatInput onSendMessage={handleSendMessage} />
    </div>;
};
export default ChatDetail;