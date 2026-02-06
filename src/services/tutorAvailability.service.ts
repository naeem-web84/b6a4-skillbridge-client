// services/tutorAvailability.service.ts
import { env } from '@/env';

const API_BASE_URL = env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Types
export interface CreateAvailabilitySlotInput {
  date: string | Date;
  startTime: string | Date;
  endTime: string | Date;
  isRecurring?: boolean;
  recurringPattern?: string;
  validFrom?: string | Date;
  validUntil?: string | Date;
}

export interface UpdateAvailabilitySlotInput {
  date?: string | Date;
  startTime?: string | Date;
  endTime?: string | Date;
  isBooked?: boolean;
}

export interface AvailabilitySlot {
  id: string;
  tutorProfileId: string;
  date: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  recurringPattern: string | null;
  validFrom: string | null;
  validUntil: string | null;
  isBooked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetAvailabilityFilters {
  date?: string | Date;
  startDate?: string | Date;
  endDate?: string | Date;
  isBooked?: boolean;
}

export interface CreateAvailabilityResponse {
  success: boolean;
  message: string;
  data?: AvailabilitySlot;
}

export interface GetAvailabilityResponse {
  success: boolean;
  data?: AvailabilitySlot[];
  message?: string;
}

export interface GetSingleSlotResponse {
  success: boolean;
  data?: AvailabilitySlot;
  message?: string;
}

export interface UpdateAvailabilityResponse {
  success: boolean;
  message: string;
  data?: AvailabilitySlot;
}

export interface DeleteAvailabilityResponse {
  success: boolean;
  message: string;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  status?: number;
}

export const tutorAvailabilityService = {
  /**
   * Create a new availability slot
   */
  createAvailabilitySlot: async (
    data: CreateAvailabilitySlotInput
  ): Promise<CreateAvailabilityResponse> => {
    try {
      // Format dates for API
      const formattedData = {
        ...data,
        date: data.date instanceof Date ? data.date.toISOString() : data.date,
        startTime: data.startTime instanceof Date ? data.startTime.toISOString() : data.startTime,
        endTime: data.endTime instanceof Date ? data.endTime.toISOString() : data.endTime,
        validFrom: data.validFrom 
          ? (data.validFrom instanceof Date ? data.validFrom.toISOString() : data.validFrom)
          : undefined,
        validUntil: data.validUntil
          ? (data.validUntil instanceof Date ? data.validUntil.toISOString() : data.validUntil)
          : undefined,
      };

      const response = await fetch(`${API_BASE_URL}/tutors/availability`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `HTTP error! status: ${response.status}`,
        }));
        
        return {
          success: false,
          message: errorData.message || `Failed to create availability slot: ${response.status}`,
        };
      }

