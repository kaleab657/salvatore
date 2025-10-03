import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft as ArrowLeftIcon, Bell as BellIcon } from 'lucide-react';
import SearchBar from '../common/SearchBar';
interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showNotification?: boolean;
  showLogo?: boolean;
}
const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  showSearch = false,
  showNotification = false,
  showLogo = false
}) => {
  const navigate = useNavigate();
  return <header className="bg-white px-4 py-3 shadow-sm sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          {showBack && <button onClick={() => navigate(-1)} className="mr-3">
              <ArrowLeftIcon className="w-6 h-6 text-gray-800" />
            </button>}
          {showLogo && <div className="flex items-center">
              <img src="/Salvatore_Buy_and_Sell_Logo.png" alt="Salvatore Marketplace" className="h-8 w-8 mr-2" />
              <h1 className="text-lg font-semibold text-gray-900">
                Salvatore Marketplace
              </h1>
            </div>}
          {title && !showLogo && <h1 className="text-lg font-semibold text-gray-900">{title}</h1>}
        </div>
        {showNotification && <button className="ml-2">
            <BellIcon className="w-6 h-6 text-gray-800" />
          </button>}
      </div>
      {showSearch && <div className="mt-3">
          <SearchBar />
        </div>}
    </header>;
};
export default Header;