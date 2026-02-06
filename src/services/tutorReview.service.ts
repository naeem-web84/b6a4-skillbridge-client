// services/tutorReview.service.ts
import { env } from "@/env";

const API_BASE_URL = env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Types based on your backend response structure
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

// Helper function to get auth token (client-side)
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

export const tutorReviewService = {
  getTutorReviews: async function (filters?: GetTutorReviewsFilters): Promise<GetTutorReviewsResponse> {
    try {
      const headers = await getHeaders();
      
      // Build query string
      const queryParams = new URLSearchParams();
      
      if (filters?.page) queryParams.append('page', filters.page.toString());
      if (filters?.limit) queryParams.append('limit', filters.limit.toString());
      if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters?.minRating) queryParams.append('minRating', filters.minRating.toString());
      
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/tutors/reviews${queryString ? `?${queryString}` : ''}`;
      
      console.log("🌐 GET Tutor Reviews Request:", {
        url,
        filters,
        queryString
      });
      
      const res = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      const result = await res.json();
      
      console.log("🌐 GET Tutor Reviews Response RAW:", {
        status: res.status,
        statusText: res.statusText,
        response: result,
        success: result.success,
        hasData: !!result.data,
        hasPagination: !!result.pagination,
        dataStructure: result.data ? {
          hasReviews: Array.isArray(result.data.reviews),
          reviewsCount: Array.isArray(result.data.reviews) ? result.data.reviews.length : 'N/A',
          hasStatistics: !!result.data.statistics,
          statisticsDetails: result.data.statistics ? {
            averageRating: result.data.statistics.averageRating,
            totalReviews: result.data.statistics.totalReviews,
            ratingDistribution: result.data.statistics.ratingDistribution
          } : 'N/A'
        } : 'No data'
      });

      // Log detailed reviews if available
      if (result.success && result.data && Array.isArray(result.data.reviews)) {
        console.log("📊 Reviews Data Structure Sample:", {
          totalReviews: result.data.reviews.length,
          firstReview: result.data.reviews[0] ? {
            id: result.data.reviews[0].id,
            rating: result.data.reviews[0].rating,
            commentLength: result.data.reviews[0].comment?.length || 0,
            isVerified: result.data.reviews[0].isVerified,
            student: result.data.reviews[0].student ? {
              id: result.data.reviews[0].student.id,
              name: result.data.reviews[0].student.name,
              hasImage: !!result.data.reviews[0].student.image,
              grade: result.data.reviews[0].student.grade,
              subjectsCount: result.data.reviews[0].student.subjects?.length || 0
            } : 'No student data',
            booking: result.data.reviews[0].booking ? {
              id: result.data.reviews[0].booking.id,
              category: result.data.reviews[0].booking.category,
              hasDates: !!result.data.reviews[0].booking.bookingDate
            } : 'No booking data'
          } : 'No reviews'
        });
      }

      // Log statistics if available
      if (result.success && result.data?.statistics) {
        console.log("📈 Statistics Data:", {
          averageRating: result.data.statistics.averageRating,
          totalReviews: result.data.statistics.totalReviews,
          ratingDistribution: result.data.statistics.ratingDistribution?.map((dist: any) => ({
            rating: dist.rating,
            count: dist.count,
            percentage: dist.percentage
          }))
        });
      }

      // Log pagination if available
      if (result.pagination) {
        console.log("🔢 Pagination Data:", result.pagination);
      }

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

      // Return the response as-is for now
      return result as GetTutorReviewsResponse;
      
    } catch (error: any) {
      console.error("Get tutor reviews error:", {
        error: error.message,
        stack: error.stack,
        name: error.name
      });
      
      return {
        success: false,
        message: error.message || "Failed to fetch tutor reviews",
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