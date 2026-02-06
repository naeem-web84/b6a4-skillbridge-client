// components/tutor-reviews/ReviewEmptyState.tsx
'use client';

interface ReviewEmptyStateProps {
  message?: string;
}

const ReviewEmptyState = ({ 
  message = "You don't have any reviews yet. Reviews will appear here once students provide feedback on your tutoring sessions." 
}: ReviewEmptyStateProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
      <div className="max-w-md mx-auto">
        <div className="mx-auto h-24 w-24 text-gray-300">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>
        <h3 className="mt-6 text-xl font-semibold text-gray-900">No Reviews Yet</h3>
        <p className="mt-2 text-gray-600">{message}</p>
        <div className="mt-8">
          <div className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Share Your Profile
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Tips to get your first review:
          </p>
          <ul className="mt-2 text-sm text-gray-600 space-y-1">
            <li>• Complete your tutoring sessions with students</li>
            <li>• Encourage students to leave honest feedback</li>
            <li>• Provide excellent teaching experience</li>
            <li>• Follow up with students after sessions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReviewEmptyState;