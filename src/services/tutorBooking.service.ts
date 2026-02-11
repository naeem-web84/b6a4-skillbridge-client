import { env } from "@/env";

const API_BASE_URL = env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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
  
  studentProfile: StudentProfile;
  category: Category;
  availabilitySlot?: AvailabilitySlot;
  review?: Review;
  
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
  status?: BookingStatus | 'all';
  studentId?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
  search?: string;
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
  hasNext?: boolean;
  hasPrev?: boolean;
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

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  bookingId?: string;
}

export interface PendingCountResponse extends BaseResponse {
  data?: { count: number };
}

export interface NotificationsResponse extends BaseResponse {
  data?: NotificationItem[];
}

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

const buildUrl = (path: string): string => {
  const base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${base}/${cleanPath}`;
};

export const tutorBookingService = {
  getTutorBookings: async function (
    filters?: GetBookingsFilters
  ): Promise<GetBookingsResponse> {
    try {
      const headers = await getHeaders();
      
      const queryParams = new URLSearchParams();
      
      if (filters?.status && filters.status !== 'all') {
        queryParams.append('status', filters.status);
      }
      
      if (filters?.startDate) {
        queryParams.append('startDate', filters.startDate.toISOString());
      }
      
      if (filters?.endDate) {
        queryParams.append('endDate', filters.endDate.toISOString());
      }
      
      if (filters?.page) {
        queryParams.append('page', filters.page.toString());
      }
      
      if (filters?.limit) {
        queryParams.append('limit', filters.limit.toString());
      }
      
      if (filters?.search) {
        queryParams.append('search', filters.search);
      }
      
      const queryString = queryParams.toString();
      const endpoint = `tutors/bookings${queryString ? `?${queryString}` : ''}`;
      const fullUrl = buildUrl(endpoint);
      
      const res = await fetch(fullUrl, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        return {
          success: false,
          message: `API Error ${res.status}: ${res.statusText}`,
          data: [],
          pagination: {
            total: 0,
            page: filters?.page || 1,
            limit: filters?.limit || 10,
            totalPages: 0
          }
        };
      }
      
      const result = await res.json();
      
      return {
        success: true,
        message: result.message || "Bookings fetched successfully",
        data: result.data || [],
        pagination: result.pagination || {
          total: result.data?.length || 0,
          page: filters?.page || 1,
          limit: filters?.limit || 10,
          totalPages: Math.ceil((result.data?.length || 0) / (filters?.limit || 10))
        }
      };
      
    } catch {
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

  getPendingBookings: async function (
    page?: number,
    limit?: number
  ): Promise<GetBookingsResponse> {
    try {
      return await this.getTutorBookings({
        status: BookingStatus.PENDING,
        page,
        limit
      });
    } catch {
      return {
        success: false,
        message: "Failed to fetch pending bookings",
        data: [],
        pagination: {
          total: 0,
          page: page || 1,
          limit: limit || 10,
          totalPages: 0
        }
      };
    }
  },

  getPendingBookingsCount: async function (): Promise<PendingCountResponse> {
    try {
      const headers = await getHeaders();
      const endpoint = 'tutors/bookings/pending-count';
      const fullUrl = buildUrl(endpoint);
      
      const res = await fetch(fullUrl, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-store",
      });

      if (res.ok) {
        const result = await res.json();
        return {
          success: true,
          message: "Pending count fetched successfully",
          data: result.data || { count: 0 }
        };
      }
      
      return {
        success: true,
        message: "Pending count not available",
        data: { count: 0 }
      };
      
    } catch {
      return {
        success: false,
        message: "Failed to fetch pending count",
        data: { count: 0 }
      };
    }
  },

  updateMeetingLink: async function (
    bookingId: string,
    meetingLink: string
  ): Promise<BaseResponse & { data?: BookingWithUser }> {
    try {
      if (!bookingId) {
        return {
          success: false,
          message: "Booking ID is required",
          data: {} as BookingWithUser
        };
      }

      if (!meetingLink) {
        return {
          success: false,
          message: "Meeting link is required",
          data: {} as BookingWithUser
        };
      }

      const headers = await getHeaders();
      const endpoint = `tutors/bookings/${bookingId}/meeting-link`;
      const fullUrl = buildUrl(endpoint);
      
      const res = await fetch(fullUrl, {
        method: "PUT",
        headers,
        body: JSON.stringify({ meetingLink }),
        credentials: "include",
      });

      if (res.ok) {
        const result = await res.json();
        return {
          success: true,
          message: "Meeting link updated successfully",
          data: result.data || {} as BookingWithUser
        };
      }
      
      return {
        success: false,
        message: "Failed to update meeting link",
        data: {} as BookingWithUser
      };
      
    } catch {
      return {
        success: false,
        message: "Failed to update meeting link",
        data: {} as BookingWithUser
      };
    }
  },

  confirmBookingWithLink: async function (
    bookingId: string,
    meetingLink: string
  ): Promise<UpdateBookingStatusResponse> {
    try {
      if (!bookingId) {
        return {
          success: false,
          message: "Booking ID is required",
          data: {} as Booking & { studentUser: StudentUser }
        };
      }

      if (!meetingLink) {
        return {
          success: false,
          message: "Meeting link is required for confirmation",
          data: {} as Booking & { studentUser: StudentUser }
        };
      }

      const headers = await getHeaders();
      const endpoint = `tutors/bookings/${bookingId}/confirm`;
      const fullUrl = buildUrl(endpoint);
      
      const res = await fetch(fullUrl, {
        method: "PUT",
        headers,
        body: JSON.stringify({ meetingLink, status: BookingStatus.CONFIRMED }),
        credentials: "include",
      });

      if (res.ok) {
        const result = await res.json();
        return {
          success: true,
          message: "Booking confirmed successfully",
          data: result.data || {} as Booking & { studentUser: StudentUser }
        };
      }
      
      return {
        success: false,
        message: "Failed to confirm booking",
        data: {} as Booking & { studentUser: StudentUser }
      };
      
    } catch {
      return {
        success: false,
        message: "Failed to confirm booking",
        data: {} as Booking & { studentUser: StudentUser }
      };
    }
  },

  getTutorNotifications: async function (): Promise<NotificationsResponse> {
    try {
      const headers = await getHeaders();
      const endpoint = 'tutors/notifications';
      const fullUrl = buildUrl(endpoint);
      
      const res = await fetch(fullUrl, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-store",
      });

      if (res.ok) {
        const result = await res.json();
        return {
          success: true,
          message: "Notifications fetched successfully",
          data: result.data || []
        };
      }
      
      return {
        success: false,
        message: "Failed to fetch notifications",
        data: []
      };
      
    } catch {
      return {
        success: false,
        message: "Failed to fetch notifications",
        data: []
      };
    }
  },

  getBookingStats: async function (): Promise<GetBookingStatsResponse> {
    try {
      const headers = await getHeaders();
      const endpoint = 'tutors/bookings/stats';
      const fullUrl = buildUrl(endpoint);
      
      const res = await fetch(fullUrl, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-store",
      });

      if (res.ok) {
        const result = await res.json();
        return {
          success: true,
          message: "Booking statistics fetched successfully",
          data: result.data || getDefaultStats()
        };
      }
      
      return await this.calculateStatsFromBookings();
      
    } catch {
      return {
        success: true,
        message: "Default statistics loaded",
        data: getDefaultStats()
      };
    }
  },

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
      const endpoint = `tutors/bookings/${bookingId}`;
      const fullUrl = buildUrl(endpoint);
      
      const res = await fetch(fullUrl, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-store",
      });

      if (res.ok) {
        const result = await res.json();
        return {
          success: true,
          message: "Booking details fetched successfully",
          data: result.data || {} as BookingWithUser
        };
      }
      
      return {
        success: false,
        message: "Failed to fetch booking details",
        data: {} as BookingWithUser
      };
      
    } catch {
      return {
        success: false,
        message: "Failed to fetch booking details",
        data: {} as BookingWithUser
      };
    }
  },

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
      const endpoint = `tutors/bookings/${bookingId}/status`;
      const fullUrl = buildUrl(endpoint);
      
      const res = await fetch(fullUrl, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (res.ok) {
        const result = await res.json();
        return {
          success: true,
          message: "Booking status updated successfully",
          data: result.data || {} as Booking & { studentUser: StudentUser }
        };
      }
      
      return {
        success: false,
        message: "Failed to update booking status",
        data: {} as Booking & { studentUser: StudentUser }
      };
      
    } catch {
      return {
        success: false,
        message: "Failed to update booking status",
        data: {} as Booking & { studentUser: StudentUser }
      };
    }
  },

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
  },

  markNotificationAsRead: async function (
    notificationId: string
  ): Promise<BaseResponse> {
    try {
      if (!notificationId) {
        return {
          success: false,
          message: "Notification ID is required"
        };
      }

      const headers = await getHeaders();
      const endpoint = `tutors/notifications/${notificationId}/read`;
      const fullUrl = buildUrl(endpoint);
      
      const res = await fetch(fullUrl, {
        method: "PUT",
        headers,
        credentials: "include",
      });

      if (res.ok) {
        return {
          success: true,
          message: "Notification marked as read"
        };
      }
      
      return {
        success: false,
        message: "Failed to mark notification as read"
      };
      
    } catch {
      return {
        success: false,
        message: "Failed to mark notification as read"
      };
    }
  },

  markAllNotificationsAsRead: async function (): Promise<BaseResponse> {
    try {
      const headers = await getHeaders();
      const endpoint = 'tutors/notifications/mark-all-read';
      const fullUrl = buildUrl(endpoint);
      
      const res = await fetch(fullUrl, {
        method: "PUT",
        headers,
        credentials: "include",
      });

      if (res.ok) {
        return {
          success: true,
          message: "All notifications marked as read"
        };
      }
      
      return {
        success: false,
        message: "Failed to mark all notifications as read"
      };
      
    } catch {
      return {
        success: false,
        message: "Failed to mark all notifications as read"
      };
    }
  },

  testConnection: async function (): Promise<{success: boolean, message: string, url?: string}> {
    try {
      const testRes = await fetch(API_BASE_URL, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });
      
      if (testRes.ok) {
        return {
          success: true,
          message: "Connected to server successfully",
          url: API_BASE_URL
        };
      } else {
        return {
          success: false,
          message: `Server responded with ${testRes.status}`,
          url: API_BASE_URL
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: `Connection failed: ${error.message}`,
        url: API_BASE_URL
      };
    }
  }
};

export default tutorBookingService;