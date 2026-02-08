// services/student/student.service.ts
import { env } from "@/env";

const API_BASE_URL = env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ==================== TYPES ====================
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
  };
  booking: {
    id: string;
    bookingDate: string;
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

// ==================== AUTH HELPER ====================
const getAuthToken = async (): Promise<string | null> => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    const { authClient } = await import("@/lib/auth-client");
    const session = await authClient.getSession();
    return session?.data?.session?.token || null;
  } catch (error) {
    console.error("Failed to get auth token:", error);
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

// ==================== STUDENT PROFILE SERVICE ====================
export const studentProfileService = {
  // ✅ প্রোফাইল তৈরি
  createProfile: async function (): Promise<BaseResponse & { data?: StudentProfile }> {
    try {
      const headers = await getHeaders();
      console.log("🌐 POST /api/students/profile");
      
      const res = await fetch(`${API_BASE_URL}/students/profile`, {
        method: "POST",
        headers,
        credentials: "include",
      });

      const result = await res.json();
      console.log("🌐 Profile creation response:", result);

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to create profile"
        };
      }

      return result;
    } catch (error: any) {
      console.error("Create profile error:", error);
      return {
        success: false,
        message: error.message || "Failed to create profile"
      };
    }
  },

  // ✅ প্রোফাইল দেখা
  getProfile: async function (): Promise<BaseResponse & { data?: StudentProfile }> {
    try {
      const headers = await getHeaders();
      console.log("🌐 GET /api/students/profile");
      
      const res = await fetch(`${API_BASE_URL}/students/profile`, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      const result = await res.json();
      console.log("🌐 Profile response:", result);

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to fetch profile"
        };
      }

      return result;
    } catch (error: any) {
      console.error("Get profile error:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch profile"
      };
    }
  },

  // ✅ প্রোফাইল আপডেট (গ্রেড, বিষয়)
  updateProfile: async function (
    data: { grade?: string; subjects?: string[] }
  ): Promise<BaseResponse & { data?: StudentProfile }> {
    try {
      const headers = await getHeaders();
      console.log("🌐 PUT /api/students/profile", data);
      
      const res = await fetch(`${API_BASE_URL}/students/profile`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await res.json();
      console.log("🌐 Profile update response:", result);

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to update profile"
        };
      }

      return result;
    } catch (error: any) {
      console.error("Update profile error:", error);
      return {
        success: false,
        message: error.message || "Failed to update profile"
      };
    }
  }
};

