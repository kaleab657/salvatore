import React, { createElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft as ArrowLeftIcon, User as UserIcon, Lock as LockIcon, Bell as BellIcon, Shield as ShieldIcon, HelpCircle as HelpCircleIcon, Info as InfoIcon, ChevronRight as ChevronRightIcon, LogOut as LogOutIcon } from 'lucide-react';
import BottomNavigation from '../components/layout/BottomNavigation';
import { useAuth } from '../contexts/AuthContext';
const Settings: React.FC = () => {
  const navigate = useNavigate();
  const {
    logout
  } = useAuth();
  const handleEditProfile = () => {
    navigate('/edit-profile');
  };
  const handleLogout = async () => {
    // Show confirmation dialog
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      try {
        await logout();
        // Show logout success message with timeout
        const message = document.createElement('div');
        message.className = 'fixed top-0 left-0 right-0 bg-green-500 text-white text-center py-3 z-50';
        message.textContent = 'Successfully logged out';
        document.body.appendChild(message);
        setTimeout(() => {
          document.body.removeChild(message);
          navigate('/login');
        }, 1500);
      } catch (error) {
        console.error('Error logging out:', error);
        alert('Failed to log out. Please try again.');
      }
    }
  };
  return <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white px-4 py-3 shadow-sm flex items-center">
        <button onClick={() => navigate('/profile')} className="mr-3">
          <ArrowLeftIcon className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Settings</h1>
      </header>
      <div className="mt-4 px-4 space-y-4">
        {/* Account Settings */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <h3 className="px-4 py-3 text-sm font-medium text-gray-500 border-b border-gray-100">
            ACCOUNT SETTINGS
          </h3>
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 cursor-pointer active:bg-gray-50" onClick={handleEditProfile}>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <UserIcon className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-medium text-gray-800">Edit Profile</span>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 cursor-pointer active:bg-gray-50" onClick={() => navigate('/change-password')}>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <LockIcon className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-medium text-gray-800">Change Password</span>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        {/* Preferences */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <h3 className="px-4 py-3 text-sm font-medium text-gray-500 border-b border-gray-100">
            PREFERENCES
          </h3>
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 cursor-pointer active:bg-gray-50" onClick={() => navigate('/notifications-settings')}>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <BellIcon className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-medium text-gray-800">Notifications</span>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 cursor-pointer active:bg-gray-50" onClick={() => navigate('/privacy-settings')}>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <ShieldIcon className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-medium text-gray-800">
                Privacy & Security
              </span>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        {/* Support */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <h3 className="px-4 py-3 text-sm font-medium text-gray-500 border-b border-gray-100">
            SUPPORT
          </h3>
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 cursor-pointer active:bg-gray-50" onClick={() => navigate('/help')}>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <HelpCircleIcon className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-medium text-gray-800">Help Center</span>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 cursor-pointer active:bg-gray-50" onClick={() => navigate('/about')}>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <InfoIcon className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-medium text-gray-800">About</span>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        {/* Logout Button */}
        <div className="mt-8">
          <button onClick={handleLogout} className="flex items-center justify-center w-full py-3 text-red-600 font-medium bg-white rounded-xl shadow-sm">
            <LogOutIcon className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>
      </div>
      <BottomNavigation />
    </div>;
};
export default Settings;