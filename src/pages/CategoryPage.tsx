import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft as ArrowLeftIcon } from 'lucide-react';
import Header from '../components/layout/Header';
import ProductCard from '../components/common/ProductCard';
import BottomNavigation from '../components/layout/BottomNavigation';
import { categories, featuredListings } from '../utils/data';
const CategoryPage: React.FC = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const location = useLocation();
  const navigate = useNavigate();
  const categoryName = location.state?.categoryName || 'Category';
  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    if (!id) return;
    // In a real app, you'd fetch products by category ID
    // For demo purposes, we'll filter the featured listings
    const categoryId = parseInt(id);
    const category = categories.find(c => c.id === categoryId);
    if (!category) {
      // Handle invalid category
      navigate('/home');
      return;
    }
    // Filter products by category name
    const filteredProducts = featuredListings.filter(product => product.category === category.name);
    // If no products in this category, show all products
    setProducts(filteredProducts.length > 0 ? filteredProducts : featuredListings);
  }, [id, navigate]);
  return <div className="min-h-screen bg-gray-50 pb-20">
      <Header showBack title={categoryName} />
      <div className="p-4">
        {products.length > 0 ? <div className="grid grid-cols-2 gap-3">
            {products.map(product => <ProductCard key={product.id} id={product.id} title={product.title} price={product.price} location={product.location} category={product.category} image={product.image} date={product.date} isFeatured={product.isFeatured} />)}
          </div> : <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ArrowLeftIcon className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No listings found
            </h3>
            <p className="text-gray-500 text-center">
              There are no listings in this category yet.
            </p>
          </div>}
      </div>
      <BottomNavigation />
    </div>;
};
export default CategoryPage;