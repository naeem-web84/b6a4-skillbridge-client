// services/tutorBooking.service.ts
import { env } from "@/env";

const API_BASE_URL = env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ==================== TYPES ====================

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  RESCHEDULED = "RESCHEDULED",
}

export enum NotificationType {
  BOOKING = "BOOKING",
  REVIEW = "REVIEW",
  PAYMENT = "PAYMENT",
  SYSTEM = "SYSTEM",
  REMINDER = "REMINDER",
}

export interface StudentProfile {
  id: string;
  userId: string;
  grade?: string;
  subjects: string[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface AvailabilitySlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isRecurring?: boolean;
  recurringPattern?: string;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface StudentUser {
  id: string;
  name: string;
  email: string;
}

export interface Booking {
  id: string;
  studentUserId: string;
  tutorUserId: string;
  studentProfileId: string;
  tutorProfileId: string;
  categoryId: string;
  availabilitySlotId?: string;
  
  // Relations
  studentProfile: StudentProfile;
  category: Category;
  availabilitySlot?: AvailabilitySlot;
  review?: Review;
  
  // Booking details
  bookingDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: BookingStatus;
  amount: number;
  paymentId?: string;
  isPaid: boolean;
  meetingLink?: string;
  notes?: string;
  
  createdAt: string;
  updatedAt: string;
  
  // Frontend only - populated from separate call
  studentUser?: StudentUser;
}

export interface BookingWithUser extends Booking {
  studentUser: StudentUser;
}

export interface BookingStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  upcomingBookings: number;
  totalEarnings: number;
  completionRate: number;
}

export interface GetBookingsFilters {
  status?: BookingStatus;
  studentId?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export interface UpdateBookingStatusInput {
  status: BookingStatus;
  notes?: string;
  meetingLink?: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface GetBookingsResponse extends BaseResponse {
  data: BookingWithUser[];
  pagination: PaginationInfo;
}

export interface GetBookingByIdResponse extends BaseResponse {
  data: BookingWithUser;
}

export interface UpdateBookingStatusResponse extends BaseResponse {
  data: Booking & { studentUser: StudentUser };
}

export interface GetBookingStatsResponse extends BaseResponse {
  data: BookingStats;
}

// ==================== HELPER FUNCTIONS ====================

const getAuthToken = async (): Promise<string | null> => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    const { authClient } = await import("@/lib/auth-client");
    const session = await authClient.getSession();
    return session?.data?.session?.token || null;
  } catch {
    return null;
  }
};

const getHeaders = async (): Promise<HeadersInit> => {
  const token = await getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

const getDefaultStats = (): BookingStats => ({
  totalBookings: 0,
  pendingBookings: 0,
  confirmedBookings: 0,
  completedBookings: 0,
  cancelledBookings: 0,
  upcomingBookings: 0,
  totalEarnings: 0,
  completionRate: 0
});

// ==================== MAIN SERVICE ====================

export const tutorBookingService = {
  /**
   * ১. টিউটরের সব বুকিং দেখবে (স্ট্যাটাস, ছাত্র, তারিখ দিয়ে ফিল্টার করা যায়)
   */
  getTutorBookings: async function (
    filters?: GetBookingsFilters
  ): Promise<GetBookingsResponse> {
    try {
      const headers = await getHeaders();
      
      const queryParams = new URLSearchParams();
      
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.studentId) queryParams.append('studentId', filters.studentId);
      if (filters?.startDate) queryParams.append('startDate', filters.startDate.toISOString());
      if (filters?.endDate) queryParams.append('endDate', filters.endDate.toISOString());
      if (filters?.page) queryParams.append('page', filters.page.toString());
      if (filters?.limit) queryParams.append('limit', filters.limit.toString());
      
      const queryString = queryParams.toString();
      const endpoint = `/api/tutors/bookings${queryString ? `?${queryString}` : ''}`;
      
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      const responseText = await res.text();
      
      if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
        return {
          success: false,
          message: "Server error",
          data: [],
          pagination: {
            total: 0,
            page: filters?.page || 1,
            limit: filters?.limit || 10,
            totalPages: 0
          }
        };
      }
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch {
        return {
          success: false,
          message: "Invalid response",
          data: [],
          pagination: {
            total: 0,
            page: filters?.page || 1,
            limit: filters?.limit || 10,
            totalPages: 0
          }
        };
      }

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to fetch bookings",
          data: [],
          pagination: {
            total: 0,
            page: filters?.page || 1,
            limit: filters?.limit || 10,
            totalPages: 0
          }
        };
      }

