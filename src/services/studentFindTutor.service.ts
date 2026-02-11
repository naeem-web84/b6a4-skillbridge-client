import { env } from "@/env";

const API_BASE_URL = env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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

export interface StudentBooking {
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
  createdAt?: string;
  updatedAt?: string;
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

export const tutorDiscoveryService = {
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
      
      const res = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      const result = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to browse tutors"
        };
      }

      return result;
    } catch {
      return {
        success: false,
        message: "Failed to browse tutors"
      };
    }
  },

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
      
      const res = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      const result = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to fetch tutor profile"
        };
      }

      return result;
    } catch {
      return {
        success: false,
        message: "Failed to fetch tutor profile"
      };
    }
  },

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
      
      const res = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      const result = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to fetch tutor availability"
        };
      }

      return result;
    } catch {
      return {
        success: false,
        message: "Failed to fetch tutor availability"
      };
    }
  }
};

export const bookingService = {
  createBooking: async (data: CreateBookingInput): Promise<BaseResponse & { data?: StudentBooking }> => {
    try {
      const headers = await getHeaders();
      
      if (!data.tutorProfileId || !data.availabilitySlotId || !data.categoryId) {
        return {
          success: false,
          message: "Tutor ID, availability slot ID, and category ID are required"
        };
      }
      
      const url = `${API_BASE_URL}/students/bookings`;
      
      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to create booking"
        };
      }

      return result;
    } catch {
      return {
        success: false,
        message: "Failed to create booking"
      };
    }
  },

  getBookings: async (filters?: BookingFilters): Promise<PaginatedResponse<StudentBooking>> => {
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
    } catch {
      return {
        success: false,
        message: "Failed to fetch bookings",
        data: []
      };
    }
  },

  getStudentBookingById: async (bookingId: string): Promise<BaseResponse & { data?: StudentBooking }> => {
    try {
      const headers = await getHeaders();
      
      if (!bookingId) {
        return {
          success: false,
          message: "Booking ID is required"
        };
      }
      
      const url = `${API_BASE_URL}/student/bookings/${bookingId}`;
      
      const res = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      const result = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to fetch booking details"
        };
      }

      return result;
    } catch {
      return {
        success: false,
        message: "Failed to fetch booking details"
      };
    }
  },

  getUpcomingBookings: async (): Promise<BaseResponse & { data?: StudentBooking[] }> => {
    try {
      const headers = await getHeaders();
      
      const url = `${API_BASE_URL}/students/bookings/upcoming`;
      
      const res = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      const result = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to fetch upcoming bookings",
          data: []
        };
      }

      return result;
    } catch {
      return {
        success: false,
        message: "Failed to fetch upcoming bookings",
        data: []
      };
    }
  },

  getBookingStatistics: async (): Promise<BaseResponse & { 
    data?: {
      totalBookings: number;
      pendingBookings: number;
      confirmedBookings: number;
      completedBookings: number;
      cancelledBookings: number;
      totalSpent: number;
    } 
  }> => {
    try {
      const headers = await getHeaders();
      
      const url = `${API_BASE_URL}/students/bookings/statistics`;
      
      const res = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      const result = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to fetch booking statistics",
          data: {
            totalBookings: 0,
            pendingBookings: 0,
            confirmedBookings: 0,
            completedBookings: 0,
            cancelledBookings: 0,
            totalSpent: 0
          }
        };
      }

      return result;
    } catch {
      return {
        success: false,
        message: "Failed to fetch booking statistics",
        data: {
          totalBookings: 0,
          pendingBookings: 0,
          confirmedBookings: 0,
          completedBookings: 0,
          cancelledBookings: 0,
          totalSpent: 0
        }
      };
    }
  },

  cancelBooking: async (bookingId: string): Promise<BaseResponse & { data?: StudentBooking }> => {
    try {
      const headers = await getHeaders();
      
      if (!bookingId) {
        return {
          success: false,
          message: "Booking ID is required"
        };
      }
      
      const url = `${API_BASE_URL}/students/bookings/${bookingId}`;
      
      const res = await fetch(url, {
        method: "DELETE",
        headers,
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to cancel booking"
        };
      }

      return result;
    } catch {
      return {
        success: false,
        message: "Failed to cancel booking"
      };
    }
  }
};

