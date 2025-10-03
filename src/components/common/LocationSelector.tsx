import React, { useEffect, useState, useRef } from 'react';
import { MapPin as MapPinIcon, ChevronDown as ChevronDownIcon } from 'lucide-react';
interface LocationSelectorProps {
  value: string;
  onChange: (location: string) => void;
  className?: string;
}
const LocationSelector: React.FC<LocationSelectorProps> = ({
  value,
  onChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // List of Ethiopian cities
  const locations = ['Addis Ababa', 'Dire Dawa', 'Mekelle', 'Gondar', 'Bahir Dar', 'Hawassa', 'Adama', 'Jimma', 'Dessie', 'Debre Birhan', 'Sodo', 'Shashemene', 'Arba Minch', 'Hosaena', 'Dilla', 'Nekemte', 'Debre Markos', 'Kombolcha', 'Harar', 'Jigjiga'];
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const handleLocationSelect = (location: string) => {
    onChange(location);
    setIsOpen(false);
  };
  return <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPinIcon className="h-5 w-5 text-gray-400" />
        </div>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
        </div>
        <input type="text" className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer" placeholder="Select location" value={value} readOnly />
      </div>
      {isOpen && <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
          {locations.map(location => <div key={location} className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${location === value ? 'bg-blue-50 text-blue-600' : ''}`} onClick={() => handleLocationSelect(location)}>
              {location}
            </div>)}
        </div>}
    </div>;
};
export default LocationSelector;