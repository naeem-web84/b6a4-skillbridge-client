// components/tutor-reviews/ReviewList.tsx
'use client';

import { Review, ReviewFiltersType } from './TutorReviews';

interface ReviewListProps {
  reviews: Review[];
  filters: ReviewFiltersType;
  onFilterChange: (filters: Partial<ReviewFiltersType>) => void;
}

const ReviewList = ({ reviews, filters, onFilterChange }: ReviewListProps) => {
  const getSortLabel = (sortBy: string) => {
    switch (sortBy) {
      case 'newest': return 'Newest First';
      case 'oldest': return 'Oldest First';
      case 'highest': return 'Highest Rated';
      case 'lowest': return 'Lowest Rated';
      default: return 'Newest First';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Student Feedback</h2>
          {filters.minRating && (
            <p className="mt-1 text-gray-600">
              Showing {filters.minRating}+ star reviews
            </p>
          )}
        </div>
        <div className="mt-2 sm:mt-0">
          <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-lg">
            <span className="text-sm text-gray-700 mr-2">Sorted by:</span>
            <span className="font-medium text-gray-900">
              {getSortLabel(filters.sortBy)}
            </span>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            {/* Review Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start space-x-4">
                {/* Student Avatar */}
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                    {review.student?.name?.[0]?.toUpperCase() || 'S'}
                  </div>
                </div>
                
                {/* Student Info */}
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {review.student?.name || 'Anonymous Student'}
                  </h3>
                  <div className="flex items-center mt-1 space-x-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {review.rating}.0
                      </span>
                    </div>
                    
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    
                    {review.student?.grade && (
                      <span className="text-sm text-gray-500">
                        Grade {review.student.grade}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Verified Badge */}
              {review.isVerified && (
                <div className="mt-4 sm:mt-0">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
                </div>
              )}
            </div>
            
            {/* Review Content */}
            {review.comment && (
              <div className="mt-4">
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
            )}
            
            {/* Booking Info */}
            {review.booking && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  {review.booking.category && (
                    <div className="flex items-center">
                      <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span className="font-medium">{review.booking.category}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{new Date(review.booking.bookingDate).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                      {review.booking.startTime} - {review.booking.endTime}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Student Subjects */}
            {review.student?.subjects && review.student.subjects.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {review.student.subjects.slice(0, 3).map((subject) => (
                  <span
                    key={subject}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {subject}
                  </span>
                ))}
                {review.student.subjects.length > 3 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    +{review.student.subjects.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;