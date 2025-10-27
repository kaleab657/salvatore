import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Star } from "lucide-react";
import { Ad } from "../types";

interface AdCardProps {
  ad: Ad;
}

const AdCard: React.FC<AdCardProps> = ({ ad }) => {
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div
      onClick={() => navigate(`/ad/${ad.id}`)}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="relative">
        <img
          src={ad.images[0] || "https://via.placeholder.com/300x200"}
          alt={ad.title}
          className="w-full h-48 object-cover"
        />
        {ad.featured && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
            Featured
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full p-1">
          <Star className="h-4 w-4 text-yellow-400" />
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {ad.title}
        </h3>
        
        <div className="text-lg font-bold text-blue-600 mb-2">
          {formatPrice(ad.price)}
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{ad.location.city}, {ad.location.subCity}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formatDate(ad.createdAt)}</span>
          </div>
          <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
            {ad.condition}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdCard;
