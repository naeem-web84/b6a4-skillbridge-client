import { env } from "@/env";

const API_BASE_URL = env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface StudentProfile {
  id: string;
  userId: string;
  grade: string | null;
  subjects: string[];
}

interface Booking {
  id: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  category: {
    name: string;
  } | null;
}

interface StudentUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  student: {
    id: string | undefined;
    name: string | null | undefined;
    email: string | undefined;
    image: string | null | undefined;
    grade: string | null | undefined;
    subjects: string[] | undefined;
  };
  booking: {
    id: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    category: string | null | undefined;
  } | null;
}

interface RatingDistribution {
  rating: number;
  count: number;
  percentage: number;
}

interface Statistics {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: RatingDistribution[];
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface GetTutorReviewsFilters {
  page?: number;
  limit?: number;
  sortBy?: 'newest' | 'oldest' | 'highest' | 'lowest';
  minRating?: number;
}

interface BaseResponse {
  success: boolean;
  message: string;
}

interface GetTutorReviewsResponse extends BaseResponse {
  data?: {
    reviews: Review[];
    statistics: Statistics;
  };
  pagination?: Pagination;
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

export const tutorReviewService = {
  getTutorReviews: async function (filters?: GetTutorReviewsFilters): Promise<GetTutorReviewsResponse> {
    try {
      const headers = await getHeaders();
      
      const queryParams = new URLSearchParams();
      
      if (filters?.page) queryParams.append('page', filters.page.toString());
      if (filters?.limit) queryParams.append('limit', filters.limit.toString());
      if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters?.minRating) queryParams.append('minRating', filters.minRating.toString());
      
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/tutors/reviews${queryString ? `?${queryString}` : ''}`;
      
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
          message: result.message || "Failed to fetch tutor reviews",
          data: {
            reviews: [],
            statistics: {
              averageRating: 0,
              totalReviews: 0,
              ratingDistribution: []
            }
          },
          pagination: {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0
          }
        };
      }

      return result as GetTutorReviewsResponse;
      
    } catch {
      return {
        success: false,
        message: "Failed to fetch tutor reviews",
        data: {
          reviews: [],
          statistics: {
            averageRating: 0,
            totalReviews: 0,
            ratingDistribution: []
          }
        },
        pagination: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        }
      };
    }
  }
};