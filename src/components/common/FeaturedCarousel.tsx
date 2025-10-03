import React from 'react';
import { ChevronRight as ChevronRightIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
interface FeaturedProduct {
  id: number;
  title: string;
  price: number;
  location: string;
  category: string;
  image: string;
  date: string;
  isFeatured: boolean;
}
interface FeaturedCarouselProps {
  products: FeaturedProduct[];
}
const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({
  products
}) => {
  const navigate = useNavigate();
  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };
  const handleViewAll = () => {
    navigate('/all-listings', {
      state: {
        filter: 'featured'
      }
    });
  };
  return <div className="relative">
      <div className="overflow-x-auto pb-4 hide-scrollbar">
        <div className="flex space-x-4 px-1">
          {products.map(product => <div key={product.id} className="flex-shrink-0 w-72 relative cursor-pointer" onClick={() => handleProductClick(product.id)}>
              <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full">
                <div className="relative">
                  <img src={product.image} alt={product.title} className="w-full h-48 object-cover" />
                  <span className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs py-1 px-3 rounded-full font-medium shadow-sm">
                    Featured
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent h-16"></div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 text-lg truncate">
                    {product.title}
                  </h3>
                  <p className="text-blue-600 font-bold mt-1 text-lg">
                    {product.price.toLocaleString()} ETB
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-500">
                      {product.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {product.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>)}
        </div>
      </div>
      {/* Right shadow indicator for scrolling */}
      <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
      {/* View All button */}
      <button onClick={handleViewAll} className="absolute top-0 right-0 flex items-center text-blue-600 text-sm font-medium">
        View All
        <ChevronRightIcon className="w-4 h-4 ml-1" />
      </button>
      {/* Custom style for hiding scrollbar but keeping functionality */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>;
};
export default FeaturedCarousel;