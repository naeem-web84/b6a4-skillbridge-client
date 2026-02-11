"use client";

import { useState, useEffect } from "react";
import { studentService } from "@/services/student.service";

interface Booking {
  id: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
  amount: number;
  isPaid: boolean;
  meetingLink?: string;
  notes?: string;
  tutorProfile: {
    id: string;
    headline: string;
    hourlyRate: number;
    rating: number;
    user?: {
      name: string;
      image?: string;
    };
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
      
      const result = await studentService.bookings.getBookings(filters);

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
      const result = await studentService.bookings.cancelBooking(bookingId);
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
      case 'RESCHEDULED': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Bookings</h2>
          <p className="text-muted-foreground">Manage your tutoring sessions</p>
        </div>
        <button
          onClick={fetchBookings}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-2 p-4 bg-card rounded-lg border">
        {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded transition-colors ${
              statusFilter === status 
                ? status === 'ALL' 
                  ? 'bg-primary text-primary-foreground'
                  : status === 'PENDING'
                  ? 'bg-yellow-600 text-white'
                  : status === 'CONFIRMED'
                  ? 'bg-blue-600 text-white'
                  : status === 'COMPLETED'
                  ? 'bg-green-600 text-white'
                  : 'bg-red-600 text-white'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {status.charAt(0) + status.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded border border-destructive/20">
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border">
          <div className="text-muted-foreground text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-muted-foreground">No bookings found</h3>
          <p className="text-muted-foreground mt-2">You haven't made any bookings yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-card">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-bold text-lg text-foreground">{booking.tutorProfile.headline}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">📅</span>
                      <span className="text-sm text-foreground">{formatDate(booking.bookingDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">⏰</span>
                      <span className="text-sm text-foreground">{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">💰</span>
                      <span className="text-sm text-foreground">${booking.amount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">📚</span>
                      <span className="text-sm text-foreground">{booking.category.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      Tutor: {booking.tutorProfile.user?.name || 'Tutor'}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      • {booking.duration} min
                    </span>
                    <span className={`text-sm ${booking.isPaid ? 'text-green-600' : 'text-red-600'}`}>
                      {booking.isPaid ? '✓ Paid' : '✗ Unpaid'}
                    </span>
                  </div>

                  {booking.meetingLink && booking.status === 'CONFIRMED' && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Meeting Link:</p>
                      <a
                        href={booking.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline break-all"
                      >
                        {booking.meetingLink}
                      </a>
                    </div>
                  )}

                  {booking.notes && (
                    <div className="mt-3">
                      <p className="text-sm text-muted-foreground">Notes:</p>
                      <p className="text-foreground bg-muted p-2 rounded mt-1">{booking.notes}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  {booking.status === 'COMPLETED' && !booking.isPaid && (
                    <button
                      onClick={() => alert("Payment integration coming soon!")}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm transition-colors"
                    >
                      Pay Now
                    </button>
                  )}
                  {['PENDING', 'CONFIRMED'].includes(booking.status) && (
                    <button
                      onClick={() => cancelBooking(booking.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={() => alert("View booking details")}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm transition-colors"
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
};