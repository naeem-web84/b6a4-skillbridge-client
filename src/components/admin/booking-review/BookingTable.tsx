// components/admin/bookings-review/BookingTable.tsx
"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, CreditCard, Users } from "lucide-react";
import type { Booking, BookingFilters } from "@/services/admin.service";
import BookingRow from "./BookingRow";

interface BookingTableProps {
  bookings: Booking[];
  loading: boolean;
  pagination: any;
  filters: BookingFilters;
  setFilters: React.Dispatch<React.SetStateAction<BookingFilters>>;
  onUpdateBooking: (bookingId: string, data: any) => Promise<void>;
  onRefresh?: () => void;
}

export default function BookingTable({
  bookings,
  loading,
  pagination,
  filters,
  setFilters,
  onUpdateBooking,
  onRefresh,
}: BookingTableProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No bookings found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your filters or search terms
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate booking stats
  const stats = {
    totalAmount: bookings.reduce((sum, booking) => sum + booking.amount, 0),
    paidBookings: bookings.filter(b => b.isPaid).length,
    pendingBookings: bookings.filter(b => b.status === 'PENDING').length,
    completedBookings: bookings.filter(b => b.status === 'COMPLETED').length,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings</CardTitle>
        <CardDescription>
          {pagination?.total || 0} bookings found
          {filters.search && ` for "${filters.search}"`}
          
          {/* Quick Stats */}
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1 text-sm">
              <CreditCard className="w-3 h-3" />
              <span>Total: ${stats.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Calendar className="w-3 h-3" />
              <span>{stats.pendingBookings} pending</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Users className="w-3 h-3" />
              <span>{stats.completedBookings} completed</span>
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking Details</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Amount & Status</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <BookingRow
                  key={booking.id}
                  booking={booking}
                  onUpdateBooking={onUpdateBooking}
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
              {pagination.total} bookings
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