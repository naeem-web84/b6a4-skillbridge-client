
"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Star, MessageSquare, Shield } from "lucide-react";
import type { Review, ReviewFilters } from "@/services/admin.service"; 
import ReviewRow from "./ReviewRow";

interface ReviewTableProps {
  reviews: Review[];
  loading: boolean;
  pagination: any;
  filters: ReviewFilters;
  setFilters: React.Dispatch<React.SetStateAction<ReviewFilters>>;
  onUpdateReview: (reviewId: string, data: any) => Promise<void>;
  onDeleteReview: (reviewId: string) => Promise<void>;
  onRefresh?: () => void;
}

export default function ReviewTable({
  reviews,
  loading,
  pagination,
  filters,
  setFilters,
  onUpdateReview,
  onDeleteReview,
  onRefresh,
}: ReviewTableProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Star className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No reviews found</h3>
          <p className="text-muted-foreground mt-2">
            {filters.search ? `No results for "${filters.search}"` : "No reviews available yet"}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate review stats
  const stats = {
    averageRating: reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length,
    verifiedReviews: reviews.filter(r => r.isVerified).length,
    positiveReviews: reviews.filter(r => r.rating >= 4).length,
    negativeReviews: reviews.filter(r => r.rating <= 2).length,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews</CardTitle>
        <CardDescription>
          {pagination?.total || 0} reviews found
          {filters.search && ` for "${filters.search}"`}
          
          {/* Quick Stats */}
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-3 h-3 text-yellow-500" />
              <span>Avg: {stats.averageRating.toFixed(1)}/5</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Shield className="w-3 h-3" />
              <span>{stats.verifiedReviews} verified</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <MessageSquare className="w-3 h-3 text-green-500" />
              <span>{stats.positiveReviews} positive</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <MessageSquare className="w-3 h-3 text-red-500" />
              <span>{stats.negativeReviews} negative</span>
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Review Details</TableHead>
                <TableHead>Rating & Verification</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <ReviewRow
                  key={review.id}
                  review={review}
                  onUpdateReview={onUpdateReview}
                  onDeleteReview={onDeleteReview}
                  onRefresh={onRefresh}
                />
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total} reviews
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
                disabled={!pagination.hasPrevPage}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={pagination.page === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilters({ ...filters, page: pageNum })}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}
                disabled={!pagination.hasNextPage}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}