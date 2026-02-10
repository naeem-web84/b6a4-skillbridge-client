// components/admin/bookings-review/ReviewFilters.tsx
"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Star, Shield } from "lucide-react";
import type { ReviewFilters } from "@/services/admin.service";

interface ReviewFiltersProps {
  filters: ReviewFilters;
  setFilters: React.Dispatch<React.SetStateAction<ReviewFilters>>;
}

export default function ReviewFiltersComponent({ filters, setFilters }: ReviewFiltersProps) {
  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      search: "",
      minRating: undefined,
      maxRating: undefined,
      isVerified: undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Search & Filters</CardTitle>
        <CardDescription>Filter reviews by rating, verification, or search</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by student name, tutor name, or comment..."
              className="pl-10"
              value={filters.search || ""}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            />
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="space-y-2">
              <Label className="text-sm">Min Rating</Label>
              <Select
                value={filters.minRating?.toString() || "all"}
                onValueChange={(value) => setFilters({ 
                  ...filters, 
                  minRating: value === "all" ? undefined : parseFloat(value),
                  page: 1 
                })}
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    <SelectValue placeholder="Any rating" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any rating</SelectItem>
                  <SelectItem value="4">4+ stars</SelectItem>
                  <SelectItem value="3">3+ stars</SelectItem>
                  <SelectItem value="2">2+ stars</SelectItem>
                  <SelectItem value="1">1+ stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Max Rating</Label>
              <Select
                value={filters.maxRating?.toString() || "all"}
                onValueChange={(value) => setFilters({ 
                  ...filters, 
                  maxRating: value === "all" ? undefined : parseFloat(value),
                  page: 1 
                })}
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    <SelectValue placeholder="Any rating" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any rating</SelectItem>
                  <SelectItem value="1">1 star max</SelectItem>
                  <SelectItem value="2">2 stars max</SelectItem>
                  <SelectItem value="3">3 stars max</SelectItem>
                  <SelectItem value="4">4 stars max</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Verification</Label>
              <Select
                value={filters.isVerified === undefined ? "all" : filters.isVerified ? "verified" : "unverified"}
                onValueChange={(value) => setFilters({ 
                  ...filters, 
                  isVerified: value === "all" ? undefined : value === "verified",
                  page: 1 
                })}
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <SelectValue placeholder="All reviews" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reviews</SelectItem>
                  <SelectItem value="verified">Verified Only</SelectItem>
                  <SelectItem value="unverified">Unverified Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Sort By</Label>
              <Select
                value={filters.sortBy || "createdAt"}
                onValueChange={(value) => setFilters({ 
                  ...filters, 
                  sortBy: value as any,
                  page: 1 
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="createdAt">Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sort Order and Clear */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Select
                value={filters.sortOrder || "desc"}
                onValueChange={(value) => setFilters({ ...filters, sortOrder: value as any })}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" onClick={handleClearFilters}>
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper component for labels
function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`text-sm font-medium ${className}`}>{children}</div>
  );
}