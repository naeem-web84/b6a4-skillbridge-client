// components/tutor-reviews/ReviewSkeleton.tsx
'use client';

const ReviewSkeleton = () => {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-8 animate-pulse">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <div className="h-8 w-48 bg-gray-300 rounded"></div>
            <div className="h-4 w-64 bg-gray-300 rounded"></div>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="h-12 w-48 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column Skeleton */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-6 w-24 bg-gray-300 rounded mb-4"></div>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="h-4 w-16 bg-gray-300 rounded"></div>
                <div className="h-10 w-full bg-gray-300 rounded-lg"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-300 rounded"></div>
                <div className="flex space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex-1 h-10 bg-gray-300 rounded-lg"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-40 bg-gray-300 rounded"></div>
                <div className="h-10 w-full bg-gray-300 rounded-lg"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-6 w-32 bg-gray-300 rounded mb-4"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-12 h-4 bg-gray-300 rounded"></div>
                  <div className="flex-1 ml-3">
                    <div className="w-full bg-gray-300 rounded-full h-2"></div>
                  </div>
                  <div className="w-16 h-4 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column Skeleton */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <div className="h-7 w-48 bg-gray-300 rounded"></div>
                <div className="h-4 w-32 bg-gray-300 rounded"></div>
              </div>
              <div className="mt-4 sm:mt-0">
                <div className="h-10 w-40 bg-gray-300 rounded-lg"></div>
              </div>
            </div>
          </div>

          {/* Review Cards Skeleton */}
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse"
            >
              <div className="flex items-start space-x-4">
                <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-5 w-48 bg-gray-300 rounded"></div>
                  <div className="h-4 w-32 bg-gray-300 rounded"></div>
                </div>
                <div className="h-8 w-24 bg-gray-300 rounded-full"></div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-4 w-full bg-gray-300 rounded"></div>
                <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
                <div className="h-4 w-4/6 bg-gray-300 rounded"></div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex space-x-4">
                  <div className="h-4 w-24 bg-gray-300 rounded"></div>
                  <div className="h-4 w-32 bg-gray-300 rounded"></div>
                  <div className="h-4 w-40 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewSkeleton;