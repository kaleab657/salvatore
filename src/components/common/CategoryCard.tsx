import React from 'react';
import { Car as CarIcon, Home as HomeIcon, Smartphone as SmartphoneIcon, Laptop as LaptopIcon, Tv as TvIcon, Refrigerator as RefrigeratorIcon, Armchair as ArmchairIcon, Shirt as ShirtIcon, Sparkles as SparklesIcon, ShoppingBag as ShoppingBagIcon, Dumbbell as DumbbellIcon, Dog as DogIcon, Bone as BoneIcon, Briefcase as BriefcaseIcon, Wrench as WrenchIcon, MoreHorizontal as MoreHorizontalIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
interface CategoryCardProps {
  id: number;
  name: string;
  icon: string;
}
const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  name,
  icon
}) => {
  const navigate = useNavigate();
  const getIcon = () => {
    switch (icon) {
      case 'car':
        return <CarIcon className="w-6 h-6" />;
      case 'home':
        return <HomeIcon className="w-6 h-6" />;
      case 'smartphone':
        return <SmartphoneIcon className="w-6 h-6" />;
      case 'laptop':
        return <LaptopIcon className="w-6 h-6" />;
      case 'tv':
        return <TvIcon className="w-6 h-6" />;
      case 'refrigerator':
        return <RefrigeratorIcon className="w-6 h-6" />;
      case 'armchair':
        return <ArmchairIcon className="w-6 h-6" />;
      case 'shirt':
        return <ShirtIcon className="w-6 h-6" />;
      case 'sparkles':
        return <SparklesIcon className="w-6 h-6" />;
      case 'shopping-bag':
        return <ShoppingBagIcon className="w-6 h-6" />;
      case 'dumbbell':
        return <DumbbellIcon className="w-6 h-6" />;
      case 'dog':
        return <DogIcon className="w-6 h-6" />;
      case 'bone':
        return <BoneIcon className="w-6 h-6" />;
      case 'briefcase':
        return <BriefcaseIcon className="w-6 h-6" />;
      case 'wrench':
        return <WrenchIcon className="w-6 h-6" />;
      case 'more-horizontal':
        return <MoreHorizontalIcon className="w-6 h-6" />;
      default:
        return <MoreHorizontalIcon className="w-6 h-6" />;
    }
  };
  const handleCategoryClick = () => {
    navigate(`/category/${id}`, {
      state: {
        categoryName: name
      }
    });
  };
  return <div onClick={handleCategoryClick} className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer active:bg-blue-50">
      <div className="flex items-center justify-center w-12 h-12 mb-2 rounded-full bg-blue-50">
        <div className="text-blue-600">{getIcon()}</div>
      </div>
      <span className="text-xs text-center font-medium text-gray-800">
        {name}
      </span>
    </div>;
};
export default CategoryCard;