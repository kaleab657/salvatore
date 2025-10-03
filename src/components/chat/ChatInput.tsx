import React, { useState, useRef } from 'react';
import { Send as SendIcon, Mic as MicIcon, Smile as SmileIcon, Paperclip as PaperclipIcon, Image as ImageIcon, Camera as CameraIcon, X as XIcon } from 'lucide-react';
interface ChatInputProps {
  onSendMessage: (message: string, isImage?: boolean) => void;
}
const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage
}) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imagePreview) {
      onSendMessage(imagePreview, true);
      setImagePreview(null);
      return;
    }
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };
  const handleEmojiClick = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload this to a server
      // For this demo, we'll use sample images
      const sampleImages = ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000&auto=format&fit=crop', 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=1000&auto=format&fit=crop', 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1000&auto=format&fit=crop', 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1000&auto=format&fit=crop'];
      const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
      setImagePreview(randomImage);
      setShowAttachMenu(false);
    }
  };
  const emojis = ['😊', '👍', '❤️', '🙏', '😂', '🎉', '👋', '🔥', '👌', '✅', '⭐', '🤔', '🚗', '💰', '📱', '🏠', '📦', '🔍', '⏰', '✨'];
  return <div className="bg-white border-t border-gray-200 px-4 py-3 relative">
      {/* Emoji picker */}
      {showEmojiPicker && <div className="absolute bottom-16 left-0 right-0 mx-4 bg-white rounded-xl shadow-lg border border-gray-200 p-3 z-10">
          <div className="flex flex-wrap gap-2">
            {emojis.map(emoji => <button key={emoji} onClick={() => handleEmojiClick(emoji)} className="text-xl p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                {emoji}
              </button>)}
          </div>
        </div>}
      {/* Attachment menu */}
      {showAttachMenu && <div className="absolute bottom-16 left-0 right-0 mx-4 bg-white rounded-xl shadow-lg border border-gray-200 p-3 z-10">
          <div className="flex justify-around">
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => fileInputRef.current?.click()}>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                <ImageIcon className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs text-gray-700">Gallery</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-1">
                <CameraIcon className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs text-gray-700">Camera</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-1">
                <PaperclipIcon className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs text-gray-700">Document</span>
            </button>
          </div>
        </div>}
      {/* Hidden file input */}
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />
      {/* Image preview */}
      {imagePreview && <div className="mb-3 relative">
          <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            <button onClick={() => setImagePreview(null)} className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1">
              <XIcon className="w-3 h-3 text-white" />
            </button>
          </div>
        </div>}
      <form onSubmit={handleSubmit} className="flex items-center">
        <button type="button" className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100" onClick={() => {
        setShowEmojiPicker(!showEmojiPicker);
        setShowAttachMenu(false);
      }}>
          <SmileIcon className="w-5 h-5" />
        </button>
        <button type="button" className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 mr-1" onClick={() => {
        setShowAttachMenu(!showAttachMenu);
        setShowEmojiPicker(false);
      }}>
          <PaperclipIcon className="w-5 h-5" />
        </button>
        <div className="flex-1 relative">
          {!imagePreview && <input ref={inputRef} type="text" value={message} onChange={e => setMessage(e.target.value)} placeholder="Type a message..." className="w-full rounded-full py-2.5 px-4 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white border border-transparent focus:border-blue-300" />}
        </div>
        {message.trim() || imagePreview ? <button type="submit" className="ml-2 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            <SendIcon className="w-5 h-5" />
          </button> : <button type="button" className="ml-2 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            <MicIcon className="w-5 h-5" />
          </button>}
      </form>
    </div>;
};
export default ChatInput;