// ==================== BOOKING SERVICE ====================
export const bookingService = {
  // ✅ টিউটর বুকিং করা
  createBooking: async function (data: CreateBookingInput): Promise<BaseResponse & { data?: Booking }> {
    try {
      const headers = await getHeaders();
      console.log("🌐 POST /api/students/bookings", data);
      
      const res = await fetch(`${API_BASE_URL}/students/bookings`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await res.json();
      console.log("🌐 Booking creation response:", result);

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to create booking"
        };
      }

      return result;
    } catch (error: any) {
      console.error("Create booking error:", error);
      return {
        success: false,
        message: error.message || "Failed to create booking"
      };
    }
  },

  // ✅ বুকিং দেখা (ফিল্টার ও পেজিনেশন সহ)
  getBookings: async function (
    filters?: BookingFilters
  ): Promise<PaginatedResponse<Booking>> {
    try {
      const headers = await getHeaders();
      
      // Build query string
      const queryParams = new URLSearchParams();
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.page) queryParams.append('page', filters.page.toString());
      if (filters?.limit) queryParams.append('limit', filters.limit.toString());
      
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/students/bookings${queryString ? `?${queryString}` : ''}`;
      
      console.log("🌐 GET", url);
      
      const res = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      const result = await res.json();
      console.log("🌐 Bookings response:", result);

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to fetch bookings",
          data: []
        };
      }

      return {
        success: true,
        message: result.message || "Bookings fetched successfully",
        data: result.data || [],
        pagination: result.pagination
      };
    } catch (error: any) {
      console.error("Get bookings error:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch bookings",
        data: []
      };
    }
  },

  // ✅ বুকিং ক্যানসেল করা
  cancelBooking: async function (bookingId: string): Promise<BaseResponse & { data?: Booking }> {
    try {
      const headers = await getHeaders();
      console.log("🌐 DELETE /api/students/bookings/" + bookingId);
      
      if (!bookingId) {
        return {
          success: false,
          message: "Booking ID is required"
        };
      }

      const res = await fetch(`${API_BASE_URL}/students/bookings/${bookingId}`, {
        method: "DELETE",
        headers,
        credentials: "include",
      });

      const result = await res.json();
      console.log("🌐 Booking cancellation response:", result);

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to cancel booking"
        };
      }

      return result;
    } catch (error: any) {
      console.error("Cancel booking error:", error);
      return {
        success: false,
        message: error.message || "Failed to cancel booking"
      };
    }
  },

  // ✅ সিঙ্গেল বুকিং দেখা
  getBookingById: async function (bookingId: string): Promise<BaseResponse & { data?: Booking }> {
    try {
      const headers = await getHeaders();
      console.log("🌐 GET /api/students/bookings/" + bookingId);
      
      if (!bookingId) {
        return {
          success: false,
          message: "Booking ID is required"
        };
      }

      const res = await fetch(`${API_BASE_URL}/students/bookings/${bookingId}`, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      const result = await res.json();
      console.log("🌐 Booking by ID response:", result);

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to fetch booking details"
        };
      }

      return result;
    } catch (error: any) {
      console.error("Get booking by ID error:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch booking details"
      };
    }
  }
};

// ==================== REVIEW SERVICE ====================
export const reviewService = {
  // ✅ রিভিউ তৈরি (শুধুমাত্র কমপ্লিটেড বুকিংয়ের জন্য)
  createReview: async function (
    bookingId: string,
    data: ReviewInput
  ): Promise<BaseResponse & { data?: Review }> {
    try {
      const headers = await getHeaders();
      console.log("🌐 POST /api/students/reviews for booking:", bookingId, data);
      
      // Assuming endpoint is /api/students/reviews
      const res = await fetch(`${API_BASE_URL}/students/reviews`, {
        method: "POST",
        headers,
        body: JSON.stringify({ bookingId, ...data }),
        credentials: "include",
      });

      const result = await res.json();
      console.log("🌐 Review creation response:", result);

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to create review"
        };
      }

      return result;
    } catch (error: any) {
      console.error("Create review error:", error);
      return {
        success: false,
        message: error.message || "Failed to create review"
      };
    }
  },

  // ✅ রিভিউ আপডেট
  updateReview: async function (
    reviewId: string,
    data: ReviewInput
  ): Promise<BaseResponse & { data?: Review }> {
    try {
      const headers = await getHeaders();
      console.log("🌐 PUT /api/students/reviews/" + reviewId, data);
      
      const res = await fetch(`${API_BASE_URL}/students/reviews/${reviewId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await res.json();
      console.log("🌐 Review update response:", result);

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to update review"
        };
      }

      return result;
    } catch (error: any) {
      console.error("Update review error:", error);
      return {
        success: false,
        message: error.message || "Failed to update review"
      };
    }
  },

  // ✅ স্টুডেন্টের সব রিভিউ দেখা
  getStudentReviews: async function (): Promise<BaseResponse & { data?: Review[] }> {
    try {
      const headers = await getHeaders();
      console.log("🌐 GET /api/students/reviews");
      
      const res = await fetch(`${API_BASE_URL}/students/reviews`, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      const result = await res.json();
      console.log("🌐 Student reviews response:", result);

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to fetch reviews",
          data: []
        };
      }

      return {
        success: true,
        message: result.message || "Reviews fetched successfully",
        data: result.data || []
      };
    } catch (error: any) {
      console.error("Get student reviews error:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch reviews",
        data: []
      };
    }
  },

  // ✅ রিভিউ ডিলিট
  deleteReview: async function (reviewId: string): Promise<BaseResponse> {
    try {
      const headers = await getHeaders();
      console.log("🌐 DELETE /api/students/reviews/" + reviewId);
      
      const res = await fetch(`${API_BASE_URL}/students/reviews/${reviewId}`, {
        method: "DELETE",
        headers,
        credentials: "include",
      });

      const result = await res.json();
      console.log("🌐 Review deletion response:", result);

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to delete review"
        };
      }

      return result;
    } catch (error: any) {
      console.error("Delete review error:", error);
      return {
        success: false,
        message: error.message || "Failed to delete review"
      };
    }
  }
};

