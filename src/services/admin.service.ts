// services/admin/admin.service.ts
import { env } from "@/env";

const API_BASE_URL = env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ==================== TYPES ====================
interface BaseResponse {
  success: boolean;
  message: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'TUTOR' | 'ADMIN';
  status: string;
  emailVerified: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
  profile?: any;
}

interface TutorProfile {
  id: string;
  userId: string;
  headline: string;
  bio?: string;
  hourlyRate: number;
  experienceYears: number;
  education?: string;
  certifications?: string;
  rating: number;
  totalReviews: number;
  completedSessions: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    status: string;
    emailVerified: boolean;
  };
  categories?: Array<{
    id: string;
    name: string;
  }>;
  stats?: {
    bookings: number;
    reviews: number;
    availabilitySlots: number;
  };
}

interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    tutorCategories: number;
    bookings: number;
  };
}

interface Booking {
  id: string;
  studentUserId: string;
  tutorUserId: string;
  studentProfileId: string;
  tutorProfileId: string;
  categoryId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED | RESCHEDULED';
  amount: number;
  isPaid: boolean;
  meetingLink?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  studentUser?: {
    id: string;
    name: string;
    email: string;
  };
  tutorUser?: {
    id: string;
    name: string;
    email: string;
  };
  studentProfile?: {
    id: string;
    userId: string;
    grade?: string;
  };
  tutorProfile?: {
    id: string;
    userId: string;
    headline: string;
  };
  category?: {
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

interface Review {
  id: string;
  studentUserId: string;
  studentProfileId: string;
  tutorProfileId: string;
  bookingId: string;
  rating: number;
  comment?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  studentUser?: {
    id: string;
    name: string;
    email: string;
  };
  tutorUser?: {
    id: string;
    name: string;
    email: string;
  };
  studentProfile?: {
    id: string;
    userId: string;
    grade?: string;
  };
  tutorProfile?: {
    id: string;
    userId: string;
    headline: string;
    rating: number;
  };
  booking?: {
    id: string;
    bookingDate: string;
    amount: number;
  };
}

interface PlatformStats {
  totalUsers: number;
  totalTutors: number;
  totalStudents: number;
  totalAdmins: number;
  totalBookings: number;
  totalRevenue: number;
  activeBookings: number;
  pendingBookings: number;
  totalCategories: number;
  totalReviews: number;
  averageRating: number;
  recentUsers: Array<{ date: string; count: number }>;
  recentBookings: Array<{ date: string; count: number }>;
  recentRevenue: Array<{ date: string; amount: number }>;
}

interface Notification {
  id: string;
  userId: string;
  title: string;
  message?: string;
  type: 'BOOKING' | 'REVIEW' | 'PAYMENT' | 'SYSTEM' | 'REMINDER';
  relatedId?: string;
  relatedType?: string;
  isRead: boolean;
  isDeleted: boolean;
  createdAt: string;
  readAt?: string;
}

// Filter interfaces
interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  sortBy?: 'name' | 'email' | 'createdAt' | 'role';
  sortOrder?: 'asc' | 'desc';
}

interface TutorFilters {
  page?: number;
  limit?: number;
  search?: string;
  minRating?: number;
  maxHourlyRate?: number;
  experienceYears?: number;
  sortBy?: 'rating' | 'hourlyRate' | 'experienceYears' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

interface BookingFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'bookingDate' | 'amount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

interface CategoryFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

interface ReviewFilters {
  page?: number;
  limit?: number;
  search?: string;
  minRating?: number;
  maxRating?: number;
  isVerified?: boolean;
  sortBy?: 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Update interfaces
interface UpdateUserData {
  name?: string;
  role?: string;
  status?: string;
  emailVerified?: boolean;
}

interface UpdateTutorData {
  headline?: string;
  bio?: string;
  hourlyRate?: number;
  experienceYears?: number;
  education?: string;
  certifications?: string;
  rating?: number;
  totalReviews?: number;
  completedSessions?: number;
}

interface UpdateCategoryData {
  name?: string;
  description?: string;
}

interface UpdateBookingData {
  status?: string;
  amount?: number;
  isPaid?: boolean;
  meetingLink?: string;
  notes?: string;
}

interface UpdateReviewData {
  rating?: number;
  comment?: string;
  isVerified?: boolean;
}

interface CreateCategoryData {
  name: string;
  description?: string;
}

interface CreateNotificationData {
  userId: string;
  title: string;
  message?: string;
  type: string;
  relatedId?: string;
  relatedType?: string;
}

// Paginated response
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

// ==================== UTILITY FUNCTIONS ====================
const buildQueryString = (filters?: any): string => {
  if (!filters) return '';
  
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value.toString());
    }
  });
  
  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
};

