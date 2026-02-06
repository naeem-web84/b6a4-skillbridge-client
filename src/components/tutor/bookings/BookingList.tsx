// components/tutor/bookings/BookingsList.tsx
import { BookingStatus, BookingWithUser } from '@/services/tutorBooking.service';

interface BookingsListProps {
  bookings: BookingWithUser[];
  onViewDetails: (booking: BookingWithUser) => void;
  onStatusUpdate: (bookingId: string, status: BookingStatus) => void;
}

export default function BookingsList({ bookings, onViewDetails, onStatusUpdate }: BookingsListProps) {
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

  const getStatusActions = (currentStatus: BookingStatus) => {
    const actions: Record<BookingStatus, BookingStatus[]> = {
      [BookingStatus.PENDING]: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
      [BookingStatus.CONFIRMED]: [BookingStatus.COMPLETED, BookingStatus.CANCELLED, BookingStatus.RESCHEDULED],
      [BookingStatus.COMPLETED]: [],
      [BookingStatus.CANCELLED]: [],
      [BookingStatus.RESCHEDULED]: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
    };
    return actions[currentStatus];
  };

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bookings Found</h3>
        <p className="text-gray-500">You don't have any bookings yet. Bookings will appear here once students book your sessions.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => {
              const statusBadge = getStatusBadge(booking.status);
              const availableActions = getStatusActions(booking.status);

              return (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {booking.studentUser?.name?.charAt(0) || 'S'}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.studentUser?.name || 'Unknown Student'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.studentUser?.email || 'No email'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(booking.bookingDate)}</div>
                    <div className="text-sm text-gray-500">
                      {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      {booking.category.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${booking.amount.toFixed(2)}
                    {booking.isPaid ? (
                      <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Paid</span>
                    ) : (
                      <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Unpaid</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadge.color}`}>
                      {statusBadge.icon} {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onViewDetails(booking)}
                        className="px-3 py-1.5 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm"
                      >
                        View
                      </button>
                      {availableActions.length > 0 && (
                        <div className="relative group">
                          <button className="px-3 py-1.5 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors text-sm">
                            Actions
                          </button>
                          <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border hidden group-hover:block z-10">
                            {availableActions.map((action) => (
                              <button
                                key={action}
                                onClick={() => onStatusUpdate(booking.id, action)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Mark as {action}
                              </button>
                            ))}
                          </div>
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
    </div>
  );
}