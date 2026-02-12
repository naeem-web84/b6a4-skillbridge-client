 
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { adminService, type Category, type CategoryFilters, type CreateCategoryData, type UpdateCategoryData } from "@/services/admin.service";
import { toast } from "sonner";
import CategoryTable from "./CategoryTable"; 
import CreateCategoryModal from "./CreateCategoryModal";
import CategoryFiltersComponent from "./CategoryFilters";

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState<CategoryFilters>({
    page: 1,
    limit: 10,
    search: "",
    sortBy: "name",
    sortOrder: "asc",
  });

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await adminService.categories.getAllCategories(filters);
      if (response.success) {
        setCategories(response.data);
        setPagination(response.pagination);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to fetch categories");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCategories();
  }, [filters.page, filters.limit, filters.sortBy, filters.sortOrder]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.search !== undefined) {
        fetchCategories();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Handle category creation
  const handleCreateCategory = async (data: CreateCategoryData) => {
    try {
      const response = await adminService.categories.createCategory(data);
      if (response.success) {
        toast.success("Category created successfully");
        fetchCategories(); // Refresh list
        setShowCreateModal(false);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to create category");
      console.error(error);
    }
  };

  // Handle category update
  const handleUpdateCategory = async (categoryId: string, data: UpdateCategoryData) => {
    try {
      const response = await adminService.categories.updateCategory(categoryId, data);
      if (response.success) {
        toast.success("Category updated successfully");
        fetchCategories(); // Refresh list
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to update category");
      console.error(error);
    }
  };

  // Handle category deletion
  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) return;

    try {
      const response = await adminService.categories.deleteCategory(categoryId);
      if (response.success) {
        toast.success("Category deleted successfully");
        fetchCategories(); // Refresh list
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to delete category");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Category Management</h1>
          <p className="text-muted-foreground mt-2">
            Create, edit, and manage tutoring categories
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          + Create New Category
        </button>
      </div>

      {/* Summary Cards */}
      {!loading && categories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">{pagination?.total || 0}</div>
              <p className="text-sm text-muted-foreground">Total Categories</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">
                {categories.reduce((sum, cat) => sum + (cat._count?.tutorCategories || 0), 0)}
              </div>
              <p className="text-sm text-muted-foreground">Total Tutor Associations</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">
                {categories.reduce((sum, cat) => sum + (cat._count?.bookings || 0), 0)}
              </div>
              <p className="text-sm text-muted-foreground">Total Bookings</p>
            </CardContent>
          </Card>
        </div>
      )}
 
      <CategoryFiltersComponent filters={filters} setFilters={setFilters} />

      {/* Categories Table Component */}
      <CategoryTable
        categories={categories}
        loading={loading}
        pagination={pagination}
        filters={filters}
        setFilters={setFilters}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
        onRefresh={fetchCategories}
      />

      {/* Create Category Modal */}
      <CreateCategoryModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateCategory}
      />
    </div>
  );
}