// ==================== USER MANAGEMENT SERVICE ====================
export const userManagementService = {
  // Get all users with filters
  getAllUsers: async function (filters?: UserFilters): Promise<PaginatedResponse<User>> {
    try {
      const headers = await getHeaders();
      const queryString = buildQueryString(filters);
      const url = `${API_BASE_URL}/admin/users${queryString}`;
      
      console.log("🌐 GET", url);
      
      const res = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      const result = await res.json();
      console.log("🌐 Users response:", result);

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to fetch users",
          data: []
        };
      }

      return {
        success: true,
        message: result.message || "Users fetched successfully",
        data: result.data || [],
        pagination: result.pagination
      };
    } catch (error: any) {
      console.error("Get users error:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch users",
        data: []
      };
    }
  },

  // Update user
  updateUser: async function (userId: string, data: UpdateUserData): Promise<BaseResponse & { data?: User }> {
    try {
      const headers = await getHeaders();
      console.log("🌐 PUT /api/admin/users/" + userId, data);
      
      const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await res.json();
      console.log("🌐 Update user response:", result);

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to update user"
        };
      }

      return result;
    } catch (error: any) {
      console.error("Update user error:", error);
      return {
        success: false,
        message: error.message || "Failed to update user"
      };
    }
  },

  // Delete user
  deleteUser: async function (userId: string): Promise<BaseResponse> {
    try {
      const headers = await getHeaders();
      console.log("🌐 DELETE /api/admin/users/" + userId);
      
      const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: "DELETE",
        headers,
        credentials: "include",
      });

      const result = await res.json();
      console.log("🌐 Delete user response:", result);

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to delete user"
        };
      }

      return result;
    } catch (error: any) {
      console.error("Delete user error:", error);
      return {
        success: false,
        message: error.message || "Failed to delete user"
      };
    }
  }
};

// ==================== TUTOR MANAGEMENT SERVICE ====================
export const tutorManagementService = {
  // Get all tutors with filters
  getAllTutors: async function (filters?: TutorFilters): Promise<PaginatedResponse<TutorProfile>> {
    try {
      const headers = await getHeaders();
      const queryString = buildQueryString(filters);
      const url = `${API_BASE_URL}/admin/tutors${queryString}`;
      
      console.log("🌐 GET", url);
      
      const res = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      const result = await res.json();
      console.log("🌐 Tutors response:", result);

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to fetch tutors",
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
      console.error("Get tutors error:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch tutors",
        data: []
      };
    }
  },

  // Update tutor profile
  updateTutorProfile: async function (tutorId: string, data: UpdateTutorData): Promise<BaseResponse & { data?: TutorProfile }> {
    try {
      const headers = await getHeaders();
      console.log("🌐 PUT /api/admin/tutors/" + tutorId, data);
      
      const res = await fetch(`${API_BASE_URL}/admin/tutors/${tutorId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await res.json();
      console.log("🌐 Update tutor response:", result);

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to update tutor profile"
        };
      }

      return result;
    } catch (error: any) {
      console.error("Update tutor error:", error);
      return {
        success: false,
        message: error.message || "Failed to update tutor profile"
      };
    }
  },

  // Delete tutor
  deleteTutor: async function (tutorId: string): Promise<BaseResponse> {
    try {
      const headers = await getHeaders();
      console.log("🌐 DELETE /api/admin/tutors/" + tutorId);
      
      const res = await fetch(`${API_BASE_URL}/admin/tutors/${tutorId}`, {
        method: "DELETE",
        headers,
        credentials: "include",
      });

      const result = await res.json();
      console.log("🌐 Delete tutor response:", result);

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to delete tutor"
        };
      }

      return result;
    } catch (error: any) {
      console.error("Delete tutor error:", error);
      return {
        success: false,
        message: error.message || "Failed to delete tutor"
      };
    }
  }
};

// ==================== CATEGORY MANAGEMENT SERVICE ====================
export const categoryManagementService = {
  // Get all categories
  getAllCategories: async function (filters?: CategoryFilters): Promise<PaginatedResponse<Category>> {
    try {
      const headers = await getHeaders();
      const queryString = buildQueryString(filters);
      const url = `${API_BASE_URL}/admin/categories${queryString}`;
      
      console.log("🌐 GET", url);
      
      const res = await fetch(url, {
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
        data: result.data || [],
        pagination: result.pagination
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

  // Create category
  createCategory: async function (data: CreateCategoryData): Promise<BaseResponse & { data?: Category }> {
    try {
      const headers = await getHeaders();
      console.log("🌐 POST /api/admin/categories", data);
      
      const res = await fetch(`${API_BASE_URL}/admin/categories`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await res.json();
      console.log("🌐 Create category response:", result);

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to create category"
        };
      }

      return result;
    } catch (error: any) {
      console.error("Create category error:", error);
      return {
        success: false,
        message: error.message || "Failed to create category"
      };
    }
  },

  // Update category
  updateCategory: async function (categoryId: string, data: UpdateCategoryData): Promise<BaseResponse & { data?: Category }> {
    try {
      const headers = await getHeaders();
      console.log("🌐 PUT /api/admin/categories/" + categoryId, data);
      
      const res = await fetch(`${API_BASE_URL}/admin/categories/${categoryId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await res.json();
      console.log("🌐 Update category response:", result);

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to update category"
        };
      }

      return result;
    } catch (error: any) {
      console.error("Update category error:", error);
      return {
        success: false,
        message: error.message || "Failed to update category"
      };
    }
  },

  // Delete category
  deleteCategory: async function (categoryId: string): Promise<BaseResponse> {
    try {
      const headers = await getHeaders();
      console.log("🌐 DELETE /api/admin/categories/" + categoryId);
      
      const res = await fetch(`${API_BASE_URL}/admin/categories/${categoryId}`, {
        method: "DELETE",
        headers,
        credentials: "include",
      });

      const result = await res.json();
      console.log("🌐 Delete category response:", result);

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to delete category"
        };
      }

      return result;
    } catch (error: any) {
      console.error("Delete category error:", error);
      return {
        success: false,
        message: error.message || "Failed to delete category"
      };
    }
  }
};

