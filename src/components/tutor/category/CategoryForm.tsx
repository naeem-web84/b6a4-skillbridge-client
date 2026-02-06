// components/tutor-category/CategoryForm.tsx
"use client";

import { useState, useEffect } from "react";

interface Category {
  id: string;
  name: string;
  description: string | null;
}

interface CategoryFormProps {
  availableCategories: Category[];
  loadingAvailable: boolean;
  onSubmit: (categoryId: string, proficiencyLevel?: string) => void;
  adding: boolean;
}

export function CategoryForm({
  availableCategories,
  loadingAvailable,
  onSubmit,
  adding
}: CategoryFormProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [proficiencyLevel, setProficiencyLevel] = useState("");

  // Debug
  useEffect(() => {
    console.log("📝 CategoryForm - availableCategories:", availableCategories);
  }, [availableCategories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("📝 Form submitted:", { selectedCategoryId, proficiencyLevel });
    
    if (!selectedCategoryId) {
      console.error("❌ No category selected");
      return;
    }
    
    onSubmit(selectedCategoryId, proficiencyLevel || undefined);
    
    // Reset form
    setSelectedCategoryId("");
    setProficiencyLevel("");
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Select Category *
          </label>
          <select
            value={selectedCategoryId}
            onChange={(e) => {
              console.log("📝 Selected:", e.target.value);
              setSelectedCategoryId(e.target.value);
            }}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors text-base"
            disabled={loadingAvailable || adding || availableCategories.length === 0}
            required
          >
            <option value="">Choose a category to add...</option>
            {availableCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name} {category.description && `- ${category.description}`}
              </option>
            ))}
          </select>
          
          {/* Status messages */}
          <div className="mt-3 space-y-2">
            {loadingAvailable && (
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading categories...
              </p>
            )}
            {!loadingAvailable && availableCategories.length === 0 && (
              <p className="text-sm text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                No more categories available to add. You've added all available teaching categories.
              </p>
            )}
            {!loadingAvailable && availableCategories.length > 0 && (
              <p className="text-sm text-gray-500">
                {availableCategories.length} category{availableCategories.length !== 1 ? 's' : ''} available to add
              </p>
            )}
          </div>
        </div>

        {/* Proficiency Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Proficiency Level (Optional)
          </label>
          <select
            value={proficiencyLevel}
            onChange={(e) => setProficiencyLevel(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors text-base"
            disabled={adding}
          >
            <option value="">Select your proficiency level (optional)</option>
            <option value="Beginner">Beginner - Basic understanding</option>
            <option value="Intermediate">Intermediate - Comfortable teaching</option>
            <option value="Advanced">Advanced - Expert level knowledge</option>
            <option value="Expert">Expert - Professional experience</option>
            <option value="Native">Native Speaker - For language subjects</option>
          </select>
          <p className="mt-2 text-sm text-gray-500">
            This helps students understand your expertise level in this subject
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!selectedCategoryId || adding || availableCategories.length === 0}
          className="w-full px-6 py-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base shadow-sm"
        >
          {adding ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding Category...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Teaching Category
            </>
          )}
        </button>
      </form>
    </div>
  );
};