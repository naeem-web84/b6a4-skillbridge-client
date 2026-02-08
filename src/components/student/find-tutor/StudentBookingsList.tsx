 "use client"
import { useState, useEffect } from 'react';
import { bookingService } from '@/services/studentFindTutor.service';
import { BookingStatus } from '@/services/tutorBooking.service';

interface StudentBooking {
  id: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: BookingStatus;
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
  availabilitySlot?: {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
  };
}

export default function StudentBookingsList() {
  const [bookings, setBookings] = useState<StudentBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const result = await bookingService.getBookings({});
      
      if (result.success && result.data) {
        setBookings(result.data as StudentBooking[]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
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

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
      case BookingStatus.CONFIRMED: return 'bg-blue-100 text-blue-800';
      case BookingStatus.COMPLETED: return 'bg-green-100 text-green-800';
      case BookingStatus.CANCELLED: return 'bg-red-100 text-red-800';
      case BookingStatus.RESCHEDULED: return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBookings = statusFilter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === statusFilter);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <button
          onClick={fetchBookings}
          className="px-4 py-2 bg-black text-black rounded-lg hover:bg-gray-800"
        >
          Refresh
        </button>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 overflow-x-auto">
        {['all', BookingStatus.PENDING, BookingStatus.CONFIRMED, 
          BookingStatus.COMPLETED, BookingStatus.CANCELLED].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status as any)}
            className={`px-4 py-2 rounded-full ${statusFilter === status ? 'bg-black text-white' : 'bg-gray-100'}`}
          >
            {status === 'all' ? 'All' : status}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No bookings found</p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                {/* Left: Tutor Info */}
                <div>
                  <h3 className="font-bold text-lg">{booking.tutorProfile.headline}</h3>
                  <p className="text-gray-600">{booking.tutorProfile.user?.name || 'Tutor'}</p>
                  <p className="text-sm text-gray-500 mt-1">${booking.tutorProfile.hourlyRate}/hour</p>
                </div>

                {/* Right: Status & Actions */}
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                  <p className="text-gray-500 text-sm mt-1">
                    {formatDate(booking.bookingDate)} • {formatTime(booking.startTime)}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{booking.category.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">{booking.duration} minutes</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-medium">${booking.amount.toFixed(2)}</p>
                </div>
              </div>

              {/* Meeting Link (if available) */}
              {booking.meetingLink && booking.status === BookingStatus.CONFIRMED && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 mb-1">Meeting Link:</p>
                  <a
                    href={booking.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline break-all"
                  >
                    {booking.meetingLink}
                  </a>
                  <p className="text-xs text-blue-600 mt-1">
                    Click to join the session at scheduled time
                  </p>
                </div>
              )}

              {/* Notes */}
              {booking.notes && (
                <div className="mt-3">
                  <p className="text-sm text-gray-500">Your Notes:</p>
                  <p className="text-gray-700">{booking.notes}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}