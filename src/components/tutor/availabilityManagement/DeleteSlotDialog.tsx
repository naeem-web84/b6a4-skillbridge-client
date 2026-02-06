// components/tutor/availabilityManagement/DeleteSlotDialog.tsx
'use client';

import { useState } from 'react';
import { AvailabilitySlot, tutorAvailabilityService } from '@/services/tutorAvailability.service';

interface DeleteSlotDialogProps {
  isOpen: boolean;
  onClose: () => void;
  slot: AvailabilitySlot;
  onSuccess: () => void;
}

export const DeleteSlotDialog = ({ isOpen, onClose, slot, onSuccess }: DeleteSlotDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await tutorAvailabilityService.deleteAvailabilitySlot(slot.id);

      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete slot');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatDateTime = () => {
    const date = new Date(slot.date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    const startTime = new Date(slot.startTime).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const endTime = new Date(slot.endTime).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    return `${date} from ${startTime} to ${endTime}`;
  };

  const { canModify, reason } = tutorAvailabilityService.canModifySlot(slot);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-30" onClick={onClose}></div>

        {/* Dialog */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg font-semibold text-gray-900">Delete Time Slot</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Are you sure you want to delete this time slot?
                  </p>
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900">{formatDateTime()}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {slot.isRecurring && 'This is a recurring slot. '}
                      {slot.isBooked 
                        ? '⚠️ This slot is booked. Deleting it will cancel the booking.'
                        : 'This slot is currently available for booking.'}
                    </p>
                  </div>

                  {!canModify && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-700">
                        <span className="font-medium">Note:</span> {reason}
                      </p>
                    </div>
                  )}

                  {error && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading || !canModify}
              className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm transition-colors"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};