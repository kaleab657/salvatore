import React from 'react';
import Header from '../components/layout/Header';
import ProductCard from '../components/common/ProductCard';
import BottomNavigation from '../components/layout/BottomNavigation';
import { featuredListings } from '../utils/data';
import { Flame as FlameIcon } from 'lucide-react';
const TrendingPage: React.FC = () => {
  // In a real app, you would fetch trending listings
  // For demo purposes, we'll use the featuredListings data
  const trendingListings = [...featuredListings].sort(() => Math.random() - 0.5);
  return <div className="min-h-screen bg-gray-50 pb-20">
      <Header showBack title="Trending" />
      <div className="p-4">
        <div className="mb-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-4 flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mr-3">
            <FlameIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Trending Now</h3>
            <p className="text-sm text-gray-600">
              Popular items people are viewing
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {trendingListings.map(product => <ProductCard key={product.id} id={product.id} title={product.title} price={product.price} location={product.location} category={product.category} image={product.image} date={product.date} isFeatured={false} />)}
        </div>
      </div>
      <BottomNavigation />
    </div>;
};
export default TrendingPage;