      return {
        success: true,
        message: result.message || "Bookings fetched successfully",
        data: result.data || [],
        pagination: result.pagination || {
          total: 0,
          page: filters?.page || 1,
          limit: filters?.limit || 10,
          totalPages: 0
        }
      };
      
    } catch (error: any) {
      return {
        success: false,
        message: "Failed to fetch bookings",
        data: [],
        pagination: {
          total: 0,
          page: filters?.page || 1,
          limit: filters?.limit || 10,
          totalPages: 0
        }
      };
    }
  },

  /**
   * ২. টিউটরের বুকিং স্ট্যাটিসটিক্স দেখবে
   */
  getBookingStats: async function (): Promise<GetBookingStatsResponse> {
    try {
      const headers = await getHeaders();
      const endpoint = '/api/tutors/bookings/stats';
      
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      const responseText = await res.text();
      
      if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
        return await this.calculateStatsFromBookings();
      }
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch {
        return await this.calculateStatsFromBookings();
      }

      if (!res.ok) {
        return await this.calculateStatsFromBookings();
      }

      return {
        success: true,
        message: "Booking statistics fetched successfully",
        data: result.data || getDefaultStats()
      };
      
    } catch {
      return {
        success: true,
        message: "Statistics loaded",
        data: getDefaultStats()
      };
    }
  },

  /**
   * Calculate stats from bookings
   */
  calculateStatsFromBookings: async function (): Promise<GetBookingStatsResponse> {
    try {
      const bookingsResult = await this.getTutorBookings({ limit: 1000 });
      
      if (!bookingsResult.success || !bookingsResult.data) {
        return {
          success: true,
          message: "Statistics calculated",
          data: getDefaultStats()
        };
      }
      
      const bookings = bookingsResult.data;
      const now = new Date();
      
      const totalBookings = bookings.length;
      const pendingBookings = bookings.filter(b => b.status === BookingStatus.PENDING).length;
      const confirmedBookings = bookings.filter(b => b.status === BookingStatus.CONFIRMED).length;
      const completedBookings = bookings.filter(b => b.status === BookingStatus.COMPLETED).length;
      const cancelledBookings = bookings.filter(b => b.status === BookingStatus.CANCELLED).length;
      
      const upcomingBookings = bookings.filter(b => 
        b.status === BookingStatus.CONFIRMED && 
        new Date(b.bookingDate) > now
      ).length;
      
      const totalEarnings = bookings
        .filter(b => b.status === BookingStatus.COMPLETED && b.isPaid)
        .reduce((sum, b) => sum + b.amount, 0);
      
      const completionRate = totalBookings > 0 
        ? Math.round((completedBookings / totalBookings) * 100) 
        : 0;
      
      const stats = {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        upcomingBookings,
        totalEarnings,
        completionRate
      };
      
      return {
        success: true,
        message: "Statistics calculated from bookings",
        data: stats
      };
      
    } catch {
      return {
        success: true,
        message: "Default statistics loaded",
        data: getDefaultStats()
      };
    }
  },

  /**
   * ৩. একটি নির্দিষ্ট বুকিংয়ের ডিটেইল দেখবে
   */
  getBookingById: async function (
    bookingId: string
  ): Promise<GetBookingByIdResponse> {
    try {
      if (!bookingId) {
        return {
          success: false,
          message: "Booking ID is required",
          data: {} as BookingWithUser
        };
      }

      const headers = await getHeaders();
      const endpoint = `/api/tutors/bookings/${bookingId}`;
      
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      const responseText = await res.text();
      
      if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
        return {
          success: false,
          message: "Server error",
          data: {} as BookingWithUser
        };
      }
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch {
        return {
          success: false,
          message: "Invalid response",
          data: {} as BookingWithUser
        };
      }

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to fetch booking details",
          data: {} as BookingWithUser
        };
      }

      return {
        success: true,
        message: "Booking details fetched successfully",
        data: result.data || {} as BookingWithUser
      };
      
    } catch {
      return {
        success: false,
        message: "Failed to fetch booking details",
        data: {} as BookingWithUser
      };
    }
  },

  /**
   * ৪. বুকিংয়ের স্ট্যাটাস আপডেট করবে
   */
  updateBookingStatus: async function (
    bookingId: string,
    data: UpdateBookingStatusInput
  ): Promise<UpdateBookingStatusResponse> {
    try {
      if (!bookingId) {
        return {
          success: false,
          message: "Booking ID is required",
          data: {} as Booking & { studentUser: StudentUser }
        };
      }

      if (!data.status) {
        return {
          success: false,
          message: "Status is required",
          data: {} as Booking & { studentUser: StudentUser }
        };
      }

      const headers = await getHeaders();
      const endpoint = `/api/tutors/bookings/${bookingId}/status`;
      
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
      });

      const responseText = await res.text();
      
      if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
        return {
          success: false,
          message: "Server error",
          data: {} as Booking & { studentUser: StudentUser }
        };
      }
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch {
        return {
          success: false,
          message: "Invalid response",
          data: {} as Booking & { studentUser: StudentUser }
        };
      }

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to update booking status",
          data: {} as Booking & { studentUser: StudentUser }
        };
      }

      return {
        success: true,
        message: "Booking status updated successfully",
        data: result.data || {} as Booking & { studentUser: StudentUser }
      };
      
    } catch {
      return {
        success: false,
        message: "Failed to update booking status",
        data: {} as Booking & { studentUser: StudentUser }
      };
    }
  },

  /**
   * Get upcoming bookings
   */
  getUpcomingBookings: async function (
    limit?: number
  ): Promise<GetBookingsResponse> {
    try {
      const filters: GetBookingsFilters = {
        status: BookingStatus.CONFIRMED,
        startDate: new Date(),
        limit: limit || 5
      };
      
      return await this.getTutorBookings(filters);
      
    } catch {
      return {
        success: false,
        message: "Failed to fetch upcoming bookings",
        data: [],
        pagination: {
          total: 0,
          page: 1,
          limit: limit || 5,
          totalPages: 0
        }
      };
    }
  },

  /**
   * Get recent bookings
   */
  getRecentBookings: async function (
    limit?: number
  ): Promise<GetBookingsResponse> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      
      const filters: GetBookingsFilters = {
        startDate,
        endDate,
        limit: limit || 10
      };
      
      return await this.getTutorBookings(filters);
      
    } catch {
      return {
        success: false,
        message: "Failed to fetch recent bookings",
        data: [],
        pagination: {
          total: 0,
          page: 1,
          limit: limit || 10,
          totalPages: 0
        }
      };
    }
  },

  /**
   * Get bookings by status
   */
  getBookingsByStatus: async function (
    status: BookingStatus,
    page?: number,
    limit?: number
  ): Promise<GetBookingsResponse> {
    try {
      const filters: GetBookingsFilters = {
        status,
        page: page || 1,
        limit: limit || 10
      };
      
      return await this.getTutorBookings(filters);
      
    } catch {
      return {
        success: false,
        message: "Failed to fetch bookings",
        data: [],
        pagination: {
          total: 0,
          page: page || 1,
          limit: limit || 10,
          totalPages: 0
        }
      };
    }
  }
};

export default tutorBookingService;