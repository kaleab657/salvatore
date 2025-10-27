import React, { useState } from "react";
import { Edit, Settings, Heart, LogOut, User, MapPin } from "lucide-react";

const Profile: React.FC = () => {
  const [user] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    location: "Addis Ababa, Ethiopia",
    bio: "I am a seller on Salvatore Marketplace.",
  });

  const handleLogout = () => {
    // TODO: Implement Firebase logout
    console.log("Logging out...");
  };

  return (
    <div className="pb-20">
      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <img
            src={user.photo}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{user.location}</span>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Edit className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        
        {user.bio && (
          <p className="text-gray-600 mt-4">{user.bio}</p>
        )}
      </div>

      {/* Profile Actions */}
      <div className="bg-white">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">My Account</h2>
          
          <div className="space-y-2">
            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Edit Profile</span>
              </div>
              <Edit className="h-4 w-4 text-gray-400" />
            </button>
            
            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <Settings className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Settings</span>
              </div>
              <Edit className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">My Listings</h2>
          
          <div className="space-y-2">
            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-600" />
                <span className="font-medium">My Ads</span>
              </div>
              <span className="text-sm text-gray-500">5 ads</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <Heart className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Wishlist</span>
              </div>
              <span className="text-sm text-gray-500">12 items</span>
            </button>
          </div>
        </div>

        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white mt-4 p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">5</div>
            <div className="text-sm text-gray-600">Active Ads</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">12</div>
            <div className="text-sm text-gray-600">Total Views</div>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">8</div>
            <div className="text-sm text-gray-600">Messages</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">3</div>
            <div className="text-sm text-gray-600">Favorites</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
