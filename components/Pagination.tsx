
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 mt-12 pt-6" aria-label="Pagination">
      <div className="flex w-0 flex-1">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="inline-flex items-center rounded-md border border-gray-300 bg-light-surface px-4 py-2 text-sm font-medium text-text-secondary hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
        >
          <svg className="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
          </svg>
          Previous
        </button>
      </div>
      <div className="hidden md:flex">
        <span className="text-sm text-text-secondary">
          Page <span className="font-medium text-text-primary">{currentPage}</span> of <span className="font-medium text-text-primary">{totalPages}</span>
        </span>
      </div>
      <div className="flex w-0 flex-1 justify-end">
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="inline-flex items-center rounded-md border border-gray-300 bg-light-surface px-4 py-2 text-sm font-medium text-text-secondary hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
        >
          Next
           <svg className="ml-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
