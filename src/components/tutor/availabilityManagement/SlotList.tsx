// components/tutor/availabilityManagement/SlotList.tsx
'use client';

import { AvailabilitySlot } from '@/services/tutorAvailability.service';
import { SlotCard } from './SlotCard';

interface SlotListProps {
  slots: AvailabilitySlot[];
  loading: boolean;
  onEdit: (slot: AvailabilitySlot) => void;
  onDelete: (slot: AvailabilitySlot) => void;
}

export const SlotList = ({ slots, loading, onEdit, onDelete }: SlotListProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No availability slots found</h3>
        <p className="text-gray-600">Create your first time slot to start accepting bookings.</p>
      </div>
    );
  }

  // Group slots by date
  const slotsByDate = slots.reduce((acc, slot) => {
    const date = new Date(slot.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, AvailabilitySlot[]>);

  return (
    <div className="space-y-8">
      {Object.entries(slotsByDate).map(([date, dateSlots]) => (
        <div key={date} className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">{date}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dateSlots.map((slot) => (
              <SlotCard
                key={slot.id}
                slot={slot}
                onEdit={() => onEdit(slot)}
                onDelete={() => onDelete(slot)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};