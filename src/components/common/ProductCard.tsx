import React from 'react';
import { MapPin as MapPinIcon, Clock as ClockIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  location: string;
  category: string;
  image: string;
  date: string;
  isFeatured?: boolean;
}
const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  price,
  location,
  category,
  image,
  date,
  isFeatured = false
}) => {
  return <Link to={`/product/${id}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="relative">
          <img src={image} alt={title} className="w-full h-40 object-cover" />
          {isFeatured && <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs py-1 px-2 rounded-full">
              Featured
            </span>}
        </div>
        <div className="p-3">
          <h3 className="font-medium text-gray-900 truncate">{title}</h3>
          <p className="text-blue-600 font-bold mt-1">
            {price.toLocaleString()} ETB
          </p>
          <div className="flex items-center mt-2 text-xs text-gray-500">
            <MapPinIcon className="w-3 h-3 mr-1" />
            <span>{location}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">{category}</span>
            <div className="flex items-center text-xs text-gray-500">
              <ClockIcon className="w-3 h-3 mr-1" />
              <span>{date}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>;
};
export default ProductCard;