// components/student-find-tutor/CategoryManagement.tsx
"use client";

import { useState, useEffect } from "react";
import studentFindTutorService from "@/services/studentFindTutor.service";

interface Category {
  id: string;
  name: string;
  description?: string;
}

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryTutors, setCategoryTutors] = useState<any[]>([]);
  const [loadingTutors, setLoadingTutors] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await studentFindTutorService.category.getAllCategories();
      
      if (result.success && result.data) {
        setCategories(result.data);
      } else {
        setError(result.message || "Failed to load categories");
      }
    } catch (err: any) {
      setError(err.message || "Error fetching categories");
    } finally {
      setLoading(false);
    }
  };

  const fetchTutorsByCategory = async (categoryId: string) => {
    setLoadingTutors(true);
    try {
      const result = await studentFindTutorService.category.getTutorsByCategory(categoryId);
      
      if (result.success && result.data) {
        setCategoryTutors(result.data.tutors || []);
      }
    } catch (error) {
      console.error("Error fetching category tutors:", error);
    } finally {
      setLoadingTutors(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryClick = async (category: Category) => {
    setSelectedCategory(category);
    await fetchTutorsByCategory(category.id);
  };

  const closeCategoryDetails = () => {
    setSelectedCategory(null);
    setCategoryTutors([]);
  };

  if (loading) return <div className="text-center py-8">Loading categories...</div>;
  if (error) return <div className="text-red-600 p-4">Error: {error}</div>;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Tutoring Categories</h2>
        <p className="text-gray-600">Browse tutors by subject category</p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category)}
            className="border rounded-lg p-5 hover:shadow-lg transition-shadow cursor-pointer hover:border-blue-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">{category.name}</h3>
                {category.description && (
                  <p className="text-gray-600 text-sm mt-1">{category.description}</p>
                )}
              </div>
              <div className="text-blue-600">
                →
              </div>
            </div>
            <div className="mt-4">
              <button className="w-full px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 text-sm">
                View Tutors
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Category Details Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedCategory.name}</h2>
                  {selectedCategory.description && (
                    <p className="text-gray-600 mt-1">{selectedCategory.description}</p>
                  )}
                </div>
                <button
                  onClick={closeCategoryDetails}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Tutors in this category */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-4">
                  Tutors in {selectedCategory.name}
                  {categoryTutors.length > 0 && (
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({categoryTutors.length} tutors)
                    </span>
                  )}
                </h3>

                {loadingTutors ? (
                  <div className="text-center py-8">Loading tutors...</div>
                ) : categoryTutors.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded">
                    <div className="text-gray-400 text-4xl mb-3">👨‍🏫</div>
                    <p className="text-gray-600">No tutors found in this category</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categoryTutors.slice(0, 6).map((tutor) => (
                      <div key={tutor.id} className="border rounded p-4 hover:shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{tutor.name}</h4>
                            <p className="text-gray-600 text-sm">{tutor.headline}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                              ${tutor.hourlyRate}<span className="text-sm">/hr</span>
                            </div>
                            <div className="text-yellow-500 text-sm">
                              ★ {tutor.rating}/5
                            </div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <button
                            onClick={() => {
                              closeCategoryDetails();
                              // You could navigate to tutor details or open a modal
                              alert(`Viewing tutor: ${tutor.name}`);
                            }}
                            className="w-full px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                          >
                            View Profile
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {categoryTutors.length > 6 && (
                  <div className="text-center mt-4">
                    <button
                      onClick={() => alert(`Showing all ${categoryTutors.length} tutors in ${selectedCategory.name}`)}
                      className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                    >
                      View All {categoryTutors.length} Tutors
                    </button>
                  </div>
                )}
              </div>

              {/* Category Stats */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3">Category Information</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{categoryTutors.length}</div>
                    <div className="text-sm text-gray-600">Available Tutors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {categoryTutors.length > 0 
                        ? `$${(categoryTutors.reduce((sum, t) => sum + t.hourlyRate, 0) / categoryTutors.length).toFixed(0)}`
                        : '$0'
                      }
                    </div>
                    <div className="text-sm text-gray-600">Avg. Hourly Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {categoryTutors.length > 0
                        ? (categoryTutors.reduce((sum, t) => sum + t.rating, 0) / categoryTutors.length).toFixed(1)
                        : '0.0'
                      }
                    </div>
                    <div className="text-sm text-gray-600">Avg. Rating</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeCategoryDetails}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No categories message */}
      {categories.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-600">No categories available</h3>
          <p className="text-gray-500 mt-2">Categories will be added by administrators.</p>
        </div>
      )}
    </div>
  );
}