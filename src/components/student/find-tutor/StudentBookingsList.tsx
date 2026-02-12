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
  const [error, setError] = useState<string | null>(null);
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
      setError("Error fetching bookings");
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
      case BookingStatus.PENDING: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case BookingStatus.CONFIRMED: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case BookingStatus.COMPLETED: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case BookingStatus.CANCELLED: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case BookingStatus.RESCHEDULED: return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const filteredBookings = statusFilter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === statusFilter);

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
        <h1 className="text-2xl font-bold text-foreground">My Bookings</h1>
        <button
          onClick={fetchBookings}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {['all', BookingStatus.PENDING, BookingStatus.CONFIRMED, 
          BookingStatus.COMPLETED, BookingStatus.CANCELLED].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status as any)}
            className={`px-4 py-2 rounded-full transition-colors ${statusFilter === status ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
          >
            {status === 'all' ? 'All' : status}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No bookings found</p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-card rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-foreground">{booking.tutorProfile.headline}</h3>
                  <p className="text-muted-foreground">{booking.tutorProfile.user?.name || 'Tutor'}</p>
                  <p className="text-sm text-muted-foreground mt-1">${booking.tutorProfile.hourlyRate}/hour</p>
                </div>

                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                  <p className="text-muted-foreground text-sm mt-1">
                    {formatDate(booking.bookingDate)} • {formatTime(booking.startTime)}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium text-foreground">{booking.category.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium text-foreground">{booking.duration} minutes</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium text-foreground">${booking.amount.toFixed(2)}</p>
                </div>
              </div>

              {booking.meetingLink && booking.status === BookingStatus.CONFIRMED && (
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
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Click to join the session at scheduled time
                  </p>
                </div>
              )}

              {booking.notes && (
                <div className="mt-3">
                  <p className="text-sm text-muted-foreground">Your Notes:</p>
                  <p className="text-foreground">{booking.notes}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}