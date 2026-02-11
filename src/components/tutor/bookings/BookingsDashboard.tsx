"use client";

import { useState, useEffect } from 'react';
import tutorBookingService, { BookingStatus, BookingWithUser, NotificationItem } from '@/services/tutorBooking.service';  
import BookingStats from './BookingStats'; 
import { env } from '@/env';
import TutorNotifications from './Notifications';
import BookingsList from './BookingList';
import BookingDetailModal from './BookingDetailModal';
import BookingFilters from './BookingFilter';

export default function BookingsDashboard() {
  const [bookings, setBookings] = useState<BookingWithUser[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingWithUser[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<BookingWithUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'failed'>('connecting');
  
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  
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
      setError(null);
      
      const bookingsResult = await tutorBookingService.getTutorBookings({
        page: 1,
        limit: 50
      });
      
      if (bookingsResult.success && bookingsResult.data) {
        setConnectionStatus('connected');
        setBookings(bookingsResult.data);
      } else {
        setConnectionStatus('failed');
        setError(bookingsResult.message || "Failed to fetch bookings");
      }
      
      const statsResult = await tutorBookingService.getBookingStats();
      if (statsResult.success) {
        setStats(statsResult.data);
      }
      
      const notificationsResult = await tutorBookingService.getTutorNotifications();
      if (notificationsResult.success && notificationsResult.data) {
        setNotifications(notificationsResult.data);
        setUnreadCount(notificationsResult.data.filter(n => !n.isRead).length);
      }
      
    } catch {
      setConnectionStatus('failed');
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...bookings];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

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

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(booking => {
        const studentName = booking.studentUser?.name?.toLowerCase() || '';
        const categoryName = booking.category?.name?.toLowerCase() || '';
        const notes = booking.notes?.toLowerCase() || '';
        
        return studentName.includes(term) || 
               categoryName.includes(term) || 
               notes.includes(term);
      });
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
        notes: `Status updated to ${newStatus} by tutor`
      });
      
      if (result.success) {
        fetchAllData();
        setIsModalOpen(false);
      } else {
        alert(`Failed to update status: ${result.message}`);
      }
    } catch {
      alert("Error updating status");
    }
  };

  const handleMeetingLinkUpdate = async (bookingId: string, meetingLink: string) => {
    try {
      const result = await tutorBookingService.updateMeetingLink(bookingId, meetingLink);
      if (result.success) {
        fetchAllData();
      } else {
        alert(`Failed to update meeting link: ${result.message}`);
      }
    } catch {
      alert("Error updating meeting link");
    }
  };

  const handleRefresh = () => {
    fetchAllData();
  };

  const handleMarkAllNotificationsAsRead = async () => {
    const result = await tutorBookingService.markAllNotificationsAsRead();
    if (result.success) {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium mb-2">Loading Bookings Dashboard</p>
          <p className="text-gray-400 text-sm">Connecting to server... {connectionStatus}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">📚 My Bookings</h1>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              connectionStatus === 'connected' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {connectionStatus === 'connected' ? 'Connected' : 'Offline'}
            </div>
          </div>
          <p className="text-gray-600 mt-1">Manage all your tutoring sessions</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowNotificationsPanel(!showNotificationsPanel)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2 relative"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Notifications
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          
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
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-red-700">{error}</p>
              {connectionStatus === 'failed' && (
                <p className="text-xs text-red-600 mt-1">
                  Please ensure your backend server is running at {env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}
                </p>
              )}
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {showNotificationsPanel && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
               onClick={() => setShowNotificationsPanel(false)} />
          
          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            <div className="relative w-screen max-w-md">
              <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                <div className="flex-1 py-6 px-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-medium text-gray-900">
                      Notifications
                      {unreadCount > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </h2>
                    <div className="flex gap-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllNotificationsAsRead}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Mark all read
                        </button>
                      )}
                      <button
                        onClick={() => setShowNotificationsPanel(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <TutorNotifications />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        {stats ? (
          <>
            <BookingStats stats={stats} />
            <div className="mt-4 text-center text-sm text-gray-500">
              Showing {filteredBookings.length} of {bookings.length} total bookings
            </div>
          </>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-lg font-medium text-yellow-800 mb-2">Stats Not Available</h3>
            <p className="text-yellow-700">Booking statistics could not be loaded.</p>
          </div>
        )}
      </div>

      <BookingFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateRange={dateRange}
        setDateRange={setDateRange}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        connectionStatus={connectionStatus}
      />

      <div>
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bookings Found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || statusFilter !== 'all' || dateRange.start || dateRange.end
                ? "No bookings match your current filters. Try adjusting your search criteria."
                : "You don't have any bookings yet. Bookings will appear here once students book your sessions."}
            </p>
            {(searchTerm || statusFilter !== 'all' || dateRange.start || dateRange.end) && (
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setDateRange({ start: null, end: null });
                  setSearchTerm('');
                }}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredBookings.length}</span> bookings
                {statusFilter !== 'all' && ` (filtered by ${statusFilter.toLowerCase()})`}
              </div>
              <div className="text-xs text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
            <BookingsList
              bookings={filteredBookings}
              onViewDetails={handleViewDetails}
              onStatusUpdate={handleStatusUpdate}
            />
          </>
        )}
      </div>

      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onStatusUpdate={handleStatusUpdate}
          onMeetingLinkUpdate={handleMeetingLinkUpdate}
          onRefresh={fetchAllData}
        />
      )}
    </div>
  );
}