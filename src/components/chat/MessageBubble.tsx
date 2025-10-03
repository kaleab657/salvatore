import React, { useState } from 'react';
import { ThumbsUp as ThumbsUpIcon, Heart as HeartIcon, Smile as SmileIcon, Frown as FrownIcon, ExternalLink as ExternalLinkIcon, Check as CheckIcon, CheckCheck as CheckCheckIcon } from 'lucide-react';
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
interface MessageBubbleProps {
  message: Message;
  onReaction: (type: 'like' | 'love' | 'smile' | 'sad') => void;
  onViewProduct: (productId: number) => void;
}
const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onReaction,
  onViewProduct
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const getReactionIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <ThumbsUpIcon className="w-3 h-3" />;
      case 'love':
        return <HeartIcon className="w-3 h-3" />;
      case 'smile':
        return <SmileIcon className="w-3 h-3" />;
      case 'sad':
        return <FrownIcon className="w-3 h-3" />;
      default:
        return <ThumbsUpIcon className="w-3 h-3" />;
    }
  };
  const handleLongPress = () => {
    setShowReactions(true);
  };
  return <div className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-[75%] relative group" onMouseEnter={() => setShowReactions(true)} onMouseLeave={() => setShowReactions(false)} onTouchStart={handleLongPress}>
        {/* Message bubble */}
        {message.isImage ? <div className={`rounded-2xl overflow-hidden ${message.sender === 'me' ? 'border-2 border-blue-500' : 'border border-gray-200 shadow-sm'}`}>
            <img src={message.text} alt="Shared image" className="max-w-full max-h-60 object-contain" />
          </div> : <div className={`rounded-2xl px-4 py-2.5 ${message.sender === 'me' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' : 'bg-white text-gray-800 border border-gray-100 shadow-sm'}`}>
            <p className="text-sm">{message.text}</p>
            {/* Product context for buyer messages */}
            {message.productContext && message.sender === 'other' && <div className="mt-2 pt-2 border-t border-gray-200 flex items-center">
                <div className="w-8 h-8 rounded-md overflow-hidden mr-2">
                  <img src={message.productContext.image} alt={message.productContext.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">
                    {message.productContext.title}
                  </p>
                  <p className="text-xs">
                    {message.productContext.price.toLocaleString()} ETB
                  </p>
                </div>
                <button onClick={() => onViewProduct(message.productContext!.id)} className={`ml-2 px-2 py-1 rounded-md text-xs font-medium
                    ${message.sender === 'me' ? 'bg-white bg-opacity-20 text-white' : 'bg-blue-100 text-blue-700'}`}>
                  <ExternalLinkIcon className="w-3 h-3" />
                </button>
              </div>}
          </div>}
        {/* Time and read status */}
        <div className={`flex items-center mt-1 ${message.sender === 'me' ? 'justify-end' : ''}`}>
          <span className="text-xs text-gray-500">{message.time}</span>
          {message.sender === 'me' && <span className="ml-1">
              {message.isRead ? <CheckCheckIcon className="w-3.5 h-3.5 text-blue-500" /> : <CheckIcon className="w-3.5 h-3.5 text-gray-400" />}
            </span>}
        </div>
        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && <div className={`flex items-center space-x-1 mt-1 ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            {message.reactions.map((reaction, index) => <div key={index} className="bg-white rounded-full px-1.5 py-0.5 flex items-center shadow-sm border border-gray-100">
                {getReactionIcon(reaction.type)}
                <span className="text-xs ml-0.5 text-gray-700">
                  {reaction.count}
                </span>
              </div>)}
          </div>}
        {/* Reaction options */}
        {showReactions && <div className={`absolute -top-8 ${message.sender === 'me' ? 'right-0' : 'left-0'} bg-white rounded-full shadow-md border border-gray-100 px-2 py-1 flex space-x-2 z-10`}>
            <button onClick={() => onReaction('like')} className="p-1 hover:bg-gray-100 rounded-full">
              <ThumbsUpIcon className="w-4 h-4 text-blue-500" />
            </button>
            <button onClick={() => onReaction('love')} className="p-1 hover:bg-gray-100 rounded-full">
              <HeartIcon className="w-4 h-4 text-red-500" />
            </button>
            <button onClick={() => onReaction('smile')} className="p-1 hover:bg-gray-100 rounded-full">
              <SmileIcon className="w-4 h-4 text-yellow-500" />
            </button>
            <button onClick={() => onReaction('sad')} className="p-1 hover:bg-gray-100 rounded-full">
              <FrownIcon className="w-4 h-4 text-gray-500" />
            </button>
          </div>}
      </div>
    </div>;
};
export default MessageBubble;