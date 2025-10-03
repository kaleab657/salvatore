import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car as CarIcon, Home as HomeIcon, Smartphone as SmartphoneIcon, Laptop as LaptopIcon, Tv as TvIcon, Refrigerator as RefrigeratorIcon, Armchair as ArmchairIcon, Shirt as ShirtIcon, Sparkles as SparklesIcon, ShoppingBag as ShoppingBagIcon, Dumbbell as DumbbellIcon, Dog as DogIcon, Bone as BoneIcon, MoreHorizontal as MoreHorizontalIcon, Briefcase as BriefcaseIcon, Wrench as WrenchIcon, Flame as FlameIcon } from 'lucide-react';
import { categories } from '../../utils/data';
interface CategoryScrollProps {
  showTrending?: boolean;
}
const CategoryScroll: React.FC<CategoryScrollProps> = ({
  showTrending = true
}) => {
  const navigate = useNavigate();
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'car':
        return <CarIcon className="w-5 h-5" />;
      case 'home':
        return <HomeIcon className="w-5 h-5" />;
      case 'smartphone':
        return <SmartphoneIcon className="w-5 h-5" />;
      case 'laptop':
        return <LaptopIcon className="w-5 h-5" />;
      case 'tv':
        return <TvIcon className="w-5 h-5" />;
      case 'refrigerator':
        return <RefrigeratorIcon className="w-5 h-5" />;
      case 'armchair':
        return <ArmchairIcon className="w-5 h-5" />;
      case 'shirt':
        return <ShirtIcon className="w-5 h-5" />;
      case 'sparkles':
        return <SparklesIcon className="w-5 h-5" />;
      case 'shopping-bag':
        return <ShoppingBagIcon className="w-5 h-5" />;
      case 'dumbbell':
        return <DumbbellIcon className="w-5 h-5" />;
      case 'dog':
        return <DogIcon className="w-5 h-5" />;
      case 'bone':
        return <BoneIcon className="w-5 h-5" />;
      case 'briefcase':
        return <BriefcaseIcon className="w-5 h-5" />;
      case 'wrench':
        return <WrenchIcon className="w-5 h-5" />;
      case 'more-horizontal':
        return <MoreHorizontalIcon className="w-5 h-5" />;
      case 'flame':
        return <FlameIcon className="w-5 h-5" />;
      default:
        return <MoreHorizontalIcon className="w-5 h-5" />;
    }
  };
  const handleCategoryClick = (id: number, name: string) => {
    navigate(`/category/${id}`, {
      state: {
        categoryName: name
      }
    });
  };
  const handleTrendingClick = () => {
    navigate('/trending');
  };
  return <div className="overflow-x-auto pb-2 hide-scrollbar">
      <div className="flex space-x-3 px-1 min-w-max">
        {showTrending && <div className="flex flex-col items-center cursor-pointer" onClick={handleTrendingClick}>
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mb-1">
              <FlameIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-center font-medium text-gray-800 w-16 truncate">
              Trending
            </span>
          </div>}
        {categories.map(category => <div key={category.id} className="flex flex-col items-center cursor-pointer active:opacity-80 transition-opacity" onClick={() => handleCategoryClick(category.id, category.name)}>
            <div className="flex items-center justify-center w-14 h-14 bg-gray-100 rounded-full mb-1 hover:bg-blue-50 transition-colors">
              <div className="text-gray-700 hover:text-blue-600 transition-colors">
                {getIcon(category.icon)}
              </div>
            </div>
            <span className="text-xs text-center font-medium text-gray-800 w-16 truncate">
              {category.name}
            </span>
          </div>)}
      </div>
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
export default CategoryScroll;