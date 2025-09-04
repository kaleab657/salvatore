import React, { useState } from "react";
import { Search } from "lucide-react";
import AdCard from "../components/AdCard";
import CategoryCard from "../components/CategoryCard";
import { categories, demoAds } from "../data/demoData";


const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredAds = demoAds.filter((ad) => {
    const matchesSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ad.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || ad.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pb-20">
      {/* Search Bar */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search ads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
            />
          ))}
        </div>
      </div>

      {/* Featured Ads */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {selectedCategory ? `${selectedCategory} Ads` : "Featured Ads"}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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

export default Home;
