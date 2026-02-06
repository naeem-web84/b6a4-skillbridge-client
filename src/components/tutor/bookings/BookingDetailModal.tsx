// components/tutor/bookings/BookingDetailModal.tsx
import { BookingStatus, BookingWithUser } from '@/services/tutorBooking.service';

interface BookingDetailModalProps {
  booking: BookingWithUser;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (bookingId: string, status: BookingStatus) => void;
}

export default function BookingDetailModal({
  booking,
  isOpen,
  onClose,
  onStatusUpdate
}: BookingDetailModalProps) {
  if (!isOpen) return null;

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const availableActions = getStatusActions(booking.status);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Booking Details
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  ID: {booking.id}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="space-y-6">
              {/* Student Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-700 mb-3">👨‍🎓 Student Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{booking.studentUser?.name || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{booking.studentUser?.email || 'No email'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Grade</p>
                    <p className="font-medium">{booking.studentProfile.grade || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Subjects</p>
                    <p className="font-medium">
                      {booking.studentProfile.subjects.join(', ') || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">📅 Session Details</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{formatDate(booking.bookingDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium">
                        {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium">{booking.duration} minutes</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">💰 Payment Details</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="font-medium text-lg">${booking.amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Status</p>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        booking.isPaid
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {booking.isPaid ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-medium">{booking.category.name}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meeting Link & Notes */}
              {(booking.meetingLink || booking.notes) && (
                <div className="space-y-4">
                  {booking.meetingLink && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">🔗 Meeting Link</h4>
                      <a
                        href={booking.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline break-all"
                      >
                        {booking.meetingLink}
                      </a>
                    </div>
                  )}
                  {booking.notes && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">📝 Notes</h4>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {booking.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Status Actions */}
              {availableActions.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">🔄 Update Status</h4>
                  <div className="flex gap-2 flex-wrap">
                    {availableActions.map((action) => (
                      <button
                        key={action}
                        onClick={() => onStatusUpdate(booking.id, action)}
                        className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                      >
                        Mark as {action}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}