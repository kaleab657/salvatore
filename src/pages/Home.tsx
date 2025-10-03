import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryScroll from '../components/common/CategoryScroll';
import ProductCard from '../components/common/ProductCard';
import FeaturedCarousel from '../components/common/FeaturedCarousel';
import BottomNavigation from '../components/layout/BottomNavigation';
import Header from '../components/layout/Header';
import { getListings, getFeaturedListings, Listing } from '../services/listingService';
import { Loader as LoaderIcon } from 'lucide-react';
const Home: React.FC = () => {
  const navigate = useNavigate();
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [recentListings, setRecentListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  // Fetch listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Fetch featured listings
        const featured = await getFeaturedListings(4);
        setFeaturedListings(featured);
        // Fetch recent listings
        const {
          listings
        } = await getListings(null, 4);
        setRecentListings(listings);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);
  const handleViewAllClick = () => {
    navigate('/all-listings', {
      state: {
        filter: 'recent'
      }
    });
  };
  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <LoaderIcon className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading listings...</p>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header with Search */}
      <Header showLogo={true} showSearch={true} showNotification={true} />
      <div className="px-4 py-3">
        {/* Categories Horizontal Scroll */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Categories
          </h2>
          <CategoryScroll showTrending={true} />
        </div>
        {/* Featured Listings Carousel */}
        {featuredListings.length > 0 && <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-900">Featured</h2>
            </div>
            <FeaturedCarousel products={featuredListings} />
          </div>}
        {/* Recent Listings */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Listings
            </h2>
            <button className="text-blue-600 text-sm font-medium flex items-center" onClick={handleViewAllClick}>
              View All
            </button>
          </div>
          {recentListings.length === 0 ? <div className="bg-white rounded-xl p-6 text-center">
              <p className="text-gray-500">No listings available yet</p>
            </div> : <div className="grid grid-cols-2 gap-3">
              {recentListings.map(listing => <ProductCard key={listing.id} id={listing.id!} title={listing.title} price={listing.price} location={listing.location} category={listing.category} image={listing.images[0] || 'https://via.placeholder.com/300x200?text=No+Image'} date={new Date(listing.createdAt).toLocaleDateString()} isFeatured={listing.isFeatured} />)}
            </div>}
        </div>
      </div>
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>;
};
export default Home;