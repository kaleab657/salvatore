import React from "react";
import { Category } from "../types";

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow min-w-[100px]"
    >
      <div className="text-3xl mb-2">{category.icon}</div>
      <span className="text-sm font-medium text-gray-700 text-center">
        {category.name}
      </span>
    </button>
  );
};

export default CategoryCard;
