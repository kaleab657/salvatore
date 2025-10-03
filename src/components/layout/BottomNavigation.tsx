import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home as HomeIcon, Search as SearchIcon, PlusCircle as PlusCircleIcon, MessageCircle as MessageCircleIcon, User as UserIcon, AlertCircle as AlertCircleIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    isGuest
  } = useAuth();
  const navItems = [{
    path: '/home',
    icon: <HomeIcon />,
    label: 'Home',
    guestAccessible: true
  }, {
    path: '/search',
    icon: <SearchIcon />,
    label: 'Search',
    guestAccessible: true
  }, {
    path: '/post-ad',
    icon: <PlusCircleIcon />,
    label: 'Sell',
    guestAccessible: false
  }, {
    path: '/chat-list',
    icon: <MessageCircleIcon />,
    label: 'Chat',
    guestAccessible: false
  }, {
    path: '/profile',
    icon: <UserIcon />,
    label: 'Profile',
    guestAccessible: false
  }];
  const handleNavItemClick = (path: string, guestAccessible: boolean) => {
    if (isGuest && !guestAccessible) {
      navigate('/login', {
        state: {
          from: path,
          message: 'Please sign in to access this feature'
        }
      });
    } else {
      navigate(path);
    }
  };
  return <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200">
      <div className="flex justify-between px-4 py-2">
        {navItems.map(item => {
        const isActive = location.pathname === item.path;
        return <div key={item.path} onClick={() => handleNavItemClick(item.path, item.guestAccessible)} className={`flex flex-col items-center py-1 px-3 cursor-pointer ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
              <div className="w-6 h-6">{item.icon}</div>
              <span className="text-xs mt-1">{item.label}</span>
            </div>;
      })}
      </div>
    </div>;
};
export default BottomNavigation;