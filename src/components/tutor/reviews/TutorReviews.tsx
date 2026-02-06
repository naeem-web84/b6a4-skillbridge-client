// components/tutor-reviews/TutorReviews.tsx
'use client';

import { useState, useEffect } from 'react';
import { tutorReviewService } from '@/services/tutorReview.service';  
import ReviewSkeleton from './ReviewSkeleton';
import ReviewFilters from './ReviewFilters';
import ReviewStats from './ReviewStats';
import ReviewEmptyState from './ReviewEmptyState';
import ReviewList from './ReviewList';

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  student: {
    id: string | undefined;
    name: string | null | undefined;
    email: string | undefined;
    image: string | null | undefined;
    grade: string | null | undefined;
    subjects: string[] | undefined;
  };
  booking: {
    id: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    category: string | null | undefined;
  } | null;
}

export interface ReviewFiltersType {
  page: number;
  limit: number;
  sortBy: 'newest' | 'oldest' | 'highest' | 'lowest';
  minRating: number | null;
}

export interface Statistics {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Array<{
    rating: number;
    count: number;
    percentage: number;
  }>;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const TutorReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<ReviewFiltersType>({
    page: 1,
    limit: 10,
    sortBy: 'newest',
    minRating: null
  });

  const fetchReviews = async (filters: ReviewFiltersType) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await tutorReviewService.getTutorReviews({
        page: filters.page,
        limit: filters.limit,
        sortBy: filters.sortBy,
        minRating: filters.minRating || undefined
      });

      if (result.success) {
        setReviews(result.data?.reviews || []);
        setStatistics(result.data?.statistics || null);
        setPagination(result.pagination || null);
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch reviews');
      console.error('Fetch reviews error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(filters);
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<ReviewFiltersType>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const hasReviews = reviews.length > 0;

  if (isLoading) {
    return <ReviewSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-red-800">Error Loading Reviews</h3>
            <p className="mt-2 text-red-700">{error}</p>
            <button
              onClick={() => fetchReviews(filters)}
              className="mt-4 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Reviews</h1>
            <p className="mt-2 text-gray-600">
              Feedback from your students helps you grow as a tutor
            </p>
          </div>
          {statistics && statistics.totalReviews > 0 && (
            <div className="mt-4 md:mt-0">
              <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-sm">
                <span className="text-2xl font-bold text-indigo-600">
                  {statistics.averageRating.toFixed(1)}
                </span>
                <div className="ml-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(statistics.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Based on {statistics.totalReviews} review{statistics.totalReviews !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column - Filters and Stats */}
        <div className="lg:col-span-1 space-y-6">
          <ReviewFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
          />
          
          {statistics && statistics.totalReviews > 0 && (
            <ReviewStats statistics={statistics} />
          )}
        </div>

        {/* Right Column - Reviews List */}
        <div className="lg:col-span-3">
          {!hasReviews ? (
            <ReviewEmptyState />
          ) : (
            <>
              <ReviewList 
                reviews={reviews}
                filters={filters}
                onFilterChange={handleFilterChange}
              />
              
              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
                  <div className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">
                      {(filters.page - 1) * filters.limit + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(filters.page * filters.limit, pagination.total)}
                    </span>{' '}
                    of <span className="font-medium">{pagination.total}</span> reviews
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(filters.page - 1)}
                      disabled={filters.page === 1}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${filters.page === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                      }`}
                    >
                      Previous
                    </button>
                    <div className="flex items-center space-x-1">
                      {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 rounded-lg font-medium transition-colors ${filters.page === pageNum
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      {pagination.totalPages > 5 && (
                        <>
                          <span className="text-gray-400">...</span>
                          <button
                            onClick={() => handlePageChange(pagination.totalPages)}
                            className={`w-10 h-10 rounded-lg font-medium transition-colors ${filters.page === pagination.totalPages
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {pagination.totalPages}
                          </button>
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => handlePageChange(filters.page + 1)}
                      disabled={filters.page === pagination.totalPages}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${filters.page === pagination.totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorReviews;