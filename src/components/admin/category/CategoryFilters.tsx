// components/admin/category/CategoryFilters.tsx
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
import { Search, Filter, SortAsc, SortDesc } from "lucide-react";
import type { CategoryFilters } from "@/services/admin.service";

interface CategoryFiltersProps {
  filters: CategoryFilters;
  setFilters: React.Dispatch<React.SetStateAction<CategoryFilters>>;
}

export default function CategoryFiltersComponent({ filters, setFilters }: CategoryFiltersProps) {
  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      search: "",
      sortBy: "name",
      sortOrder: "asc",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search & Filter Categories</CardTitle>
        <CardDescription>Search by name or description</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by category name or description..."
                className="pl-10"
                value={filters.search || ""}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Select
              value={filters.sortBy || "name"}
              onValueChange={(value) => setFilters({ ...filters, sortBy: value as any, page: 1 })}
            >
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  {filters.sortOrder === "asc" ? (
                    <SortAsc className="w-4 h-4" />
                  ) : (
                    <SortDesc className="w-4 h-4" />
                  )}
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="createdAt">Created Date</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.sortOrder || "asc"}
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

            <Button
              variant="outline"
              onClick={handleClearFilters}
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}