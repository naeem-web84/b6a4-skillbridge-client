// components/student-find-tutor/BookingManagement.tsx
"use client";

import { useState, useEffect } from "react";
import studentFindTutorService from "@/services/studentFindTutor.service";

interface Booking {
  id: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
  amount: number;
  isPaid: boolean;
  tutorProfile: {
    id: string;
    headline: string;
    hourlyRate: number;
  };
  category: {
    id: string;
    name: string;
  };
}

export default function BookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const filters: any = { page: 1, limit: 20 };
      if (statusFilter !== 'ALL') {
        filters.status = statusFilter;
      }
      
      const result = await studentFindTutorService.booking.getBookings(filters);

      if (result.success) {
        setBookings(result.data || []);
      } else {
        setError(result.message || "Failed to load bookings");
      }
    } catch (err: any) {
      setError(err.message || "Error fetching bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const cancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    
    try {
      const result = await studentFindTutorService.booking.cancelBooking(bookingId);
      if (result.success) {
        alert("Booking cancelled successfully!");
        fetchBookings();
      } else {
        alert(`Failed to cancel booking: ${result.message}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) return <div className="text-center py-8 text-muted-foreground">Loading bookings...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Bookings</h2>
          <p className="text-muted-foreground">Manage your tutoring sessions</p>
        </div>
        <button
          onClick={() => alert("Booking creation UI coming soon!")}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          + New Booking
        </button>
      </div>

      <div className="mb-6 p-4 bg-card rounded-lg border">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-4 py-2 rounded transition-colors ${statusFilter === 'ALL' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('PENDING')}
            className={`px-4 py-2 rounded transition-colors ${statusFilter === 'PENDING' ? 'bg-yellow-600 text-white' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter('CONFIRMED')}
            className={`px-4 py-2 rounded transition-colors ${statusFilter === 'CONFIRMED' ? 'bg-blue-600 text-white' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
          >
            Confirmed
          </button>
          <button
            onClick={() => setStatusFilter('COMPLETED')}
            className={`px-4 py-2 rounded transition-colors ${statusFilter === 'COMPLETED' ? 'bg-green-600 text-white' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
          >
            Completed
          </button>
          <button
            onClick={() => setStatusFilter('CANCELLED')}
            className={`px-4 py-2 rounded transition-colors ${statusFilter === 'CANCELLED' ? 'bg-red-600 text-white' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded mb-4 border border-destructive/20">
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-muted-foreground">No bookings found</h3>
          <p className="text-muted-foreground mt-2">You haven't made any bookings yet.</p>
          <button
            onClick={() => alert("Find a tutor to book!")}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
          >
            Find a Tutor
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-card">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-foreground">{booking.tutorProfile.headline}</h3>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-muted-foreground">
                      📅 {new Date(booking.bookingDate).toLocaleDateString()}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ⏰ {booking.startTime} - {booking.endTime}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      💰 ${booking.amount}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm text-muted-foreground">
                      Category: {booking.category.name}
                    </span>
                    <span className="mx-2">•</span>
                    <span className="text-sm text-muted-foreground">
                      Paid: {booking.isPaid ? '✅' : '❌'}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {booking.status === 'COMPLETED' && !booking.isPaid && (
                    <button
                      onClick={() => alert("Payment integration coming soon!")}
                      className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 rounded hover:bg-green-200 dark:hover:bg-green-800 text-sm transition-colors"
                    >
                      Pay Now
                    </button>
                  )}
                  {['PENDING', 'CONFIRMED'].includes(booking.status) && (
                    <button
                      onClick={() => cancelBooking(booking.id)}
                      className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-800 text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={() => alert("View booking details coming soon!")}
                    className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-800 text-sm transition-colors"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}