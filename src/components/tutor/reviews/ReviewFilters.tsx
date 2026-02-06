// components/tutor-reviews/ReviewFilters.tsx
'use client';

import { ReviewFiltersType } from './TutorReviews';

interface ReviewFiltersProps {
  filters: ReviewFiltersType;
  onFilterChange: (filters: Partial<ReviewFiltersType>) => void;
}

const ReviewFilters = ({ filters, onFilterChange }: ReviewFiltersProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
      
      <div className="space-y-6">
        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort by
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ 
              sortBy: e.target.value as ReviewFiltersType['sortBy'] 
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>

        {/* Minimum Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Rating
          </label>
          <div className="flex space-x-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => onFilterChange({ 
                  minRating: filters.minRating === rating ? null : rating 
                })}
                className={`flex-1 py-2 rounded-lg border transition-colors ${filters.minRating === rating
                  ? 'bg-yellow-50 border-yellow-300 text-yellow-700'
                  : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-center">
                  {Array.from({ length: rating }).map((_, i) => (
                    <svg
                      key={i}
                      className="h-4 w-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={() => onFilterChange({ minRating: null })}
            className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Clear rating filter
          </button>
        </div>

        {/* Items Per Page */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reviews per page
          </label>
          <select
            value={filters.limit}
            onChange={(e) => onFilterChange({ 
              limit: parseInt(e.target.value) 
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
            <option value="5">5 reviews</option>
            <option value="10">10 reviews</option>
            <option value="20">20 reviews</option>
            <option value="50">50 reviews</option>
          </select>
        </div>

        {/* Clear Filters */}
        {(filters.sortBy !== 'newest' || filters.minRating !== null || filters.limit !== 10) && (
          <button
            onClick={() => onFilterChange({ 
              sortBy: 'newest',
              minRating: null,
              limit: 10,
              page: 1
            })}
            className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Clear All Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewFilters;