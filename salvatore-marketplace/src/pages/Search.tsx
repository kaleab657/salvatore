import React, { useState } from "react";
import { Search as SearchIcon, Filter, Grid, List } from "lucide-react";
import AdCard from "../components/AdCard";
import { categories, cities, demoAds } from "../data/demoData";
import { FilterOptions } from "../types";

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<FilterOptions>({});

  const filteredAds = demoAds.filter((ad) => {
    const matchesSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ad.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filters.category || ad.category === filters.category;
    const matchesPrice = (!filters.minPrice || ad.price >= filters.minPrice) &&
                        (!filters.maxPrice || ad.price <= filters.maxPrice);
    const matchesCity = !filters.city || ad.location.city === filters.city;
    const matchesSubCity = !filters.subCity || ad.location.subCity === filters.subCity;
    const matchesCondition = !filters.condition || ad.condition === filters.condition;
    
    return matchesSearch && matchesCategory && matchesPrice && matchesCity && matchesSubCity && matchesCondition;
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="pb-20">
      {/* Search Header */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search ads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="h-5 w-5" />
          </button>
          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-3 ${viewMode === "grid" ? "bg-blue-500 text-white" : "bg-white"}`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-3 ${viewMode === "list" ? "bg-blue-500 text-white" : "bg-white"}`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-4 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filters.category || ""}
                onChange={(e) => handleFilterChange("category", e.target.value || undefined)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <select
                value={filters.city || ""}
                onChange={(e) => handleFilterChange("city", e.target.value || undefined)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
              <select
                value={filters.condition || ""}
                onChange={(e) => handleFilterChange("condition", e.target.value || undefined)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Conditions</option>
                <option value="New">New</option>
                <option value="Used">Used</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ""}
                  onChange={(e) => handleFilterChange("minPrice", e.target.value ? Number(e.target.value) : undefined)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || ""}
                  onChange={(e) => handleFilterChange("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {filteredAds.length} ads found
          </h2>
        </div>
        
        <div className={`grid gap-4 ${
          viewMode === "grid" 
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "grid-cols-1"
        }`}>
          {filteredAds.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
        
        {filteredAds.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No ads found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
