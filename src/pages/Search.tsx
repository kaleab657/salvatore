import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Filter as FilterIcon, Grid as GridIcon, List as ListIcon, SlidersHorizontal as SlidersHorizontalIcon, X as XIcon, Loader as LoaderIcon, Search as SearchIcon } from 'lucide-react';
import Header from '../components/layout/Header';
import ProductCard from '../components/common/ProductCard';
import BottomNavigation from '../components/layout/BottomNavigation';
import { categories } from '../utils/data';
import Pagination from '../components/common/Pagination';
import { searchListings, Listing } from '../services/listingService';
const Search: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('q') || '';
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<{
    min: string;
    max: string;
  }>({
    min: '',
    max: ''
  });
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<Listing[]>([]);
  // Items per page
  const itemsPerPage = 10;
  // Fetch search results
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setSearchResults([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const results = await searchListings(query);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching listings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSearchResults();
  }, [query]);
  // Filter results based on filters
  const filteredProducts = searchResults.filter(product => {
    // Category filter
    const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
    // Price range filter
    const matchesMinPrice = priceRange.min === '' || product.price >= parseInt(priceRange.min);
    const matchesMaxPrice = priceRange.max === '' || product.price <= parseInt(priceRange.max);
    // Location filter
    const matchesLocation = locationFilter === '' || product.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesCategory && matchesMinPrice && matchesMaxPrice && matchesLocation;
  });
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, priceRange.min, priceRange.max, locationFilter]);
  // For pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo(0, 0);
  };
  const handleApplyFilters = () => {
    setShowFilters(false);
  };
  const handleClearFilters = () => {
    setSelectedCategory('');
    setPriceRange({
      min: '',
      max: ''
    });
    setLocationFilter('');
  };
  const isFiltersApplied = selectedCategory || priceRange.min || priceRange.max || locationFilter;
  return <div className="min-h-screen bg-gray-50 pb-20">
      <Header showBack title="Search Results" showSearch />
      {/* Filters Bar */}
      <div className="bg-white px-4 py-2 flex items-center justify-between border-b border-gray-200">
        <button className="flex items-center text-gray-700 text-sm" onClick={() => setShowFilters(!showFilters)}>
          <FilterIcon className="w-4 h-4 mr-1" />
          Filters{' '}
          {isFiltersApplied && <span className="ml-1 w-2 h-2 bg-blue-600 rounded-full"></span>}
        </button>
        <div className="flex items-center space-x-4">
          <button className={`p-1 ${viewMode === 'grid' ? 'bg-gray-100 rounded' : ''}`} onClick={() => setViewMode('grid')}>
            <GridIcon className="w-5 h-5 text-gray-700" />
          </button>
          <button className={`p-1 ${viewMode === 'list' ? 'bg-gray-100 rounded' : ''}`} onClick={() => setViewMode('list')}>
            <ListIcon className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
      {/* Filters Panel */}
      {showFilters && <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 flex justify-end">
          <div className="w-full max-w-md bg-white h-full overflow-y-auto animate-slide-in-right">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                <SlidersHorizontalIcon className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Filters</h3>
              </div>
              <button onClick={() => setShowFilters(false)}>
                <XIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-lg" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                  <option value="">All Categories</option>
                  {categories.map(category => <option key={category.id} value={category.name}>
                      {category.name}
                    </option>)}
                </select>
              </div>
              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range (ETB)
                </label>
                <div className="flex items-center space-x-2">
                  <input type="number" placeholder="Min" className="w-1/2 p-3 border border-gray-300 rounded-lg" value={priceRange.min} onChange={e => setPriceRange({
                ...priceRange,
                min: e.target.value
              })} />
                  <span className="text-gray-500">-</span>
                  <input type="number" placeholder="Max" className="w-1/2 p-3 border border-gray-300 rounded-lg" value={priceRange.max} onChange={e => setPriceRange({
                ...priceRange,
                max: e.target.value
              })} />
                </div>
              </div>
              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input type="text" placeholder="Enter location" className="w-full p-3 border border-gray-300 rounded-lg" value={locationFilter} onChange={e => setLocationFilter(e.target.value)} />
              </div>
              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                <button onClick={handleClearFilters} className="p-3 border border-gray-300 rounded-lg text-gray-700 font-medium">
                  Clear All
                </button>
                <button onClick={handleApplyFilters} className="p-3 bg-blue-600 rounded-lg text-white font-medium">
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>}
      {/* Search Results */}
      <div className="p-4">
        {query && <p className="text-sm text-gray-600 mb-3">
            {filteredProducts.length} results for "{query}"
          </p>}
        {/* Loading State */}
        {isLoading ? <div className="flex flex-col items-center justify-center py-10">
            <LoaderIcon className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Searching...</p>
          </div> : filteredProducts.length === 0 ? <div className="flex flex-col items-center justify-center py-10">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <SearchIcon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-700 text-center font-medium">
              No results found
            </p>
            <p className="text-gray-500 text-center text-sm mt-1">
              Try different keywords or filters
            </p>
          </div> : <>
            <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-3'}>
              {currentProducts.map(product => <ProductCard key={product.id} id={product.id!} title={product.title} price={product.price} location={product.location} category={product.category} image={product.images[0] || 'https://via.placeholder.com/300x200?text=No+Image'} date={new Date(product.createdAt).toLocaleDateString()} isFeatured={product.isFeatured} />)}
            </div>
            {/* Pagination */}
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />}
          </>}
      </div>
      <BottomNavigation />
      {/* Animation styles */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </div>;
};
export default Search;