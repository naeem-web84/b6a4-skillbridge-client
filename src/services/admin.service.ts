import { env } from "@/env";

const API_BASE_URL = env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface AdminUser {
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
  _count?: {
    sessions?: number;
    accounts?: number;
  };
}

export interface TutorProfile {
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

export interface Category {
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

export interface Booking {
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
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
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

export interface Review {
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

export interface PlatformStats {
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

export interface Notification {
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

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  sortBy?: 'name' | 'email' | 'createdAt' | 'role';
  sortOrder?: 'asc' | 'desc';
}

export interface TutorFilters {
  page?: number;
  limit?: number;
  search?: string;
  minRating?: number;
  maxHourlyRate?: number;
  experienceYears?: number;
  sortBy?: 'rating' | 'hourlyRate' | 'experienceYears' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface BookingFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'bookingDate' | 'amount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CategoryFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ReviewFilters {
  page?: number;
  limit?: number;
  search?: string;
  minRating?: number;
  maxRating?: number;
  isVerified?: boolean;
  sortBy?: 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface UpdateUserData {
  name?: string;
  role?: string;
  status?: string;
  emailVerified?: boolean;
}

export interface UpdateTutorData {
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

export interface UpdateCategoryData {
  name?: string;
  description?: string;
}

export interface UpdateBookingData {
  status?: string;
  amount?: number;
  isPaid?: boolean;
  meetingLink?: string;
  notes?: string;
}

export interface UpdateReviewData {
  rating?: number;
  comment?: string;
  isVerified?: boolean;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
}

export interface CreateNotificationData {
  userId: string;
  title: string;
  message?: string;
  type: string;
  relatedId?: string;
  relatedType?: string;
}

export interface PaginatedResponse<T> extends BaseResponse {
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

export const userManagementService = {
  getAllUsers: async function (filters?: UserFilters): Promise<PaginatedResponse<AdminUser>> {
    try {
      const headers = await getHeaders();
      const queryString = buildQueryString(filters);
      const url = `${API_BASE_URL}/admin/users${queryString}`;
      
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
    } catch {
      return {
        success: false,
        message: "Failed to fetch users",
        data: []
      };
    }
  },

  getUserById: async function (userId: string): Promise<BaseResponse & { data?: AdminUser }> {
    try {
      const headers = await getHeaders();
      const url = `${API_BASE_URL}/admin/users/${userId}`;
      
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
          message: result.message || "Failed to fetch user"
        };
      }

      return {
        success: true,
        message: result.message || "User fetched successfully",
        data: result.data
      };
    } catch {
      return {
        success: false,
        message: "Failed to fetch user"
      };
    }
  },

  updateUser: async function (userId: string, data: UpdateUserData): Promise<BaseResponse & { data?: AdminUser }> {
    try {
      const headers = await getHeaders();
      
      const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to update user"
        };
      }

      return result;
    } catch {
      return {
        success: false,
        message: "Failed to update user"
      };
    }
  },

  deleteUser: async function (userId: string): Promise<BaseResponse> {
    try {
      const headers = await getHeaders();
      
      const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: "DELETE",
        headers,
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to delete user"
        };
      }

