const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Category {
  id: string;
  name: string;
  description?: string | null;
}

interface Tutor {
  id: string;
  userId: string;
  name: string;
  email?: string;
  image?: string | null;
  headline: string;
  bio?: string;
  hourlyRate: number;
  rating: number;
  totalReviews: number;
  experienceYears?: number;
  education?: string;
  certifications?: string[];
  completedSessions?: number;
  categories?: Category[];
  recentReviews?: Array<{
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

interface TutorProfile extends Tutor {
  reviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    student: {
      id: string;
      name: string;
      image?: string | null;
      grade?: string | null;
    };
  }>;
  statistics: {
    totalStudents: number;
    totalSessions: number;
    availableSlots: number;
    completedSessions: number;
  };
}

interface BrowseTutorsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minRating?: number;
  maxHourlyRate?: number;
  minHourlyRate?: number;
  experienceYears?: number;
  sortBy?: string;
  sortOrder?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

interface BrowseTutorsResponse {
  tutors: Tutor[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: Record<string, any>;
}

const transformTutorData = (apiTutor: any): Tutor => {
  return {
    id: apiTutor.id || '',
    userId: apiTutor.userId || '',
    name: apiTutor.name || apiTutor.user?.name || 'Tutor',
    email: apiTutor.email || apiTutor.user?.email,
    image: apiTutor.image || apiTutor.user?.image || null,
    headline: apiTutor.headline || '',
    bio: apiTutor.bio || '',
    hourlyRate: apiTutor.hourlyRate || 0,
    rating: apiTutor.rating || 0,
    totalReviews: apiTutor.totalReviews || 0,
    experienceYears: apiTutor.experienceYears || 0,
    education: apiTutor.education,
    certifications: apiTutor.certifications || [],
    completedSessions: apiTutor.completedSessions || 0,
    categories: apiTutor.categories || [],
    recentReviews: apiTutor.recentReviews || [],
    createdAt: apiTutor.createdAt,
    updatedAt: apiTutor.updatedAt
  };
};

export const homePageClientService = {
  browseTutors: async function (params: BrowseTutorsParams = {}): Promise<ApiResponse<BrowseTutorsResponse>> {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const url = `${API_BASE_URL}/tutors/public?${queryParams.toString()}`;

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        return {
          success: true,
          data: {
            tutors: [],
            pagination: {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0,
              hasNextPage: false,
              hasPrevPage: false
            },
            filters: {}
          }
        };
      }

      const data = await res.json();
      
      if (!data.success) {
        return {
          success: false,
          message: data.message || 'Failed to load tutors',
        };
      }

      const transformedData: BrowseTutorsResponse = {
        tutors: Array.isArray(data.data?.tutors) 
          ? data.data.tutors.map(transformTutorData)
          : [],
        pagination: data.data?.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false
        },
        filters: data.data?.filters || {}
      };

      return {
        success: true,
        data: transformedData,
      };
    } catch {
      return {
        success: true,
        data: {
          tutors: [],
          pagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false
          },
          filters: {}
        }
      };
    }
  },

  getTutorProfile: async function (tutorId: string): Promise<ApiResponse<TutorProfile>> {
    try {
      if (!tutorId) {
        return {
          success: false,
          message: 'Tutor ID is required',
        };
      }

      const url = `${API_BASE_URL}/tutors/public/${tutorId}`;

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        if (res.status === 404) {
          return {
            success: false,
            message: 'Tutor not found',
          };
        }
        return {
          success: true,
          data: {
            id: tutorId,
            userId: '',
            name: 'Tutor Profile',
            headline: 'Available for tutoring',
            hourlyRate: 0,
            rating: 0,
            totalReviews: 0,
            reviews: [],
            statistics: {
              totalStudents: 0,
              totalSessions: 0,
              availableSlots: 0,
              completedSessions: 0
            },
            categories: []
          } as TutorProfile
        };
      }

      const data = await res.json();
      
      if (!data.success) {
        return {
          success: false,
          message: data.message || 'Failed to load tutor profile',
        };
      }

      const apiData = data.data;
      const transformedData: TutorProfile = {
        ...transformTutorData(apiData),
        reviews: apiData?.reviews || [],
        statistics: apiData?.statistics || {
          totalStudents: 0,
          totalSessions: 0,
          availableSlots: 0,
          completedSessions: 0
        }
      };

      return {
        success: true,
        data: transformedData,
      };
    } catch {
      return {
        success: false,
        message: 'Network error',
      };
    }
  },

  getTutorsByCategory: async function (
    categoryId: string, 
    limit: number = 8
  ): Promise<ApiResponse<BrowseTutorsResponse>> {
    try {
      const params: BrowseTutorsParams = {
        category: categoryId,
        limit,
        sortBy: 'rating',
        sortOrder: 'desc',
      };

      return this.browseTutors(params);
    } catch {
      return {
        success: false,
        message: 'Network error',
      };
    }
  },
};

export const homePageService = homePageClientService;

export const formatHourlyRate = (rate: number): string => {
  return `$${rate.toFixed(0)}/hour`;
};

export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

export const getTutorInitials = (name: string): string => {
  if (!name) return 'TU';
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};