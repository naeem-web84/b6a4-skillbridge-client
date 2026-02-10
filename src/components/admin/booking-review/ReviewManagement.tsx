
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { adminService, type Review, type ReviewFilters, type UpdateReviewData } from "@/services/admin.service";
import { toast } from "sonner"; 
import ReviewFiltersComponent from "./ReviewFilters";
import ReviewTable from "./ReviewTable";

interface ReviewManagementProps {
  showHeader?: boolean;
}

export default function ReviewManagement({ showHeader = true }: ReviewManagementProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<any>(null);
  const [filters, setFilters] = useState<ReviewFilters>({
    page: 1,
    limit: 10,
    search: "",
    minRating: undefined,
    maxRating: undefined,
    isVerified: undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Fetch reviews
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await adminService.reviews.getAllReviews(filters);
      if (response.success) {
        setReviews(response.data);
        setPagination(response.pagination);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to fetch reviews");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchReviews();
  }, [filters.page, filters.limit, filters.minRating, filters.maxRating, filters.isVerified, filters.sortBy, filters.sortOrder]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.search !== undefined) {
        fetchReviews();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Handle review update
  const handleUpdateReview = async (reviewId: string, data: UpdateReviewData) => {
    try {
      const response = await adminService.reviews.updateReview(reviewId, data);
      if (response.success) {
        toast.success("Review updated successfully");
        fetchReviews(); // Refresh list
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to update review");
      console.error(error);
    }
  };

  // Handle review deletion
  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review? This action cannot be undone.")) return;

    try {
      const response = await adminService.reviews.deleteReview(reviewId);
      if (response.success) {
        toast.success("Review deleted successfully");
        fetchReviews(); // Refresh list
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to delete review");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {showHeader && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Review Management</h1>
              <p className="text-muted-foreground mt-2">
                Moderate ratings and comments from students
              </p>
            </div>
          </div>

          {/* Summary Cards */}
          {!loading && reviews.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold">{pagination?.total || 0}</div>
                  <p className="text-sm text-muted-foreground">Total Reviews</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold">
                    {(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)}
                  </div>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold">
                    {reviews.filter(r => r.isVerified).length}
                  </div>
                  <p className="text-sm text-muted-foreground">Verified Reviews</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold">
                    {reviews.filter(r => r.rating >= 4).length}
                  </div>
                  <p className="text-sm text-muted-foreground">Positive Reviews (4+)</p>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}

      {/* Filters Component */}
      <ReviewFiltersComponent filters={filters} setFilters={setFilters} />

      {/* Reviews Table Component */}
      <ReviewTable
        reviews={reviews}
        loading={loading}
        pagination={pagination}
        filters={filters}
        setFilters={setFilters}
        onUpdateReview={handleUpdateReview}
        onDeleteReview={handleDeleteReview}
        onRefresh={fetchReviews}
      />
    </div>
  );
}