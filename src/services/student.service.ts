import { env } from "@/env";

const API_BASE_URL = env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface BaseResponse {
  success: boolean;
  message: string;
}

interface StudentProfile {
  id: string;
  userId: string;
  grade?: string;
  subjects: string[];
  createdAt: string;
  updatedAt: string;
}

interface AvailabilitySlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  tutorProfile: {
    id: string;
    headline: string;
    hourlyRate: number;
  };
}

interface Booking {
  id: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
  amount: number;
  isPaid: boolean;
  meetingLink?: string;
  notes?: string;
  tutorProfile: {
    id: string;
    userId: string;
    headline: string;
    hourlyRate: number;
    rating: number;
    user?: {
      name: string;
      image?: string;
      email?: string;
    };
  };
  category: {
    id: string;
    name: string;
  };
  availabilitySlot?: {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
  };
  review?: {
    id: string;
    rating: number;
    comment: string;
  };
}

interface CreateBookingInput {
  tutorProfileId: string;
  availabilitySlotId: string;
  categoryId: string;
  notes?: string;
}

interface BookingFilters {
  status?: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
  page?: number;
  limit?: number;
}

interface ReviewInput {
  rating: number;
  comment?: string;
}

interface Review {
  id: string;
  rating: number;
  comment?: string;
  isVerified: boolean;
  createdAt: string;
  tutorProfile: {
    id: string;
    headline: string;
    user?: {
      name: string;
      image?: string;
      email?: string;
    };
  };
  booking: {
    id: string;
    bookingDate: string;
    category?: {
      id: string;
      name: string;
    };
  };
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface TutorProfile {
  id: string;
  userId: string;
  headline: string;
  bio?: string;
  hourlyRate: number;
  rating: number;
  experienceYears?: number;
  completedSessions?: number;
  totalReviews?: number;
  categories: Array<{
    id: string;
    name: string;
  }>;
  user?: {
    name: string;
    image?: string;
    email?: string;
  };
  availabilitySlots?: Array<{
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
  }>;
  education?: string;
  certifications?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

interface PaginatedResponse<T> extends BaseResponse {
  data: T[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
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

export const studentProfileService = {
  createProfile: async function (): Promise<BaseResponse & { data?: StudentProfile }> {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_BASE_URL}/students/profile`, {
        method: "POST",
        headers,
        credentials: "include",
      });
      const result = await res.json();
      if (!res.ok) {
        return { success: false, message: result.message || "Failed to create profile" };
      }
      return result;
    } catch {
      return { success: false, message: "Failed to create profile" };
    }
  },

  getProfile: async function (): Promise<BaseResponse & { data?: StudentProfile }> {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_BASE_URL}/students/profile`, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });
      const result = await res.json();
      if (!res.ok) {
        return { success: false, message: result.message || "Failed to fetch profile" };
      }
      return result;
    } catch {
      return { success: false, message: "Failed to fetch profile" };
    }
  },

  updateProfile: async function (
    data: { grade?: string; subjects?: string[] }
  ): Promise<BaseResponse & { data?: StudentProfile }> {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_BASE_URL}/students/profile`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
      });
      const result = await res.json();
      if (!res.ok) {
        return { success: false, message: result.message || "Failed to update profile" };
      }
      return result;
    } catch {
      return { success: false, message: "Failed to update profile" };
    }
  }
};

export const bookingService = {
  createBooking: async function (data: CreateBookingInput): Promise<BaseResponse & { data?: Booking }> {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_BASE_URL}/students/bookings`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
      });
      const result = await res.json();
      if (!res.ok) {
        return { success: false, message: result.message || "Failed to create booking" };
      }
      return result;
    } catch {
      return { success: false, message: "Failed to create booking" };
    }
  },

  getBookings: async function (
    filters?: BookingFilters
  ): Promise<PaginatedResponse<Booking>> {
    try {
      const headers = await getHeaders();
      const queryParams = new URLSearchParams();
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.page) queryParams.append('page', filters.page.toString());
      if (filters?.limit) queryParams.append('limit', filters.limit.toString());
      
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/students/bookings${queryString ? `?${queryString}` : ''}`;
      
      const res = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });
      const result = await res.json();
      if (!res.ok) {
        return { success: false, message: result.message || "Failed to fetch bookings", data: [] };
      }
      return {
        success: true,
        message: result.message || "Bookings fetched successfully",
        data: result.data || [],
        pagination: result.pagination
      };
    } catch {
      return { success: false, message: "Failed to fetch bookings", data: [] };
    }
  },

  cancelBooking: async function (bookingId: string): Promise<BaseResponse & { data?: Booking }> {
    try {
      const headers = await getHeaders();
      if (!bookingId) {
        return { success: false, message: "Booking ID is required" };
      }
      const res = await fetch(`${API_BASE_URL}/students/bookings/${bookingId}`, {
        method: "DELETE",
        headers,
        credentials: "include",
      });
      const result = await res.json();
      if (!res.ok) {
        return { success: false, message: result.message || "Failed to cancel booking" };
      }
      return result;
    } catch {
      return { success: false, message: "Failed to cancel booking" };
    }
  },

  getBookingById: async function (bookingId: string): Promise<BaseResponse & { data?: Booking }> {
    try {
      const headers = await getHeaders();
      if (!bookingId) {
        return { success: false, message: "Booking ID is required" };
      }
      const res = await fetch(`${API_BASE_URL}/students/bookings/${bookingId}`, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });
      const result = await res.json();
      if (!res.ok) {
        return { success: false, message: result.message || "Failed to fetch booking details" };
      }
      return result;
    } catch {
      return { success: false, message: "Failed to fetch booking details" };
    }
  }
};

export const reviewService = {
  createReview: async function (
    bookingId: string,
    data: ReviewInput
  ): Promise<BaseResponse & { data?: Review }> {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_BASE_URL}/students/reviews`, {
        method: "POST",
        headers,
        body: JSON.stringify({ bookingId, ...data }),
        credentials: "include",
      });
      const result = await res.json();
      if (!res.ok) {
        return { success: false, message: result.message || "Failed to create review" };
      }
      return result;
    } catch {
      return { success: false, message: "Failed to create review" };
    }
  },

  updateReview: async function (
    reviewId: string,
    data: ReviewInput
  ): Promise<BaseResponse & { data?: Review }> {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_BASE_URL}/students/reviews/${reviewId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
      });
      const result = await res.json();
      if (!res.ok) {
        return { success: false, message: result.message || "Failed to update review" };
      }
      return result;
    } catch {
      return { success: false, message: "Failed to update review" };
    }
  },

  getStudentReviews: async function (): Promise<BaseResponse & { data?: Review[] }> {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_BASE_URL}/students/reviews`, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });
      const result = await res.json();
      if (!res.ok) {
        return { success: false, message: result.message || "Failed to fetch reviews", data: [] };
      }
      return {
        success: true,
        message: result.message || "Reviews fetched successfully",
        data: result.data || []
      };
    } catch {
      return { success: false, message: "Failed to fetch reviews", data: [] };
    }
  },

  deleteReview: async function (reviewId: string): Promise<BaseResponse> {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_BASE_URL}/students/reviews/${reviewId}`, {
        method: "DELETE",
        headers,
        credentials: "include",
      });
      const result = await res.json();
      if (!res.ok) {
        return { success: false, message: result.message || "Failed to delete review" };
      }
      return result;
    } catch {
      return { success: false, message: "Failed to delete review" };
    }
  }
};