      const result = await response.json();
      return result;
    } catch (error: any) {
      console.error('Error creating availability slot:', error);
      return {
        success: false,
        message: error.message || 'Network error occurred while creating availability slot',
      };
    }
  },

  /**
   * Get tutor's availability slots with optional filters
   */
  getTutorAvailability: async (
    filters?: GetAvailabilityFilters
  ): Promise<GetAvailabilityResponse> => {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      if (filters?.date) {
        const dateValue = filters.date instanceof Date 
          ? filters.date.toISOString().split('T')[0]
          : filters.date;
        queryParams.append('date', dateValue);
      }
      
      if (filters?.startDate) {
        const startDateValue = filters.startDate instanceof Date
          ? filters.startDate.toISOString()
          : filters.startDate;
        queryParams.append('startDate', startDateValue);
      }
      
      if (filters?.endDate) {
        const endDateValue = filters.endDate instanceof Date
          ? filters.endDate.toISOString()
          : filters.endDate;
        queryParams.append('endDate', endDateValue);
      }
      
      if (filters?.isBooked !== undefined) {
        queryParams.append('isBooked', filters.isBooked.toString());
      }

      const url = `${API_BASE_URL}/tutors/availability${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `HTTP error! status: ${response.status}`,
        }));
        
        return {
          success: false,
          message: errorData.message || `Failed to get availability slots: ${response.status}`,
        };
      }

      const result = await response.json();
      return result;
    } catch (error: any) {
      console.error('Error getting availability slots:', error);
      return {
        success: false,
        message: error.message || 'Network error occurred while getting availability slots',
      };
    }
  },

  /**
   * Get single availability slot by ID
   */
  getAvailabilitySlot: async (slotId: string): Promise<GetSingleSlotResponse> => {
    try {
      // Clean and validate slotId
      const cleanSlotId = slotId.trim();
      if (!cleanSlotId) {
        return {
          success: false,
          message: 'Slot ID is required',
        };
      }

      const response = await fetch(`${API_BASE_URL}/tutors/availability/${cleanSlotId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `HTTP error! status: ${response.status}`,
        }));
        
        return {
          success: false,
          message: errorData.message || `Failed to get availability slot: ${response.status}`,
        };
      }

      const result = await response.json();
      return result;
    } catch (error: any) {
      console.error('Error getting availability slot:', error);
      return {
        success: false,
        message: error.message || 'Network error occurred while getting availability slot',
      };
    }
  },

  /**
   * Update an existing availability slot
   */
  updateAvailabilitySlot: async (
    slotId: string,
    data: UpdateAvailabilitySlotInput
  ): Promise<UpdateAvailabilityResponse> => {
    try {
      // Clean and validate slotId
      const cleanSlotId = slotId.trim();
      if (!cleanSlotId) {
        return {
          success: false,
          message: 'Slot ID is required',
        };
      }

      // Format dates for API
      const formattedData: any = {};
      if (data.date !== undefined) {
        formattedData.date = data.date instanceof Date ? data.date.toISOString() : data.date;
      }
      if (data.startTime !== undefined) {
        formattedData.startTime = data.startTime instanceof Date 
          ? data.startTime.toISOString() 
          : data.startTime;
      }
      if (data.endTime !== undefined) {
        formattedData.endTime = data.endTime instanceof Date 
          ? data.endTime.toISOString() 
          : data.endTime;
      }
      if (data.isBooked !== undefined) {
        formattedData.isBooked = data.isBooked;
      }

      // Check if there's any data to update
      if (Object.keys(formattedData).length === 0) {
        return {
          success: false,
          message: 'No update data provided',
        };
      }

      const response = await fetch(`${API_BASE_URL}/tutors/availability/${cleanSlotId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `HTTP error! status: ${response.status}`,
        }));
        
        return {
          success: false,
          message: errorData.message || `Failed to update availability slot: ${response.status}`,
        };
      }

      const result = await response.json();
      return result;
    } catch (error: any) {
      console.error('Error updating availability slot:', error);
      return {
        success: false,
        message: error.message || 'Network error occurred while updating availability slot',
      };
    }
  },

  /**
   * Delete an availability slot
   */
  deleteAvailabilitySlot: async (slotId: string): Promise<DeleteAvailabilityResponse> => {
    try {
      // Clean and validate slotId
      const cleanSlotId = slotId.trim();
      if (!cleanSlotId) {
        return {
          success: false,
          message: 'Slot ID is required',
        };
      }

      const response = await fetch(`${API_BASE_URL}/tutors/availability/${cleanSlotId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `HTTP error! status: ${response.status}`,
        }));
        
        return {
          success: false,
          message: errorData.message || `Failed to delete availability slot: ${response.status}`,
        };
      }

      const result = await response.json();
      return result;
    } catch (error: any) {
      console.error('Error deleting availability slot:', error);
      return {
        success: false,
        message: error.message || 'Network error occurred while deleting availability slot',
      };
    }
  },

  /**
   * Helper function to format date and time for API submission
   */
  formatDateTimeForAPI: (date: Date | string, time?: string): string => {
    let dateObj: Date;
    
    if (typeof date === 'string') {
      dateObj = new Date(date);
    } else {
      dateObj = new Date(date);
    }
    
    if (time) {
      const [hours, minutes] = time.split(':');
      dateObj.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    }
    
    return dateObj.toISOString();
  },

  /**
   * Helper function to check if a slot can be edited/deleted
   */
  canModifySlot: (slot: AvailabilitySlot): { canModify: boolean; reason?: string } => {
    const now = new Date();
    const slotDate = new Date(slot.date);
    const slotStartTime = new Date(slot.startTime);
    
    // Check if slot is booked
    if (slot.isBooked) {
      return { canModify: false, reason: 'Slot is already booked' };
    }
    
    // Combine date and time for comparison
    const slotDateTime = new Date(
      slotDate.getFullYear(),
      slotDate.getMonth(),
      slotDate.getDate(),
      slotStartTime.getHours(),
      slotStartTime.getMinutes(),
      slotStartTime.getSeconds()
    );
    
    // Add 30 minutes buffer - can't modify slots that start in less than 30 minutes
    const bufferMinutes = 30;
    const cutoffTime = new Date(now.getTime() + bufferMinutes * 60000);
    
    if (slotDateTime <= cutoffTime) {
      return { canModify: false, reason: 'Cannot modify slot less than 30 minutes before start time' };
    }
    
    return { canModify: true };
  },

  /**
   * Helper function to get slots for a specific date range
   */
  getSlotsForDateRange: async (
    startDate: Date | string,
    endDate: Date | string,
    isBooked?: boolean
  ): Promise<{ slots: AvailabilitySlot[]; error?: string }> => {
    const filters: GetAvailabilityFilters = {
      startDate: typeof startDate === 'string' ? startDate : startDate.toISOString(),
      endDate: typeof endDate === 'string' ? endDate : endDate.toISOString(),
    };
    
    if (isBooked !== undefined) {
      filters.isBooked = isBooked;
    }
    
    const result = await tutorAvailabilityService.getTutorAvailability(filters);
    
    if (result.success && result.data) {
      return { slots: result.data };
    }
    
    return { slots: [], error: result.message };
  },

  /**
   * Helper function to get upcoming available slots
   */
  getUpcomingAvailableSlots: async (
    days: number = 7,
    includeBooked: boolean = false
  ): Promise<{ slots: AvailabilitySlot[]; error?: string }> => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + days);
    
    const filters: GetAvailabilityFilters = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
    
    if (!includeBooked) {
      filters.isBooked = false;
    }
    
    const result = await tutorAvailabilityService.getTutorAvailability(filters);
    
    if (result.success && result.data) {
      // Sort by date and time
      const sortedSlots = result.data.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        const dateCompare = dateA.getTime() - dateB.getTime();
        
        if (dateCompare !== 0) return dateCompare;
        
        const timeA = new Date(a.startTime);
        const timeB = new Date(b.startTime);
        return timeA.getTime() - timeB.getTime();
      });
      
      return { slots: sortedSlots };
    }
    
    return { slots: [], error: result.message };
  },

  /**
   * Helper to format slot for display
   */
  formatSlotForDisplay: (slot: AvailabilitySlot): string => {
    const date = new Date(slot.date);
    const startTime = new Date(slot.startTime);
    const endTime = new Date(slot.endTime);
    
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    
    const formattedStartTime = startTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    
    const formattedEndTime = endTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    
    return `${formattedDate} | ${formattedStartTime} - ${formattedEndTime}`;
  },

  /**
   * Check for overlapping slots locally before API call
   */
  checkForOverlap: (
    slots: AvailabilitySlot[],
    newSlot: {
      date: Date | string;
      startTime: Date | string;
      endTime: Date | string;
    },
    excludeSlotId?: string
  ): boolean => {
    const newDate = new Date(newSlot.date);
    const newStart = new Date(newSlot.startTime);
    const newEnd = new Date(newSlot.endTime);
    
    // Normalize dates to compare only date part
    const normalizeDate = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };
    
    const normalizedNewDate = normalizeDate(newDate);
    
    for (const slot of slots) {
      // Skip the slot we're updating
      if (excludeSlotId && slot.id === excludeSlotId) {
        continue;
      }
      
      const slotDate = new Date(slot.date);
      const slotStart = new Date(slot.startTime);
      const slotEnd = new Date(slot.endTime);
      
      const normalizedSlotDate = normalizeDate(slotDate);
      
      // Check if dates match
      if (normalizedNewDate.getTime() !== normalizedSlotDate.getTime()) {
        continue;
      }
      
      // Check for time overlap
      if (
        (newStart >= slotStart && newStart < slotEnd) ||
        (newEnd > slotStart && newEnd <= slotEnd) ||
        (newStart <= slotStart && newEnd >= slotEnd)
      ) {
        return true;
      }
    }
    
    return false;
  },

  /**
   * Validate slot data before sending to API
   */
  validateSlotData: (
    data: CreateAvailabilitySlotInput | UpdateAvailabilitySlotInput
  ): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Check start and end times
    if ('startTime' in data && 'endTime' in data && data.startTime && data.endTime) {
      const start = new Date(data.startTime);
      const end = new Date(data.endTime);
      
      if (isNaN(start.getTime())) {
        errors.push('Invalid start time');
      }
      
      if (isNaN(end.getTime())) {
        errors.push('Invalid end time');
      }
      
      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end <= start) {
        errors.push('End time must be after start time');
      }
    }
    
    // Check date if provided
    if ('date' in data && data.date) {
      const date = new Date(data.date);
      if (isNaN(date.getTime())) {
        errors.push('Invalid date');
      }
    }
    
    // Check for minimum slot duration (15 minutes)
    if ('startTime' in data && 'endTime' in data && data.startTime && data.endTime) {
      const start = new Date(data.startTime);
      const end = new Date(data.endTime);
      
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
        if (durationMinutes < 15) {
          errors.push('Minimum slot duration is 15 minutes');
        }
        
        if (durationMinutes > 240) {
          errors.push('Maximum slot duration is 4 hours');
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};