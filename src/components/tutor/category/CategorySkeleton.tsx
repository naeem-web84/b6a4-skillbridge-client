// components/tutor-category/CategorySkeleton.tsx
export function CategorySkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 animate-pulse">
      <div className="pr-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-gray-200 dark:bg-gray-800 rounded-lg">
            <div className="h-5 w-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
        </div>
        
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-4"></div>
        
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/6"></div>
          </div>
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}