// ==================== BOOKING MANAGEMENT SERVICE ====================
export const bookingManagementService = {
  // Get all bookings
  getAllBookings: async function (filters?: BookingFilters): Promise<PaginatedResponse<Booking>> {
    try {
      const headers = await getHeaders();
      const queryString = buildQueryString(filters);
      const url = `${API_BASE_URL}/admin/bookings${queryString}`;
      
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

  // Update booking
  updateBooking: async function (bookingId: string, data: UpdateBookingData): Promise<BaseResponse & { data?: Booking }> {
    try {
      const headers = await getHeaders();
      console.log("🌐 PUT /api/admin/bookings/" + bookingId, data);
      
      const res = await fetch(`${API_BASE_URL}/admin/bookings/${bookingId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await res.json();
      console.log("🌐 Update booking response:", result);

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to update booking"
        };
      }

      return result;
    } catch (error: any) {
      console.error("Update booking error:", error);
      return {
        success: false,
        message: error.message || "Failed to update booking"
      };
    }
  }
};

// ==================== REVIEW MANAGEMENT SERVICE ====================
export const reviewManagementService = {
  // Get all reviews
  getAllReviews: async function (filters?: ReviewFilters): Promise<PaginatedResponse<Review>> {
    try {
      const headers = await getHeaders();
      const queryString = buildQueryString(filters);
      const url = `${API_BASE_URL}/admin/reviews${queryString}`;
      
      console.log("🌐 GET", url);
      
      const res = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      const result = await res.json();
      console.log("🌐 Reviews response:", result);

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
        data: result.data || [],
        pagination: result.pagination
      };
    } catch (error: any) {
      console.error("Get reviews error:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch reviews",
        data: []
      };
    }
  },

  // Update review
  updateReview: async function (reviewId: string, data: UpdateReviewData): Promise<BaseResponse & { data?: Review }> {
    try {
      const headers = await getHeaders();
      console.log("🌐 PUT /api/admin/reviews/" + reviewId, data);
      
      const res = await fetch(`${API_BASE_URL}/admin/reviews/${reviewId}`, {
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

  // Delete review
  deleteReview: async function (reviewId: string): Promise<BaseResponse> {
    try {
      const headers = await getHeaders();
      console.log("🌐 DELETE /api/admin/reviews/" + reviewId);
      
      const res = await fetch(`${API_BASE_URL}/admin/reviews/${reviewId}`, {
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
  }
};

// ==================== PLATFORM STATISTICS SERVICE ====================
export const platformStatsService = {
  // Get platform statistics
  getPlatformStats: async function (): Promise<BaseResponse & { data?: PlatformStats }> {
    try {
      const headers = await getHeaders();
      console.log("🌐 GET /api/admin/stats");
      
      const res = await fetch(`${API_BASE_URL}/admin/stats`, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      const result = await res.json();
      console.log("🌐 Platform stats response:", result);

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to fetch platform statistics"
        };
      }

      return result;
    } catch (error: any) {
      console.error("Get platform stats error:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch platform statistics"
      };
    }
  }
};

// ==================== NOTIFICATION MANAGEMENT SERVICE ====================
export const notificationManagementService = {
  // Send notification
  sendNotification: async function (data: CreateNotificationData): Promise<BaseResponse & { data?: Notification }> {
    try {
      const headers = await getHeaders();
      console.log("🌐 POST /api/admin/notifications", data);
      
      const res = await fetch(`${API_BASE_URL}/admin/notifications`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await res.json();
      console.log("🌐 Send notification response:", result);

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to send notification"
        };
      }

      return result;
    } catch (error: any) {
      console.error("Send notification error:", error);
      return {
        success: false,
        message: error.message || "Failed to send notification"
      };
    }
  }
};

// ==================== MAIN EXPORT ====================
export const adminService = {
  users: userManagementService,
  tutors: tutorManagementService,
  categories: categoryManagementService,
  bookings: bookingManagementService,
  reviews: reviewManagementService,
  stats: platformStatsService,
  notifications: notificationManagementService,
};

export default adminService;