import React, { useState } from "react";
import { Send, ArrowLeft } from "lucide-react";
import { Message, Chat } from "../types";

const Messages: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messageText, setMessageText] = useState("");

  // Demo data
  const demoChats: Chat[] = [
    {
      id: "1",
      participants: ["user1", "user2"],
      lastMessage: {
        id: "1",
        chatId: "1",
        senderId: "user2",
        receiverId: "user1",
        text: "Is the car still available?",
        timestamp: new Date("2024-01-15T10:30:00"),
      },
      createdAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      participants: ["user1", "user3"],
      lastMessage: {
        id: "2",
        chatId: "2",
        senderId: "user1",
        receiverId: "user3",
        text: "I am interested in your house",
        timestamp: new Date("2024-01-14T15:45:00"),
      },
      createdAt: new Date("2024-01-14"),
    },
  ];

  const demoMessages: Message[] = [
    {
      id: "1",
      chatId: "1",
      senderId: "user2",
      receiverId: "user1",
      text: "Hi, I saw your Toyota Corolla ad",
      timestamp: new Date("2024-01-15T10:00:00"),
    },
    {
      id: "2",
      chatId: "1",
      senderId: "user1",
      receiverId: "user2",
      text: "Hello! Yes, it is still available",
      timestamp: new Date("2024-01-15T10:15:00"),
    },
    {
      id: "3",
      chatId: "1",
      senderId: "user2",
      receiverId: "user1",
      text: "Is the car still available?",
      timestamp: new Date("2024-01-15T10:30:00"),
    },
  ];

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedChat) return;
    
    // TODO: Implement Firebase message sending
    console.log("Sending message:", messageText);
    setMessageText("");
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (selectedChat) {
    const chatMessages = demoMessages.filter(msg => msg.chatId === selectedChat.id);
    
    return (
      <div className="pb-20 h-screen flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSelectedChat(null)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">U</span>
            </div>
            <div>
              <h3 className="font-medium">User</h3>
              <p className="text-sm text-gray-500">Online</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === "user1" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.senderId === "user1"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.senderId === "user1" ? "text-blue-100" : "text-gray-500"
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-xl font-bold text-gray-900">Messages</h1>
      </div>

      <div className="space-y-1">
        {demoChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => setSelectedChat(chat)}
            className="bg-white p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">U</span>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">User</h3>
                <p className="text-sm text-gray-500 truncate">
                  {chat.lastMessage?.text}
                </p>
              </div>
              <div className="text-xs text-gray-400">
                {formatTime(chat.lastMessage?.timestamp || new Date())}
              </div>
            </div>
          </div>
        ))}
      </div>

      {demoChats.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No messages yet.</p>
        </div>
      )}
    </div>
  );
};

export default Messages;