      return result;
    } catch {
      return {
        success: false,
        message: "Failed to delete user"
      };
    }
  }
};

export const tutorManagementService = {
  getAllTutors: async function (filters?: TutorFilters): Promise<PaginatedResponse<TutorProfile>> {
    try {
      const headers = await getHeaders();
      const queryString = buildQueryString(filters);
      const url = `${API_BASE_URL}/admin/tutors${queryString}`;
      
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
    } catch {
      return {
        success: false,
        message: "Failed to fetch tutors",
        data: []
      };
    }
  },

  updateTutorProfile: async function (tutorId: string, data: UpdateTutorData): Promise<BaseResponse & { data?: TutorProfile }> {
    try {
      const headers = await getHeaders();
      
      const res = await fetch(`${API_BASE_URL}/admin/tutors/${tutorId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to update tutor profile"
        };
      }

      return result;
    } catch {
      return {
        success: false,
        message: "Failed to update tutor profile"
      };
    }
  },

  deleteTutor: async function (tutorId: string): Promise<BaseResponse> {
    try {
      const headers = await getHeaders();
      
      const res = await fetch(`${API_BASE_URL}/admin/tutors/${tutorId}`, {
        method: "DELETE",
        headers,
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to delete tutor"
        };
      }

      return result;
    } catch {
      return {
        success: false,
        message: "Failed to delete tutor"
      };
    }
  }
};

export const categoryManagementService = {
  getAllCategories: async function (filters?: CategoryFilters): Promise<PaginatedResponse<Category>> {
    try {
      const headers = await getHeaders();
      const queryString = buildQueryString(filters);
      const url = `${API_BASE_URL}/admin/categories${queryString}`;
      
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
        message: result.message || "Categories fetched successfully",
        data: result.data || [],
        pagination: result.pagination
      };
    } catch {
      return {
        success: false,
        message: "Failed to fetch categories",
        data: []
      };
    }
  },

  createCategory: async function (data: CreateCategoryData): Promise<BaseResponse & { data?: Category }> {
    try {
      const headers = await getHeaders();
      
      const res = await fetch(`${API_BASE_URL}/admin/categories`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to create category"
        };
      }

      return result;
    } catch {
      return {
        success: false,
        message: "Failed to create category"
      };
    }
  },

  updateCategory: async function (categoryId: string, data: UpdateCategoryData): Promise<BaseResponse & { data?: Category }> {
    try {
      const headers = await getHeaders();
      
      const res = await fetch(`${API_BASE_URL}/admin/categories/${categoryId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to update category"
        };
      }

      return result;
    } catch {
      return {
        success: false,
        message: "Failed to update category"
      };
    }
  },

  deleteCategory: async function (categoryId: string): Promise<BaseResponse> {
    try {
      const headers = await getHeaders();
      
      const res = await fetch(`${API_BASE_URL}/admin/categories/${categoryId}`, {
        method: "DELETE",
        headers,
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to delete category"
        };
      }

      return result;
    } catch {
      return {
        success: false,
        message: "Failed to delete category"
      };
    }
  }
};

export const bookingManagementService = {
  getAllBookings: async function (filters?: BookingFilters): Promise<PaginatedResponse<Booking>> {
    try {
      const headers = await getHeaders();
      const queryString = buildQueryString(filters);
      const url = `${API_BASE_URL}/admin/bookings${queryString}`;
      
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
        message: result.message || "Bookings fetched successfully",
        data: result.data || [],
        pagination: result.pagination
      };
    } catch {
      return {
        success: false,
        message: "Failed to fetch bookings",
        data: []
      };
    }
  },

  updateBooking: async function (bookingId: string, data: UpdateBookingData): Promise<BaseResponse & { data?: Booking }> {
    try {
      const headers = await getHeaders();
      
      const res = await fetch(`${API_BASE_URL}/admin/bookings/${bookingId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to update booking"
        };
      }

      return result;
    } catch {
      return {
        success: false,
        message: "Failed to update booking"
      };
    }
  }
};

export const reviewManagementService = {
  getAllReviews: async function (filters?: ReviewFilters): Promise<PaginatedResponse<Review>> {
    try {
      const headers = await getHeaders();
      const queryString = buildQueryString(filters);
      const url = `${API_BASE_URL}/admin/reviews${queryString}`;
      
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
          data: []
        };
      }

      return {
        success: true,
        message: result.message || "Reviews fetched successfully",
        data: result.data || [],
        pagination: result.pagination
      };
    } catch {
      return {
        success: false,
        message: "Failed to fetch reviews",
        data: []
      };
    }
  },

  updateReview: async function (reviewId: string, data: UpdateReviewData): Promise<BaseResponse & { data?: Review }> {
    try {
      const headers = await getHeaders();
      
      const res = await fetch(`${API_BASE_URL}/admin/reviews/${reviewId}`, {
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

  deleteReview: async function (reviewId: string): Promise<BaseResponse> {
    try {
      const headers = await getHeaders();
      
      const res = await fetch(`${API_BASE_URL}/admin/reviews/${reviewId}`, {
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
  }
};

export const platformStatsService = {
  getPlatformStats: async function (): Promise<BaseResponse & { data?: PlatformStats }> {
    try {
      const headers = await getHeaders();
      
      const res = await fetch(`${API_BASE_URL}/admin/stats`, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      const result = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to fetch platform statistics"
        };
      }

      return result;
    } catch {
      return {
        success: false,
        message: "Failed to fetch platform statistics"
      };
    }
  }
};

export const notificationManagementService = {
  sendNotification: async function (data: CreateNotificationData): Promise<BaseResponse & { data?: Notification }> {
    try {
      const headers = await getHeaders();
      
      const res = await fetch(`${API_BASE_URL}/admin/notifications`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to send notification"
        };
      }

      return result;
    } catch {
      return {
        success: false,
        message: "Failed to send notification"
      };
    }
  }
};

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

export type User = AdminUser;