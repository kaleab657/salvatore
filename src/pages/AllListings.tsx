import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import ProductCard from '../components/common/ProductCard';
import BottomNavigation from '../components/layout/BottomNavigation';
import { featuredListings } from '../utils/data';
import Pagination from '../components/common/Pagination';
const AllListings: React.FC = () => {
  const location = useLocation();
  const filter = location.state?.filter || 'all';
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  // Items per page
  const itemsPerPage = 10;
  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [filter]);
  // In a real app, you would fetch listings based on the filter
  // For demo purposes, we'll use the featuredListings data and duplicate them to simulate many listings
  const generateMockListings = () => {
    // Create a large array of listings by duplicating the existing ones
    let listings = [...featuredListings];
    // Duplicate listings to simulate 100+ items
    for (let i = 0; i < 5; i++) {
      const newListings = featuredListings.map((item, index) => ({
        ...item,
        id: item.id + featuredListings.length * (i + 1),
        title: `${item.title} ${i + 2}`,
        date: i < 2 ? `${i + 1} hours ago` : `${i + 1} days ago`
      }));
      listings = [...listings, ...newListings];
    }
    if (filter === 'featured') {
      listings = listings.filter(item => item.isFeatured);
    } else if (filter === 'recent') {
      // Sort by date (newest first)
      listings = listings.sort((a, b) => {
        if (a.date.includes('hour') && !b.date.includes('hour')) return -1;
        if (!a.date.includes('hour') && b.date.includes('hour')) return 1;
        if (a.date.includes('day') && b.date.includes('day')) {
          return parseInt(a.date) - parseInt(b.date);
        }
        return 0;
      });
    }
    return listings;
  };
  const allListings = generateMockListings();
  // For pagination
  const totalPages = Math.ceil(allListings.length / itemsPerPage);
  // Get current page items
  const currentListings = allListings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  // Featured listings to show at top
  const featuredItems = filter !== 'featured' ? allListings.filter(item => item.isFeatured).slice(0, 4) : [];
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo(0, 0);
  };
  const title = filter === 'featured' ? 'Featured Listings' : filter === 'recent' ? 'Recent Listings' : 'All Listings';
  return <div className="min-h-screen bg-gray-50 pb-20">
      <Header showBack title={title} />
      <div className="p-4">
        {/* Loading State */}
        {isLoading ? <div className="space-y-4">
            {[...Array(4)].map((_, index) => <div key={index} className="grid grid-cols-2 gap-3">
                {[...Array(2)].map((_, subIndex) => <div key={`${index}-${subIndex}`} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                    <div className="h-40 bg-gray-200"></div>
                    <div className="p-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>)}
              </div>)}
          </div> : <>
            {/* Featured Items at Top (if not already on featured page) */}
            {featuredItems.length > 0 && <>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Featured
                </h3>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {featuredItems.map(product => <ProductCard key={`featured-${product.id}`} id={product.id} title={product.title} price={product.price} location={product.location} category={product.category} image={product.image} date={product.date} isFeatured={true} />)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  All Listings
                </h3>
              </>}
            {/* Main Listings */}
            <div className="grid grid-cols-2 gap-3">
              {currentListings.map(product => <ProductCard key={product.id} id={product.id} title={product.title} price={product.price} location={product.location} category={product.category} image={product.image} date={product.date} isFeatured={product.isFeatured} />)}
            </div>
            {/* Pagination */}
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />}
          </>}
      </div>
      <BottomNavigation />
    </div>;
};
export default AllListings;