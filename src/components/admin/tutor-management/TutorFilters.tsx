// components/admin/tutor/TutorFilters.tsx
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
import { Search, Filter, Star, DollarSign } from "lucide-react";
import type { TutorFilters } from "@/services/admin.service";

interface TutorFiltersProps {
  filters: TutorFilters;
  setFilters: React.Dispatch<React.SetStateAction<TutorFilters>>;
}

export default function TutorFiltersComponent({ filters, setFilters }: TutorFiltersProps) {
  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      search: "",
      minRating: undefined,
      maxHourlyRate: undefined,
      experienceYears: undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tutor Search & Filters</CardTitle>
        <CardDescription>Filter tutors by rating, price, experience or search</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by tutor name, headline, or email..."
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
                  <SelectItem value="4.5">4.5+ stars</SelectItem>
                  <SelectItem value="4.0">4.0+ stars</SelectItem>
                  <SelectItem value="3.5">3.5+ stars</SelectItem>
                  <SelectItem value="3.0">3.0+ stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Max Price</Label>
              <Select
                value={filters.maxHourlyRate?.toString() || "all"}
                onValueChange={(value) => setFilters({ 
                  ...filters, 
                  maxHourlyRate: value === "all" ? undefined : parseFloat(value),
                  page: 1 
                })}
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <SelectValue placeholder="Any price" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any price</SelectItem>
                  <SelectItem value="20">Under $20/hr</SelectItem>
                  <SelectItem value="30">Under $30/hr</SelectItem>
                  <SelectItem value="50">Under $50/hr</SelectItem>
                  <SelectItem value="100">Under $100/hr</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Experience</Label>
              <Select
                value={filters.experienceYears?.toString() || "all"}
                onValueChange={(value) => setFilters({ 
                  ...filters, 
                  experienceYears: value === "all" ? undefined : parseInt(value),
                  page: 1 
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any experience</SelectItem>
                  <SelectItem value="1">1+ years</SelectItem>
                  <SelectItem value="3">3+ years</SelectItem>
                  <SelectItem value="5">5+ years</SelectItem>
                  <SelectItem value="10">10+ years</SelectItem>
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
                  <SelectItem value="hourlyRate">Price</SelectItem>
                  <SelectItem value="experienceYears">Experience</SelectItem>
                  <SelectItem value="createdAt">Newest</SelectItem>
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
};