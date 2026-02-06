// components/tutor/bookings/BookingsDashboard.tsx
"use client";

import { useState, useEffect } from 'react';
import tutorBookingService, { BookingStatus, BookingWithUser } from '@/services/tutorBooking.service';  
import BookingStats from './BookingStats';
import BookingFilters from './BookingFilter';
import BookingsList from './BookingList';
import BookingDetailModal from './BookingDetailModal';

export default function BookingsDashboard() {
  const [bookings, setBookings] = useState<BookingWithUser[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingWithUser[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<BookingWithUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bookings, statusFilter, dateRange, searchTerm]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch bookings
      const bookingsResult = await tutorBookingService.getTutorBookings({
        page: 1,
        limit: 50
      });
      
      if (bookingsResult.success) {
        setBookings(bookingsResult.data);
      }
      
      // Fetch stats
      const statsResult = await tutorBookingService.getBookingStats();
      if (statsResult.success) {
        setStats(statsResult.data);
      }
      
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...bookings];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Date range filter
    if (dateRange.start) {
      filtered = filtered.filter(booking => 
        new Date(booking.bookingDate) >= dateRange.start!
      );
    }
    if (dateRange.end) {
      filtered = filtered.filter(booking => 
        new Date(booking.bookingDate) <= dateRange.end!
      );
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(booking =>
        booking.studentUser?.name.toLowerCase().includes(term) ||
        booking.category.name.toLowerCase().includes(term) ||
        booking.notes?.toLowerCase().includes(term)
      );
    }

    setFilteredBookings(filtered);
  };

  const handleViewDetails = (booking: BookingWithUser) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      const result = await tutorBookingService.updateBookingStatus(bookingId, {
        status: newStatus,
        notes: `Status updated to ${newStatus}`
      });
      
      if (result.success) {
        // Refresh data
        fetchAllData();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleRefresh = () => {
    fetchAllData();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📚 My Bookings</h1>
          <p className="text-gray-600 mt-1">Manage all your tutoring sessions</p>
        </div>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stats */}
      {stats && <BookingStats stats={stats} />}

      {/* Filters */}
      <BookingFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateRange={dateRange}
        setDateRange={setDateRange}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Bookings List */}
      <BookingsList
        bookings={filteredBookings}
        onViewDetails={handleViewDetails}
        onStatusUpdate={handleStatusUpdate}
      />

      {/* Detail Modal */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}