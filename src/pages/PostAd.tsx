import React from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../utils/data';
import BottomNavigation from '../components/layout/BottomNavigation';
import Header from '../components/layout/Header';
const PostAd: React.FC = () => {
  const navigate = useNavigate();
  const handleSelectCategory = (categoryId: number) => {
    navigate(`/post-ad/${categoryId}`);
  };
  return <div className="min-h-screen bg-gray-50 pb-20">
      <Header showBack title="Post an Ad" />
      <div className="p-4">
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Select Category
          </h2>
          <div className="space-y-2">
            {categories.map(category => <div key={category.id} className="border border-gray-200 rounded-lg p-3 hover:border-blue-500 cursor-pointer" onClick={() => handleSelectCategory(category.id)}>
                <h3 className="font-medium text-gray-900">{category.name}</h3>
              </div>)}
          </div>
        </div>
      </div>
      <BottomNavigation />
    </div>;
};
export default PostAd;