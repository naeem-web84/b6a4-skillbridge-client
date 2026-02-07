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
        fetchBookings(); // Refresh list
      } else {
        alert(`Failed to cancel booking: ${result.message}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="text-center py-8">Loading bookings...</div>;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">My Bookings</h2>
          <p className="text-gray-600">Manage your tutoring sessions</p>
        </div>
        <button
          onClick={() => alert("Booking creation UI coming soon!")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + New Booking
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-4 py-2 rounded ${statusFilter === 'ALL' ? 'bg-blue-600 text-white' : 'bg-white border'}`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('PENDING')}
            className={`px-4 py-2 rounded ${statusFilter === 'PENDING' ? 'bg-yellow-600 text-white' : 'bg-white border'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter('CONFIRMED')}
            className={`px-4 py-2 rounded ${statusFilter === 'CONFIRMED' ? 'bg-blue-600 text-white' : 'bg-white border'}`}
          >
            Confirmed
          </button>
          <button
            onClick={() => setStatusFilter('COMPLETED')}
            className={`px-4 py-2 rounded ${statusFilter === 'COMPLETED' ? 'bg-green-600 text-white' : 'bg-white border'}`}
          >
            Completed
          </button>
          <button
            onClick={() => setStatusFilter('CANCELLED')}
            className={`px-4 py-2 rounded ${statusFilter === 'CANCELLED' ? 'bg-red-600 text-white' : 'bg-white border'}`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-gray-600">No bookings found</h3>
          <p className="text-gray-500 mt-2">You haven't made any bookings yet.</p>
          <button
            onClick={() => alert("Find a tutor to book!")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Find a Tutor
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{booking.tutorProfile.headline}</h3>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-600">
                      📅 {new Date(booking.bookingDate).toLocaleDateString()}
                    </span>
                    <span className="text-sm text-gray-600">
                      ⏰ {booking.startTime} - {booking.endTime}
                    </span>
                    <span className="text-sm text-gray-600">
                      💰 ${booking.amount}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm text-gray-600">
                      Category: {booking.category.name}
                    </span>
                    <span className="mx-2">•</span>
                    <span className="text-sm text-gray-600">
                      Paid: {booking.isPaid ? '✅' : '❌'}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {booking.status === 'COMPLETED' && !booking.isPaid && (
                    <button
                      onClick={() => alert("Payment integration coming soon!")}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm"
                    >
                      Pay Now
                    </button>
                  )}
                  {['PENDING', 'CONFIRMED'].includes(booking.status) && (
                    <button
                      onClick={() => cancelBooking(booking.id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={() => alert("View booking details coming soon!")}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
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