// ==================== TUTOR DISCOVERY SERVICE ====================
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
      
      // Build query string
      const queryParams = new URLSearchParams();
      if (filters?.categoryId) queryParams.append('categoryId', filters.categoryId);
      if (filters?.minRate) queryParams.append('minRate', filters.minRate.toString());
      if (filters?.maxRate) queryParams.append('maxRate', filters.maxRate.toString());
      if (filters?.minRating) queryParams.append('minRating', filters.minRating.toString());
      if (filters?.page) queryParams.append('page', filters.page.toString());
      if (filters?.limit) queryParams.append('limit', filters.limit.toString());
      
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/tutors/public${queryString ? `?${queryString}` : ''}`;
      
      console.log("🌐 GET", url);
      
      const res = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      const result = await res.json();
      console.log("🌐 Tutors search response:", result);

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to search tutors",
          data: []
        };
      }

      return {
        success: true,
        message: result.message || "Tutors fetched successfully",
        data: result.data || [],
        pagination: result.pagination
      };
    } catch (error: any) {
      console.error("Search tutors error:", error);
      return {
        success: false,
        message: error.message || "Failed to search tutors",
        data: []
      };
    }
  },

   
  getTutorById: async function (tutorId: string): Promise<BaseResponse & { data?: TutorProfile }> {
    try {
      const headers = await getHeaders();
      console.log("🌐 GET /api/tutors/public/" + tutorId);
      
      const res = await fetch(`${API_BASE_URL}/tutors/public/${tutorId}`, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      const result = await res.json();
      console.log("🌐 Tutor by ID response:", result);

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to fetch tutor details"
        };
      }

      return result;
    } catch (error: any) {
      console.error("Get tutor by ID error:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch tutor details"
      };
    }
  },

  // ✅ টিউটরের এভেইলেবিলিটি স্লট দেখা
  getTutorAvailability: async function (tutorId: string): Promise<BaseResponse & { data?: AvailabilitySlot[] }> {
    try {
      const headers = await getHeaders();
      console.log("🌐 GET /api/tutors/public/" + tutorId + "/availability");
      
      const res = await fetch(`${API_BASE_URL}/tutors/public/${tutorId}/availability`, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      const result = await res.json();
      console.log("🌐 Tutor availability response:", result);

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to fetch tutor availability",
          data: []
        };
      }

      return {
        success: true,
        message: result.message || "Availability fetched successfully",
        data: result.data || []
      };
    } catch (error: any) {
      console.error("Get tutor availability error:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch tutor availability",
        data: []
      };
    }
  }
};

// ==================== CATEGORY SERVICE ====================
export const categoryService = {
  // ✅ সব ক্যাটাগরি দেখা
  getAllCategories: async function (): Promise<BaseResponse & { data?: Category[] }> {
    try {
      const headers = await getHeaders();
      console.log("🌐 GET /api/categories");
      
      const res = await fetch(`${API_BASE_URL}/categories`, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      const result = await res.json();
      console.log("🌐 Categories response:", result);

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to fetch categories",
          data: []
        };
      }

      return {
        success: true,
        message: result.message || "Categories fetched successfully",
        data: result.data || []
      };
    } catch (error: any) {
      console.error("Get categories error:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch categories",
        data: []
      };
    }
  }
};

// ==================== MAIN EXPORT ====================
export const studentService = {
  profile: studentProfileService,
  bookings: bookingService,
  reviews: reviewService,
  discovery: tutorDiscoveryService,
  categories: categoryService,
};

export default studentService;