export const reviewService = {
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
      
      const url = `${API_BASE_URL}/student/reviews`;
      
      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({ bookingId, ...data }),
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to create review"
        };
      }

      return result;
    } catch {
      return {
        success: false,
        message: "Failed to create review"
      };
    }
  },

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
      
      const url = `${API_BASE_URL}/student/reviews/${reviewId}`;
      
      const res = await fetch(url, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to update review"
        };
      }

      return result;
    } catch {
      return {
        success: false,
        message: "Failed to update review"
      };
    }
  },

  deleteReview: async (reviewId: string): Promise<BaseResponse> => {
    try {
      const headers = await getHeaders();
      
      if (!reviewId) {
        return {
          success: false,
          message: "Review ID is required"
        };
      }
      
      const url = `${API_BASE_URL}/student/reviews/${reviewId}`;
      
      const res = await fetch(url, {
        method: "DELETE",
        headers,
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to delete review"
        };
      }

      return result;
    } catch {
      return {
        success: false,
        message: "Failed to delete review"
      };
    }
  },

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
      
      const queryParams = new URLSearchParams();
      if (filters?.page) queryParams.append('page', filters.page.toString());
      if (filters?.limit) queryParams.append('limit', filters.limit.toString());
      if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters?.tutorId) queryParams.append('tutorId', filters.tutorId);
      
      const queryString = queryParams.toString();
      
      const url = `${API_BASE_URL}/student/reviews${queryString ? `?${queryString}` : ''}`;
      
      const res = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      const result = await res.json();

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
    } catch {
      return {
        success: false,
        message: "Failed to fetch reviews",
        data: {
          reviews: [],
          statistics: { totalReviews: 0, averageRating: 0 }
        }
      };
    }
  },

  getReviewById: async (reviewId: string): Promise<BaseResponse & { data?: Review }> => {
    try {
      const headers = await getHeaders();
      
      if (!reviewId) {
        return {
          success: false,
          message: "Review ID is required"
        };
      }
      
      const url = `${API_BASE_URL}/student/reviews/${reviewId}`;
      
      const res = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      const result = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to fetch review"
        };
      }

      return result;
    } catch {
      return {
        success: false,
        message: "Failed to fetch review"
      };
    }
  }
};

export const categoryService = {
  getAllCategories: async (): Promise<BaseResponse & { data?: Category[] }> => {
    try {
      const headers = await getHeaders();
      
      const url = `${API_BASE_URL}/student/categories`;
      
      const res = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      const result = await res.json();

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
    } catch {
      return {
        success: false,
        message: "Failed to fetch categories",
        data: []
      };
    }
  },

  getCategoryById: async (categoryId: string): Promise<BaseResponse & { data?: Category & { tutorCount: number; bookingCount: number } }> => {
    try {
      const headers = await getHeaders();
      
      if (!categoryId) {
        return {
          success: false,
          message: "Category ID is required"
        };
      }
      
      const url = `${API_BASE_URL}/student/categories/${categoryId}`;
      
      const res = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      const result = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to fetch category"
        };
      }

      return result;
    } catch {
      return {
        success: false,
        message: "Failed to fetch category"
      };
    }
  },

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
      
      const queryParams = new URLSearchParams();
      if (filters?.page) queryParams.append('page', filters.page.toString());
      if (filters?.limit) queryParams.append('limit', filters.limit.toString());
      if (filters?.minRating) queryParams.append('minRating', filters.minRating.toString());
      if (filters?.maxHourlyRate) queryParams.append('maxHourlyRate', filters.maxHourlyRate.toString());
      if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters?.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
      
      const queryString = queryParams.toString();
      
      const url = `${API_BASE_URL}/student/categories/${categoryId}/tutors${queryString ? `?${queryString}` : ''}`;
      
      const res = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      const result = await res.json();

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
    } catch {
      return {
        success: false,
        message: "Failed to fetch tutors by category",
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

export const studentFindTutorService = {
  tutor: tutorDiscoveryService,
  booking: bookingService,
  review: reviewService,
  category: categoryService,
};

export default studentFindTutorService;