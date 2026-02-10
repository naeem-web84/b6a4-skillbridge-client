// components/admin/bookings-review/BookingManagement.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { adminService, type Booking, type BookingFilters, type UpdateBookingData } from "@/services/admin.service";
import { toast } from "sonner";
import BookingTable from "./BookingTable"; 
import BookingFiltersComponent from "./BookingFilters";

interface BookingManagementProps {
  showHeader?: boolean;
}

export default function BookingManagement({ showHeader = true }: BookingManagementProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<any>(null);
  const [filters, setFilters] = useState<BookingFilters>({
    page: 1,
    limit: 10,
    search: "",
    status: undefined,
    startDate: undefined,
    endDate: undefined,
    sortBy: "bookingDate",
    sortOrder: "desc",
  });

  // Fetch bookings
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await adminService.bookings.getAllBookings(filters);
      if (response.success) {
        setBookings(response.data);
        setPagination(response.pagination);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to fetch bookings");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchBookings();
  }, [filters.page, filters.limit, filters.status, filters.sortBy, filters.sortOrder]);

  // Handle date filter changes
  useEffect(() => {
    if (filters.startDate || filters.endDate) {
      fetchBookings();
    }
  }, [filters.startDate, filters.endDate]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.search !== undefined) {
        fetchBookings();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Handle booking update
  const handleUpdateBooking = async (bookingId: string, data: UpdateBookingData) => {
    try {
      const response = await adminService.bookings.updateBooking(bookingId, data);
      if (response.success) {
        toast.success("Booking updated successfully");
        fetchBookings(); // Refresh list
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to update booking");
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
              <h1 className="text-3xl font-bold tracking-tight">Booking Management</h1>
              <p className="text-muted-foreground mt-2">
                View and manage all tutoring bookings
              </p>
            </div>
          </div>

          {/* Summary Cards */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold">{pagination?.total || 0}</div>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold">
                    {bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Active Bookings</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold">
                    ${bookings.reduce((sum, booking) => sum + booking.amount, 0).toFixed(2)}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold">
                    {bookings.filter(b => b.isPaid).length}
                  </div>
                  <p className="text-sm text-muted-foreground">Paid Bookings</p>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}

      {/* Filters Component */}
      <BookingFiltersComponent filters={filters} setFilters={setFilters} />

      {/* Bookings Table Component */}
      <BookingTable
        bookings={bookings}
        loading={loading}
        pagination={pagination}
        filters={filters}
        setFilters={setFilters}
        onUpdateBooking={handleUpdateBooking}
        onRefresh={fetchBookings}
      />
    </div>
  );
}