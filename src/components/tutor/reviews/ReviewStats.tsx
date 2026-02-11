 
'use client';

import { Statistics } from './TutorReviews';

interface ReviewStatsProps {
  statistics: Statistics;
}

const ReviewStats = ({ statistics }: ReviewStatsProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Rating Breakdown</h2>
      
      <div className="space-y-4">
        {statistics.ratingDistribution.map((dist) => (
          <div key={dist.rating} className="flex items-center">
            <div className="w-12 text-sm font-medium text-gray-600">
              {dist.rating} ★
            </div>
            <div className="flex-1 ml-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ width: `${dist.percentage}%` }}
                />
              </div>
            </div>
            <div className="w-16 text-right text-sm text-gray-600">
              {dist.count} ({dist.percentage}%)
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-indigo-50 rounded-lg">
            <div className="text-2xl font-bold text-indigo-700">
              {statistics.averageRating.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600 mt-1">Average Rating</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-700">
              {statistics.totalReviews}
            </div>
            <div className="text-sm text-gray-600 mt-1">Total Reviews</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStats;