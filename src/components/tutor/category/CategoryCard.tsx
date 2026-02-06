// components/tutor-category/CategoryCard.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  description: string | null;
}

interface TutorCategory {
  id: string;
  proficiencyLevel: string | null;
  addedAt: string;
  category: Category;
}

interface CategoryCardProps {
  tutorCategory: TutorCategory;
  onRemove: (id: string) => void;
  onUpdateProficiency: (id: string, proficiency: string) => void;
  removing: boolean;
}

export function CategoryCard({
  tutorCategory,
  onRemove,
  onUpdateProficiency,
  removing
}: CategoryCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [proficiency, setProficiency] = useState(tutorCategory.proficiencyLevel || "");

  // Safe access to category properties
  const category = tutorCategory.category || {
    id: "unknown",
    name: "Unknown Category",
    description: null
  };

  const handleSaveProficiency = () => {
    if (proficiency.trim()) {
      onUpdateProficiency(tutorCategory.id, proficiency);
      setIsEditing(false);
    } else {
      toast.error("Proficiency level cannot be empty");
    }
  };

  const handleCancel = () => {
    setProficiency(tutorCategory.proficiencyLevel || "");
    setIsEditing(false);
  };

  // Format date safely
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return "Unknown date";
    }
  };

  return (
    <div className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:shadow-md transition-all duration-200">
      {/* Remove Button */}
      <button
        onClick={() => onRemove(tutorCategory.id)}
        disabled={removing}
        className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
        title="Remove category"
      >
        {removing ? (
          <svg className="animate-spin h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        )}
      </button>

      {/* Category Info */}
      <div className="pr-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {category.name}
          </h3>
        </div>

        {category.description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            {category.description}
          </p>
        )}

        {/* Proficiency Section */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Proficiency Level
            </span>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                Edit
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <select
                value={proficiency}
                onChange={(e) => setProficiency(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
              >
                <option value="">Select proficiency</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
                <option value="Native">Native Speaker</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveProficiency}
                  className="flex-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                !tutorCategory.proficiencyLevel
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                  : tutorCategory.proficiencyLevel === "Expert" || tutorCategory.proficiencyLevel === "Native"
                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                  : tutorCategory.proficiencyLevel === "Advanced"
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400"
                  : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
              }`}>
                {tutorCategory.proficiencyLevel || "Not specified"}
              </span>
            </div>
          )}
        </div>

        {/* Added Date */}
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Added on {formatDate(tutorCategory.addedAt)}
          </p>
        </div>
      </div>
    </div>
  );
}