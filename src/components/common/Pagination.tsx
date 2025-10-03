import React from 'react';
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from 'lucide-react';
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  const renderPageNumbers = () => {
    const pages = [];
    // Always show first page
    if (currentPage > 3) {
      pages.push(<button key={1} onClick={() => onPageChange(1)} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-700">
          1
        </button>);
      // Add ellipsis if needed
      if (currentPage > 4) {
        pages.push(<span key="ellipsis-1" className="px-1 text-gray-500">
            ...
          </span>);
      }
    }
    // Calculate range of pages to show
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);
    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(<button key={i} onClick={() => onPageChange(i)} className={`w-8 h-8 flex items-center justify-center rounded-full ${i === currentPage ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
          {i}
        </button>);
    }
    // Add ellipsis if needed
    if (currentPage < totalPages - 3) {
      pages.push(<span key="ellipsis-2" className="px-1 text-gray-500">
          ...
        </span>);
    }
    // Always show last page if not already included
    if (currentPage < totalPages - 1 && totalPages > 3) {
      pages.push(<button key={totalPages} onClick={() => onPageChange(totalPages)} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-700">
          {totalPages}
        </button>);
    }
    return pages;
  };
  return <div className="flex items-center justify-center space-x-2 py-4">
      {/* Previous Page Button */}
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className={`w-8 h-8 flex items-center justify-center rounded-full ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}>
        <ChevronLeftIcon className="w-5 h-5" />
      </button>
      {/* Page Numbers */}
      {renderPageNumbers()}
      {/* Next Page Button */}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className={`w-8 h-8 flex items-center justify-center rounded-full ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}>
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    </div>;
};
export default Pagination;