export const tutorDiscoveryService = {
  searchTutors: async function (filters?: {
    categoryId?: string;
    minRate?: number;
    maxRate?: number;
    minRating?: number;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<TutorProfile>> {
    try {
      const headers = await getHeaders();
      const queryParams = new URLSearchParams();
      if (filters?.categoryId) queryParams.append('categoryId', filters.categoryId);
      if (filters?.minRate) queryParams.append('minRate', filters.minRate.toString());
      if (filters?.maxRate) queryParams.append('maxRate', filters.maxRate.toString());
      if (filters?.minRating) queryParams.append('minRating', filters.minRating.toString());
      if (filters?.page) queryParams.append('page', filters.page.toString());
      if (filters?.limit) queryParams.append('limit', filters.limit.toString());
      
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/tutors/public${queryString ? `?${queryString}` : ''}`;
      
      const res = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });
      const result = await res.json();
      if (!res.ok) {
        return { success: false, message: result.message || "Failed to search tutors", data: [] };
      }
      return {
        success: true,
        message: result.message || "Tutors fetched successfully",
        data: result.data || [],
        pagination: result.pagination
      };
    } catch {
      return { success: false, message: "Failed to search tutors", data: [] };
    }
  },

  getTutorById: async function (tutorId: string): Promise<BaseResponse & { data?: TutorProfile }> {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_BASE_URL}/tutors/public/${tutorId}`, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });
      const result = await res.json();
      if (!res.ok) {
        return { success: false, message: result.message || "Failed to fetch tutor details" };
      }
      return result;
    } catch {
      return { success: false, message: "Failed to fetch tutor details" };
    }
  },

  getTutorAvailability: async function (tutorId: string): Promise<BaseResponse & { data?: AvailabilitySlot[] }> {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_BASE_URL}/tutors/public/${tutorId}/availability`, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });
      const result = await res.json();
      if (!res.ok) {
        return { success: false, message: result.message || "Failed to fetch tutor availability", data: [] };
      }
      return {
        success: true,
        message: result.message || "Availability fetched successfully",
        data: result.data || []
      };
    } catch {
      return { success: false, message: "Failed to fetch tutor availability", data: [] };
    }
  }
};

export const categoryService = {
  getAllCategories: async function (): Promise<BaseResponse & { data?: Category[] }> {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_BASE_URL}/categories`, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });
      const result = await res.json();
      if (!res.ok) {
        return { success: false, message: result.message || "Failed to fetch categories", data: [] };
      }
      return {
        success: true,
        message: result.message || "Categories fetched successfully",
        data: result.data || []
      };
    } catch {
      return { success: false, message: "Failed to fetch categories", data: [] };
    }
  },

  getTutorsByCategory: async function (categoryId: string): Promise<BaseResponse & { data?: { tutors: TutorProfile[], category: Category } }> {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_BASE_URL}/categories/${categoryId}/tutors`, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });
      const result = await res.json();
      if (!res.ok) {
        return { success: false, message: result.message || "Failed to fetch tutors by category", data: { tutors: [], category: {} as Category } };
      }
      return {
        success: true,
        message: result.message || "Tutors fetched successfully",
        data: result.data || { tutors: [], category: {} }
      };
    } catch {
      return { success: false, message: "Failed to fetch tutors by category", data: { tutors: [], category: {} as Category } };
    }
  }
};

export const studentService = {
  profile: studentProfileService,
  bookings: bookingService,
  reviews: reviewService,
  discovery: tutorDiscoveryService,
  categories: categoryService,
};

export default studentService;