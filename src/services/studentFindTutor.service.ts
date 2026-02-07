// services/studentFindTutor.service.ts
import { env } from "@/env";

const API_BASE_URL = env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ==================== TYPES ====================
interface BaseResponse {
  success: boolean;
  message: string;
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
  education?: string;
  certifications?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  statistics?: {
    totalStudents: number;
    totalSessions: number;
    availableSlots: number;
    completedSessions: number;
  };
  reviews?: Array<{
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    student: {
      id: string;
      name: string;
      image?: string;
      grade?: string;
    };
  }>;
}

interface AvailabilitySlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  isRecurring?: boolean;
  recurringPattern?: string;
}

interface TutorAvailabilityResponse {
  tutorId: string;
  tutorName: string;
  startDate: Date;
  endDate: Date;
  totalAvailableSlots: number;
  availability: Array<{
    date: string;
    slots: AvailabilitySlot[];
  }>;
  slotsByDate: Record<string, AvailabilitySlot[]>;
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

interface ReviewInput {
  rating: number;
  comment?: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface PaginatedResponse<T> extends BaseResponse {
  data: T[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface BrowseTutorsResponse {
  tutors: TutorProfile[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: {
    search?: string;
    category?: string;
    minRating?: number;
    maxHourlyRate?: number;
    experienceYears?: number;
    sortBy: string;
    sortOrder: string;
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

// ==================== TUTOR DISCOVERY SERVICE ====================
export const tutorDiscoveryService = {
  /**
   * Browse and search tutors with filters and pagination
   */
  browseTutors: async (
    filters?: {
      page?: number;
      limit?: number;
      search?: string;
      category?: string;
      minRating?: number;
      maxHourlyRate?: number;
      experienceYears?: number;
      sortBy?: 'rating' | 'hourlyRate' | 'experienceYears' | 'totalReviews';
      sortOrder?: 'asc' | 'desc';
    }
  ): Promise<BaseResponse & { data?: BrowseTutorsResponse }> => {
    try {
      const headers = await getHeaders();
      
      const queryParams = new URLSearchParams();
      if (filters?.page) queryParams.append('page', filters.page.toString());
      if (filters?.limit) queryParams.append('limit', filters.limit.toString());
      if (filters?.search) queryParams.append('search', filters.search);
      if (filters?.category) queryParams.append('category', filters.category);
      if (filters?.minRating) queryParams.append('minRating', filters.minRating.toString());
      if (filters?.maxHourlyRate) queryParams.append('maxHourlyRate', filters.maxHourlyRate.toString());
      if (filters?.experienceYears) queryParams.append('experienceYears', filters.experienceYears.toString());
      if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters?.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
      
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
      console.log("🌐 Browse tutors response:", result);

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to browse tutors"
        };
      }

      return result;
    } catch (error: any) {
      console.error("Browse tutors error:", error);
      return {
        success: false,
        message: error.message || "Failed to browse tutors"
      };
    }
  },

  /**
   * Get specific tutor profile by ID
   */
  getTutorProfile: async (tutorId: string): Promise<BaseResponse & { data?: TutorProfile }> => {
    try {
      const headers = await getHeaders();
      
      if (!tutorId) {
        return {
          success: false,
          message: "Tutor ID is required"
        };
      }
      
      const url = `${API_BASE_URL}/tutors/public/${tutorId}`;
      console.log("🌐 GET", url);
      
      const res = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      const result = await res.json();
      console.log("🌐 Tutor profile response:", result);

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to fetch tutor profile"
        };
      }

      return result;
    } catch (error: any) {
      console.error("Get tutor profile error:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch tutor profile"
      };
    }
  },

  /**
   * Get tutor availability for specific date range
   */
  getTutorAvailability: async (
    tutorId: string,
    filters?: {
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<BaseResponse & { data?: TutorAvailabilityResponse }> => {
    try {
      const headers = await getHeaders();
      
      if (!tutorId) {
        return {
          success: false,
          message: "Tutor ID is required"
        };
      }
      
      const queryParams = new URLSearchParams();
      if (filters?.startDate) queryParams.append('startDate', filters.startDate.toISOString());
      if (filters?.endDate) queryParams.append('endDate', filters.endDate.toISOString());
      
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/tutors/public/${tutorId}/availability${queryString ? `?${queryString}` : ''}`;
      
      console.log("🌐 GET", url);
      
      const res = await fetch(url, {
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
          message: result.message || "Failed to fetch tutor availability"
        };
      }

      return result;
    } catch (error: any) {
      console.error("Get tutor availability error:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch tutor availability"
      };
    }
  }
};

// ==================== BOOKING SERVICE ====================
export const bookingService = {
  /**
   * Create a new booking with a tutor
   */
  createBooking: async (data: CreateBookingInput): Promise<BaseResponse & { data?: Booking }> => {
    try {
      const headers = await getHeaders();
      
      if (!data.tutorProfileId || !data.availabilitySlotId || !data.categoryId) {
        return {
          success: false,
          message: "Tutor ID, availability slot ID, and category ID are required"
        };
      }
      
      const url = `${API_BASE_URL}/students/bookings`;
      console.log("🌐 POST", url, data);
      
      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await res.json();
      console.log("🌐 Create booking response:", result);

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

  /**
   * Get bookings with optional filters and pagination
   */
  getBookings: async (filters?: BookingFilters): Promise<PaginatedResponse<Booking>> => {
    try {
      const headers = await getHeaders();
      
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
      console.log("🌐 Get bookings response:", result);

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to fetch bookings",
          data: []
        };
      }

      return {
        success: true,
        message: "Bookings fetched successfully",
        data: result.data?.bookings || result.data || [],
        pagination: result.data?.pagination || result.pagination
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

  /**
   * Get specific booking by ID
   */
  getBookingById: async (bookingId: string): Promise<BaseResponse & { data?: Booking }> => {
    try {
      const headers = await getHeaders();
      
      if (!bookingId) {
        return {
          success: false,
          message: "Booking ID is required"
        };
      }
      
      const url = `${API_BASE_URL}/students/bookings/${bookingId}`;
      console.log("🌐 GET", url);
      
      const res = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      const result = await res.json();
      console.log("🌐 Get booking by ID response:", result);

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
  },

  /**
   * Cancel a booking
   */
  cancelBooking: async (bookingId: string): Promise<BaseResponse & { data?: Booking }> => {
    try {
      const headers = await getHeaders();
      
      if (!bookingId) {
        return {
          success: false,
          message: "Booking ID is required"
        };
      }
      
      const url = `${API_BASE_URL}/students/bookings/${bookingId}`;
      console.log("🌐 DELETE", url);
      
      const res = await fetch(url, {
        method: "DELETE",
        headers,
        credentials: "include",
      });

      const result = await res.json();
      console.log("🌐 Cancel booking response:", result);

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
  }
};

// ==================== REVIEW SERVICE ====================
export const reviewService = {
  /**
   * Create a review for a completed booking
   */
  createReview: async (
    bookingId: string,
    data: ReviewInput
  ): Promise<BaseResponse & { data?: Review }> => {
    try {
      const headers = await getHeaders();
      
      if (!bookingId) {
        return {
          success: false,
          message: "Booking ID is required"
        };
      }
      
      if (!data.rating || data.rating < 1 || data.rating > 5) {
        return {
          success: false,
          message: "Rating must be between 1 and 5"
        };
      }
      
      // ✅ UPDATED: Changed from /students/reviews to /student/reviews
      const url = `${API_BASE_URL}/student/reviews`;
      console.log("🌐 POST", url, { bookingId, ...data });
      
      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({ bookingId, ...data }),
        credentials: "include",
      });

      const result = await res.json();
      console.log("🌐 Create review response:", result);

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

  /**
   * Update a review
   */
  updateReview: async (
    reviewId: string,
    data: ReviewInput
  ): Promise<BaseResponse & { data?: Review }> => {
    try {
      const headers = await getHeaders();
      
      if (!reviewId) {
        return {
          success: false,
          message: "Review ID is required"
        };
      }
      
      if (data.rating && (data.rating < 1 || data.rating > 5)) {
        return {
          success: false,
          message: "Rating must be between 1 and 5"
        };
      }
      
      // ✅ UPDATED: Changed from /students/reviews/:id to /student/reviews/:id
      const url = `${API_BASE_URL}/student/reviews/${reviewId}`;
      console.log("🌐 PUT", url, data);
      
      const res = await fetch(url, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await res.json();
      console.log("🌐 Update review response:", result);

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

  /**
   * Delete a review
   */
  deleteReview: async (reviewId: string): Promise<BaseResponse> => {
    try {
      const headers = await getHeaders();
      
      if (!reviewId) {
        return {
          success: false,
          message: "Review ID is required"
        };
      }
      
      // ✅ UPDATED: Changed from /students/reviews/:id to /student/reviews/:id
      const url = `${API_BASE_URL}/student/reviews/${reviewId}`;
      console.log("🌐 DELETE", url);
      
      const res = await fetch(url, {
        method: "DELETE",
        headers,
        credentials: "include",
      });

      const result = await res.json();
      console.log("🌐 Delete review response:", result);

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
  },

  /**
   * Get all reviews by the current student
   */
  getStudentReviews: async (filters?: {
    page?: number;
    limit?: number;
    sortBy?: 'newest' | 'oldest' | 'highest' | 'lowest';
    tutorId?: string;
  }): Promise<BaseResponse & { 
    data?: {
      reviews: Review[];
      statistics: {
        totalReviews: number;
        averageRating: number;
      };
    };
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> => {
    try {
      const headers = await getHeaders();
      
      // Build query string
      const queryParams = new URLSearchParams();
      if (filters?.page) queryParams.append('page', filters.page.toString());
      if (filters?.limit) queryParams.append('limit', filters.limit.toString());
      if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters?.tutorId) queryParams.append('tutorId', filters.tutorId);
      
      const queryString = queryParams.toString();
      
      // ✅ UPDATED: Changed from /students/reviews to /student/reviews
      const url = `${API_BASE_URL}/student/reviews${queryString ? `?${queryString}` : ''}`;
      console.log("🌐 GET", url);
      
      const res = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      const result = await res.json();
      console.log("🌐 Get student reviews response:", result);

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to fetch reviews",
          data: {
            reviews: [],
            statistics: { totalReviews: 0, averageRating: 0 }
          }
        };
      }

      return result;
    } catch (error: any) {
      console.error("Get student reviews error:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch reviews",
        data: {
          reviews: [],
          statistics: { totalReviews: 0, averageRating: 0 }
        }
      };
    }
  },

  /**
   * Get single review by ID
   */
  getReviewById: async (reviewId: string): Promise<BaseResponse & { data?: Review }> => {
    try {
      const headers = await getHeaders();
      
      if (!reviewId) {
        return {
          success: false,
          message: "Review ID is required"
        };
      }
      
      // ✅ UPDATED: Changed from /students/reviews/:id to /student/reviews/:id
      const url = `${API_BASE_URL}/student/reviews/${reviewId}`;
      console.log("🌐 GET", url);
      
      const res = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      const result = await res.json();
      console.log("🌐 Get review by ID response:", result);

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to fetch review"
        };
      }

      return result;
    } catch (error: any) {
      console.error("Get review by ID error:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch review"
      };
    }
  }
};

// ==================== CATEGORY SERVICE ====================
export const categoryService = {
  /**
   * Get all available tutoring categories
   */
  getAllCategories: async (): Promise<BaseResponse & { data?: Category[] }> => {
    try {
      const headers = await getHeaders();
      
      // ✅ UPDATED: Changed from /categories to /student/categories
      const url = `${API_BASE_URL}/student/categories`;
      console.log("🌐 GET", url);
      
      const res = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      const result = await res.json();
      console.log("🌐 Get categories response:", result);

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to fetch categories",
          data: []
        };
      }

      return {
        success: true,
        message: "Categories fetched successfully",
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
  },

  /**
   * Get category by ID
   */
  getCategoryById: async (categoryId: string): Promise<BaseResponse & { data?: Category & { tutorCount: number; bookingCount: number } }> => {
    try {
      const headers = await getHeaders();
      
      if (!categoryId) {
        return {
          success: false,
          message: "Category ID is required"
        };
      }
      
      // ✅ UPDATED: Changed from /categories/:id to /student/categories/:id
      const url = `${API_BASE_URL}/student/categories/${categoryId}`;
      console.log("🌐 GET", url);
      
      const res = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      const result = await res.json();
      console.log("🌐 Get category by ID response:", result);

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to fetch category"
        };
      }

      return result;
    } catch (error: any) {
      console.error("Get category by ID error:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch category"
      };
    }
  },

  /**
   * Get tutors by category
   */
  getTutorsByCategory: async (
    categoryId: string,
    filters?: {
      page?: number;
      limit?: number;
      minRating?: number;
      maxHourlyRate?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }
  ): Promise<BaseResponse & { 
    data?: {
      category: Category;
      tutors: TutorProfile[];
      statistics: {
        totalTutors: number;
        averageRating: number;
        averageHourlyRate: number;
      };
    };
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> => {
    try {
      const headers = await getHeaders();
      
      if (!categoryId) {
        return {
          success: false,
          message: "Category ID is required"
        };
      }
      
      // Build query string
      const queryParams = new URLSearchParams();
      if (filters?.page) queryParams.append('page', filters.page.toString());
      if (filters?.limit) queryParams.append('limit', filters.limit.toString());
      if (filters?.minRating) queryParams.append('minRating', filters.minRating.toString());
      if (filters?.maxHourlyRate) queryParams.append('maxHourlyRate', filters.maxHourlyRate.toString());
      if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters?.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
      
      const queryString = queryParams.toString();
      
      // ✅ UPDATED: Changed from /categories/:id/tutors to /student/categories/:id/tutors
      const url = `${API_BASE_URL}/student/categories/${categoryId}/tutors${queryString ? `?${queryString}` : ''}`;
      console.log("🌐 GET", url);
      
      const res = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      const result = await res.json();
      console.log("🌐 Get tutors by category response:", result);

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to fetch tutors by category",
          data: {
            category: {} as Category,
            tutors: [],
            statistics: {
              totalTutors: 0,
              averageRating: 0,
              averageHourlyRate: 0
            }
          }
        };
      }

      return result;
    } catch (error: any) {
      console.error("Get tutors by category error:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch tutors by category",
        data: {
          category: {} as Category,
          tutors: [],
          statistics: {
            totalTutors: 0,
            averageRating: 0,
            averageHourlyRate: 0
          }
        }
      };
    }
  }
};

// ==================== MAIN EXPORT ====================
export const studentFindTutorService = {
  tutor: tutorDiscoveryService,
  booking: bookingService,
  review: reviewService,
  category: categoryService,
};

export default studentFindTutorService;