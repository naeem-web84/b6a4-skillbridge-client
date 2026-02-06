// components/tutor/availabilityManagement/SlotCard.tsx
'use client';

import { AvailabilitySlot } from '@/services/tutorAvailability.service';
import { tutorAvailabilityService } from '@/services/tutorAvailability.service';

interface SlotCardProps {
  slot: AvailabilitySlot;
  onEdit: () => void;
  onDelete: () => void;
}

export const SlotCard = ({ slot, onEdit, onDelete }: SlotCardProps) => {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const { canModify, reason } = tutorAvailabilityService.canModifySlot(slot);
  const isBooked = slot.isBooked;

  return (
    <div className={`p-4 rounded-xl border transition-all hover:shadow-md ${
      isBooked 
        ? 'bg-gray-50 border-gray-200' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className={`inline-block w-2 h-2 rounded-full ${
              isBooked ? 'bg-red-500' : 'bg-green-500'
            }`}></span>
            <span className="text-sm font-medium text-gray-700">
              {isBooked ? 'Booked' : 'Available'}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Created: {formatDate(slot.createdAt)}
          </p>
        </div>
        
        {slot.isRecurring && (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
            Recurring
          </span>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-lg font-semibold text-gray-900">
            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
          </h4>
        </div>
        
        <div className="text-sm text-gray-600 space-y-1">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Date: {formatDate(slot.date)}</span>
          </div>
          
          {slot.recurringPattern && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Pattern: {slot.recurringPattern}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-3 border-t">
        <button
          onClick={onEdit}
          disabled={!canModify}
          title={!canModify ? reason : 'Edit slot'}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            canModify
              ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Edit
        </button>
        
        <button
          onClick={onDelete}
          disabled={!canModify}
          title={!canModify ? reason : 'Delete slot'}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            canModify
              ? 'bg-red-50 text-red-700 hover:bg-red-100'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Delete
        </button>
      </div>
    </div>
  );
};