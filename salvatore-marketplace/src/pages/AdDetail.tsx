import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Calendar, Phone, MessageCircle, Heart, Share2 } from "lucide-react";
import { demoAds } from "../data/demoData";

const AdDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const ad = demoAds.find(a => a.id === id);

  if (!ad) {
    return (
      <div className="pb-20 p-4 text-center">
        <h1 className="text-xl font-bold text-gray-900">Ad not found</h1>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="pb-20">
      {/* Images */}
      <div className="relative bg-white">
        <img
          src={ad.images[currentImageIndex] || "https://via.placeholder.com/400x300"}
          alt={ad.title}
          className="w-full h-64 md:h-96 object-cover"
        />
        
        {ad.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {ad.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentImageIndex ? "bg-white" : "bg-white bg-opacity-50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Ad Info */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{ad.title}</h1>
          <div className="flex space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Heart className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Share2 className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="text-2xl font-bold text-blue-600 mb-4">
          {formatPrice(ad.price)}
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{ad.location.city}, {ad.location.subCity}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <Calendar className="h-4 w-4 mr-1" />
          <span>Posted {formatDate(ad.createdAt)}</span>
        </div>
        
        <div className="flex space-x-2">
          <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
            <Phone className="h-4 w-4" />
            <span>Call</span>
          </button>
          <button 
            onClick={() => navigate("/messages")}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Message</span>
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
        <p className="text-gray-700 leading-relaxed">{ad.description}</p>
      </div>

      {/* Details */}
      <div className="bg-white p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Details</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-600">Category</span>
            <p className="font-medium">{ad.category}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Condition</span>
            <p className="font-medium">{ad.condition}</p>
          </div>
          
          {ad.fuelType && (
            <div>
              <span className="text-sm text-gray-600">Fuel Type</span>
              <p className="font-medium">{ad.fuelType}</p>
            </div>
          )}
          
          {ad.transmission && (
            <div>
              <span className="text-sm text-gray-600">Transmission</span>
              <p className="font-medium">{ad.transmission}</p>
            </div>
          )}
          
          {ad.kilometers && (
            <div>
              <span className="text-sm text-gray-600">Kilometers</span>
              <p className="font-medium">{ad.kilometers.toLocaleString()} km</p>
            </div>
          )}
          
          {ad.year && (
            <div>
              <span className="text-sm text-gray-600">Year</span>
              <p className="font-medium">{ad.year}</p>
            </div>
          )}
          
          {ad.bedrooms && (
            <div>
              <span className="text-sm text-gray-600">Bedrooms</span>
              <p className="font-medium">{ad.bedrooms}</p>
            </div>
          )}
          
          {ad.bathrooms && (
            <div>
              <span className="text-sm text-gray-600">Bathrooms</span>
              <p className="font-medium">{ad.bathrooms}</p>
            </div>
          )}
          
          {ad.area && (
            <div>
              <span className="text-sm text-gray-600">Area</span>
              <p className="font-medium">{ad.area} m²</p>
            </div>
          )}
          
          {ad.brand && (
            <div>
              <span className="text-sm text-gray-600">Brand</span>
              <p className="font-medium">{ad.brand}</p>
            </div>
          )}
          
          {ad.storage && (
            <div>
              <span className="text-sm text-gray-600">Storage</span>
              <p className="font-medium">{ad.storage}</p>
            </div>
          )}
          
          {ad.model && (
            <div>
              <span className="text-sm text-gray-600">Model</span>
              <p className="font-medium">{ad.model}</p>
            </div>
          )}
        </div>
      </div>

      {/* Seller Info */}
      <div className="bg-white p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Seller Information</h2>
        
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">J</span>
          </div>
          <div>
            <h3 className="font-medium">John Doe</h3>
            <p className="text-sm text-gray-600">Member since 2023</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdDetail;
