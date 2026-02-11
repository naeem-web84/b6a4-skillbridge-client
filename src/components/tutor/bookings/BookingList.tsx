import { useState, useEffect } from 'react';
import { BookingStatus, BookingWithUser } from '@/services/tutorBooking.service';

interface BookingsListProps {
  bookings: BookingWithUser[];
  onViewDetails: (booking: BookingWithUser) => void;
  onStatusUpdate: (bookingId: string, status: BookingStatus) => void;
}

export default function BookingsList({ bookings, onViewDetails, onStatusUpdate }: BookingsListProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const getStatusBadge = (status: BookingStatus) => {
    const config: Record<BookingStatus, { color: string; icon: string }> = {
      [BookingStatus.PENDING]: { color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
      [BookingStatus.CONFIRMED]: { color: 'bg-blue-100 text-blue-800', icon: '✅' },
      [BookingStatus.COMPLETED]: { color: 'bg-green-100 text-green-800', icon: '🎓' },
      [BookingStatus.CANCELLED]: { color: 'bg-red-100 text-red-800', icon: '❌' },
      [BookingStatus.RESCHEDULED]: { color: 'bg-purple-100 text-purple-800', icon: '🔄' },
    };
    return config[status];
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
      minute: '2-digit'
    });
  };

  const getStatusActions = (currentStatus: BookingStatus): BookingStatus[] => {
    switch (currentStatus) {
      case BookingStatus.PENDING:
        return [BookingStatus.CONFIRMED, BookingStatus.CANCELLED];
      case BookingStatus.CONFIRMED:
        return [BookingStatus.COMPLETED, BookingStatus.CANCELLED, BookingStatus.RESCHEDULED];
      case BookingStatus.RESCHEDULED:
        return [BookingStatus.CONFIRMED, BookingStatus.CANCELLED];
      case BookingStatus.COMPLETED:
      case BookingStatus.CANCELLED:
      default:
        return [];
    }
  };

  const handleActionClick = (bookingId: string, status: BookingStatus) => {
    onStatusUpdate(bookingId, status);
    setActiveDropdown(null);
  };

  const toggleDropdown = (bookingId: string) => {
    setActiveDropdown(activeDropdown === bookingId ? null : bookingId);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown && !(event.target as Element).closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 md:p-8 text-center">
        <div className="text-5xl md:text-6xl mb-4">📭</div>
        <h3 className="text-lg md:text-xl font-semibold text-black mb-2">No Bookings Found</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          You don't have any bookings yet. Bookings will appear here once students book your sessions.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-black uppercase tracking-wider">
                Student
              </th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-black uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-black uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-black uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-black uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-black uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => {
              const statusBadge = getStatusBadge(booking.status);
              const availableActions = getStatusActions(booking.status);

              return (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-9 w-9 md:h-10 md:w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-gray-700 font-medium text-sm">
                          {booking.studentUser?.name?.charAt(0) || 'S'}
                        </span>
                      </div>
                      <div className="ml-3 md:ml-4">
                        <div className="text-sm font-medium text-black">
                          {booking.studentUser?.name || 'Unknown Student'}
                        </div>
                        <div className="text-xs md:text-sm text-gray-600 truncate max-w-[150px] md:max-w-none">
                          {booking.studentUser?.email || 'No email'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-black">{formatDate(booking.bookingDate)}</div>
                    <div className="text-xs md:text-sm text-gray-600">
                      {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <span className="px-2 md:px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-black">
                      {booking.category.name}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm md:text-base font-medium text-black">
                        ${booking.amount.toFixed(2)}
                      </span>
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${booking.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {booking.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 md:px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadge.color}`}>
                      {statusBadge.icon} {booking.status}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col sm:flex-row gap-2 dropdown-container">
                      <button
                        onClick={() => onViewDetails(booking)}
                        className="px-3 py-1.5 bg-white border border-gray-300 text-black rounded-md hover:bg-gray-50 transition-colors text-sm shadow-sm flex-1 sm:flex-none"
                      >
                        View
                      </button>
                      {availableActions.length > 0 && (
                        <div className="relative">
                          <button
                            onClick={() => toggleDropdown(booking.id)}
                            className="px-3 py-1.5 bg-white border border-gray-300 text-black rounded-md hover:bg-gray-50 transition-colors text-sm shadow-sm flex-1 sm:flex-none"
                          >
                            Actions
                          </button>
                          
                          {activeDropdown === booking.id && (
                            <div className="absolute right-0 -mt-6 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                              <div className="py-1">
                                {availableActions.map((action) => {
                                  const actionBadge = getStatusBadge(action);
                                  return (
                                    <button
                                      key={action}
                                      onClick={() => handleActionClick(booking.id, action)}
                                      className="w-full flex items-center px-4 py-2.5 text-sm text-black hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
                                    >
                                      <span className={`mr-3 ${actionBadge.color} px-2 py-1 rounded-full`}>
                                        {actionBadge.icon}
                                      </span>
                                      <span className="font-medium">Mark as {action}</span>
                                    </button>
                                  );
                                })}
                              </div>
                              
                              <div className="border-t border-gray-100 py-2 px-4">
                                <button
                                  onClick={() => setActiveDropdown(null)}
                                  className="text-xs text-gray-500 hover:text-black"
                                >
                                  Close
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="bg-gray-50 px-4 md:px-6 py-6 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="text-sm text-black mb-2 sm:mb-0">
            Showing <span className="font-semibold">{bookings.length}</span> bookings
          </div>
          <div className="text-xs text-gray-500">
            Last updated: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
        </div>
      </div>
    </div>
  );
};