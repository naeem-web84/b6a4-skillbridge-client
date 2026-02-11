"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { categoryService } from "@/services/addCategory.service"; 
import { CategoryCard } from "./CategoryCard";
import { CategoryForm } from "./CategoryForm";
import { CategorySkeleton } from "./CategorySkeleton";

interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt?: string;
}

interface TutorCategory {
  id: string;
  proficiencyLevel: string | null;
  addedAt: string;
  category: Category;
}

export function CategoryPage() {
  const [categories, setCategories] = useState<TutorCategory[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAvailable, setLoadingAvailable] = useState(false);
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    // Debug removed
  }, [categories, availableCategories]);

  const loadTutorCategories = async () => {
    setLoading(true);
    try {
      const result = await categoryService.getTutorCategories();
      
      if (result.success && result.data) {
        setCategories(result.data);
      } else {
        toast.error(result.message || "Failed to load categories");
      }
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableCategories = async () => {
    setLoadingAvailable(true);
    try {
      const { data, error } = await categoryService.getAllCategories();
      
      if (data) {
        setAvailableCategories(data);
      } else {
        setAvailableCategories([]);
      }
    } catch {
      setAvailableCategories([]);
    } finally {
      setLoadingAvailable(false);
    }
  };

  useEffect(() => {
    loadTutorCategories();
    loadAvailableCategories();
  }, []);

  const handleAddCategory = async (categoryId: string, proficiencyLevel?: string) => {
    if (!categoryId) {
      toast.error("Please select a category");
      return;
    }

    setAdding(true);
    try {
      const result = await categoryService.addTeachingCategory({
        categoryId,
        proficiencyLevel
      });

      if (result.success) {
        toast.success("Category added successfully");
        loadTutorCategories();
        
        setAvailableCategories(prev => 
          prev.filter(cat => cat && cat.id !== categoryId)
        );
      } else {
        toast.error(result.message || "Failed to add category");
      }
    } catch {
      toast.error("Failed to add category");
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveCategory = async (tutorCategoryId: string) => {
    setRemoving(tutorCategoryId);
    try {
      const result = await categoryService.removeTeachingCategory(tutorCategoryId);
      
      if (result.success) {
        toast.success("Category removed successfully");
        
        const removedCategory = categories.find(cat => cat.id === tutorCategoryId);
        if (removedCategory && removedCategory.category && 
            !availableCategories.some(cat => cat && cat.id === removedCategory.category.id)) {
          setAvailableCategories(prev => [...prev, removedCategory.category]);
        }
        
        setCategories(prev => prev.filter(cat => cat.id !== tutorCategoryId));
      } else {
        toast.error(result.message || "Failed to remove category");
      }
    } catch {
      toast.error("Failed to remove category");
    } finally {
      setRemoving(null);
    }
  };

  const handleUpdateProficiency = async (tutorCategoryId: string, proficiencyLevel: string) => {
    try {
      const result = await categoryService.updateProficiencyLevel(tutorCategoryId, proficiencyLevel);
      
      if (result.success) {
        toast.success("Proficiency level updated");
        
        setCategories(prev => 
          prev.map(cat => 
            cat.id === tutorCategoryId 
              ? { ...cat, proficiencyLevel } 
              : cat
          )
        );
      } else {
        toast.error(result.message || "Failed to update proficiency");
      }
    } catch {
      toast.error("Failed to update proficiency");
    }
  };

  const filteredAvailableCategories = availableCategories.filter(
    availableCat => 
      availableCat && 
      availableCat.id && 
      !categories.some(tutorCat => 
        tutorCat && 
        tutorCat.category && 
        tutorCat.category.id === availableCat.id
      )
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Teaching Categories
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
            Manage the subjects and categories you teach. Add your proficiency level for each category to help students understand your expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Categories</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{categories.length}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Available to Add</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{filteredAvailableCategories.length}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total in System</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{availableCategories.length}</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Category</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Select a category from the list below to add to your teaching profile
            </p>
          </div>
          <button
            onClick={() => {
              loadTutorCategories();
              loadAvailableCategories();
            }}
            className="px-5 py-2.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            disabled={loading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
          <CategoryForm
            availableCategories={filteredAvailableCategories}
            loadingAvailable={loadingAvailable}
            onSubmit={handleAddCategory}
            adding={adding}
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">My Teaching Categories</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage your current teaching categories and proficiency levels
            </p>
          </div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
            {categories.length} {categories.length === 1 ? 'Category' : 'Categories'}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CategorySkeleton key={i} />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-900/50">
            <div className="w-20 h-20 mx-auto mb-6 text-gray-300 dark:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              No teaching categories yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Start by adding your first teaching category above. This will help students find you for tutoring sessions.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  const formSection = document.getElementById('add-category-form');
                  formSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors shadow-sm"
              >
                Add Your First Category
              </button>
              <button
                onClick={() => {
                  loadTutorCategories();
                  loadAvailableCategories();
                }}
                className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Check for Updates
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((tutorCategory) => (
              <CategoryCard
                key={tutorCategory.id}
                tutorCategory={tutorCategory}
                onRemove={handleRemoveCategory}
                onUpdateProficiency={handleUpdateProficiency}
                removing={removing === tutorCategory.id}
              />
            ))}
          </div>
        )}

        {categories.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={() => {
                const formSection = document.getElementById('add-category-form');
                if (formSection) {
                  formSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors shadow-sm flex-1 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Another Category
            </button>
            <button
              onClick={() => {
                loadTutorCategories();
                loadAvailableCategories();
              }}
              className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex-1 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh All Data
            </button>
          </div>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-6 mt-8">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Tips for Adding Categories</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                <span>Add all subjects you're comfortable teaching to increase your visibility</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                <span>Set appropriate proficiency levels to match student expectations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                <span>You can update proficiency levels anytime by clicking the "Edit" button</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                <span>Categories with active bookings cannot be removed</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};