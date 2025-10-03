import React, { useState, Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
interface SearchBarProps {
  placeholder?: string;
  className?: string;
}
const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search products, categories...',
  className = ''
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };
  return <form onSubmit={handleSearch} className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={placeholder} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
    </form>;
};
export default SearchBar;