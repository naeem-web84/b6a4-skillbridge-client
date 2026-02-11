"use client";

import { useState, useEffect } from "react";
import studentFindTutorService from "@/services/studentFindTutor.service";
import { Category, TutorProfile } from "@/services/studentFindTutor.service";

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryTutors, setCategoryTutors] = useState<TutorProfile[]>([]);
  const [loadingTutors, setLoadingTutors] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await studentFindTutorService.category.getAllCategories();
      
      if (result.success && result.data) {
        setCategories(Array.isArray(result.data) ? result.data : []);
      } else {
        setError(result.message || "Failed to load categories");
        setCategories([]);
      }
    } catch (err: any) {
      setError(err.message || "Error fetching categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTutorsByCategory = async (categoryId: string) => {
    setLoadingTutors(true);
    try {
      const result = await studentFindTutorService.category.getTutorsByCategory(categoryId);
      
      if (result.success && result.data) {
        setCategoryTutors(Array.isArray(result.data.tutors) ? result.data.tutors : []);
      } else {
        setCategoryTutors([]);
      }
    } catch {
      setCategoryTutors([]);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive p-4 rounded border border-destructive/20">
        Error: {error}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Tutoring Categories</h2>
        <p className="text-muted-foreground">Browse tutors by subject category</p>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border">
          <div className="text-muted-foreground text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-muted-foreground">No categories available</h3>
          <p className="text-muted-foreground mt-2">Categories will be added by administrators.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className="border rounded-lg p-5 hover:shadow-lg transition-shadow cursor-pointer hover:border-primary/50 bg-card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-foreground">{category.name}</h3>
                  {category.description && (
                    <p className="text-muted-foreground text-sm mt-1">{category.description}</p>
                  )}
                </div>
                <div className="text-primary text-xl">
                  →
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{selectedCategory.name}</h2>
                  {selectedCategory.description && (
                    <p className="text-muted-foreground mt-1">{selectedCategory.description}</p>
                  )}
                </div>
                <button
                  onClick={closeCategoryDetails}
                  className="text-muted-foreground hover:text-foreground text-2xl transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-4 text-foreground">
                  Tutors in {selectedCategory.name}
                  {categoryTutors.length > 0 && (
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      ({categoryTutors.length} tutors)
                    </span>
                  )}
                </h3>

                {loadingTutors ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : categoryTutors.length === 0 ? (
                  <div className="text-center py-8 bg-muted rounded">
                    <div className="text-muted-foreground text-4xl mb-3">👨‍🏫</div>
                    <p className="text-muted-foreground">No tutors found in this category</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categoryTutors.slice(0, 6).map((tutor) => (
                      <div key={tutor.id} className="border rounded p-4 hover:shadow bg-card transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-foreground">{tutor.user?.name || 'Tutor'}</h4>
                            <p className="text-muted-foreground text-sm mt-1">{tutor.headline}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600 dark:text-green-400">
                              ${tutor.hourlyRate}<span className="text-sm">/hr</span>
                            </div>
                            <div className="text-yellow-500 dark:text-yellow-400 text-sm">
                              ★ {tutor.rating.toFixed(1)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {categoryTutors.length > 6 && (
                  <div className="text-center mt-4">
                    <button
                      onClick={() => alert(`Showing all ${categoryTutors.length} tutors`)}
                      className="px-4 py-2 border border-primary text-primary rounded hover:bg-primary/10 transition-colors"
                    >
                      View All {categoryTutors.length} Tutors
                    </button>
                  </div>
                )}
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-3 text-foreground">Category Statistics</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{categoryTutors.length}</div>
                    <div className="text-sm text-muted-foreground">Available Tutors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {categoryTutors.length > 0 
                        ? `$${(categoryTutors.reduce((sum, t) => sum + t.hourlyRate, 0) / categoryTutors.length).toFixed(0)}`
                        : '$0'
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">Avg. Hourly Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {categoryTutors.length > 0
                        ? (categoryTutors.reduce((sum, t) => sum + t.rating, 0) / categoryTutors.length).toFixed(1)
                        : '0.0'
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">Avg. Rating</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeCategoryDetails}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};