'use client';

import { useState, useEffect } from 'react';
import { CreateSlotForm } from './CreateSlotForm';
import { SlotList } from './SlotList';
import { EditSlotModal } from './EditSlotModal';
import { DeleteSlotDialog } from './DeleteSlotDialog';
import { tutorAvailabilityService, AvailabilitySlot } from '@/services/tutorAvailability.service';

export const AvailabilityPage = () => {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    loadSlots();
  }, []);

  const loadSlots = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await tutorAvailabilityService.getTutorAvailability();
      
      if (result.success && result.data) {
        setSlots(result.data);
      } else {
        setError(result.message || 'Failed to load availability slots');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    loadSlots();
  };

  const handleEditClick = (slot: AvailabilitySlot) => {
    setSelectedSlot(slot);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (slot: AvailabilitySlot) => {
    setSelectedSlot(slot);
    setIsDeleteDialogOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedSlot(null);
    loadSlots();
  };

  const handleDeleteSuccess = () => {
    setIsDeleteDialogOpen(false);
    setSelectedSlot(null);
    loadSlots();
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedSlot(null);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedSlot(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Availability Management</h1>
          <p className="mt-2 text-gray-600">
            Manage your available time slots for students to book sessions
          </p>
        </div>

        <div className="mb-12 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Add New Time Slot</h2>
          <CreateSlotForm onSuccess={handleCreateSuccess} />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Your Availability Slots</h2>
            <button
              onClick={loadSlots}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Refresh
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <SlotList
            slots={slots}
            loading={loading}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </div>

        {selectedSlot && (
          <>
            <EditSlotModal
              isOpen={isEditModalOpen}
              onClose={handleCloseEditModal}
              slot={selectedSlot}
              onSuccess={handleEditSuccess}
            />

            <DeleteSlotDialog
              isOpen={isDeleteDialogOpen}
              onClose={handleCloseDeleteDialog}
              slot={selectedSlot}
              onSuccess={handleDeleteSuccess}
            />
          </>
        )}
      </div>
    </div>
  );
};