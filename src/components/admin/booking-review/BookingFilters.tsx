// components/admin/bookings-review/BookingFilters.tsx
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
import { Search, Filter, Calendar, DollarSign } from "lucide-react";
import type { BookingFilters } from "@/services/admin.service";

interface BookingFiltersProps {
  filters: BookingFilters;
  setFilters: React.Dispatch<React.SetStateAction<BookingFilters>>;
}

export default function BookingFiltersComponent({ filters, setFilters }: BookingFiltersProps) {
  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      search: "",
      status: undefined,
      startDate: undefined,
      endDate: undefined,
      sortBy: "bookingDate",
      sortOrder: "desc",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Search & Filters</CardTitle>
        <CardDescription>Filter bookings by status, date, or search</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by student name, tutor name, or booking ID..."
              className="pl-10"
              value={filters.search || ""}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            />
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="space-y-2">
              <Label className="text-sm">Status</Label>
              <Select
                value={filters.status || "all"}
                onValueChange={(value) => setFilters({ 
                  ...filters, 
                  status: value === "all" ? undefined : value,
                  page: 1 
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="RESCHEDULED">Rescheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Start Date</Label>
              <Input
                type="date"
                value={filters.startDate || ""}
                onChange={(e) => setFilters({ 
                  ...filters, 
                  startDate: e.target.value || undefined,
                  page: 1 
                })}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm">End Date</Label>
              <Input
                type="date"
                value={filters.endDate || ""}
                onChange={(e) => setFilters({ 
                  ...filters, 
                  endDate: e.target.value || undefined,
                  page: 1 
                })}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Sort By</Label>
              <Select
                value={filters.sortBy || "bookingDate"}
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
                  <SelectItem value="bookingDate">Booking Date</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                  <SelectItem value="createdAt">Created Date</SelectItem>
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