// types/tutorStats.types.ts

import { BookingStatus } from '@prisma/client';

// ==================== BASE RESPONSE TYPES ====================

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

// ==================== DASHBOARD STATS TYPES ====================

export interface DashboardStats {
  totalEarnings: number;
  todayEarnings: number;
  averageSessionPrice: number;
  totalSessions: number;
  completedSessions: number;
  upcomingSessions: number;
  pendingRequests: number;
  availableSlots: number;
  completionRate: number;
  
  sessionsByStatus: {
    completed: number;
    confirmed: number;
    pending: number;
    cancelled: number;
    rescheduled: number;
  };
  
  averageRating: number;
  totalReviews: number;
  recentReviews: number;
  recentAverageRating: number;
  totalStudents: number;
  
  weeklyEarnings: Array<{
    date: Date;
    earnings: number;
  }>;
  
  hourlyRate: number;
  experienceYears: number;
}

// ==================== UPCOMING SESSIONS TYPES ====================

export interface UpcomingSession {
  id: string;
  bookingDate: Date;
  startTime: Date;
  endTime: Date;
  duration: number;
  amount: number;
  status: BookingStatus;
  notes: string | null;
  meetingLink: string | null;
  
  timeUntil: {
    hours: number;
    minutes: number;
    totalMinutes: number;
  };
  
  sessionStatus: 'upcoming' | 'tomorrow' | 'soon' | 'past';
  
  student: {
    id: string | null;
    name: string | null;
    email: string | null;
    image: string | null;
    grade: string | null;
  };
  
  category: {
    id: string;
    name: string;
  } | null;
  
  availabilitySlot: {
    date: Date;
    startTime: Date;
    endTime: Date;
  } | null;
}

export interface UpcomingSessionsData {
  sessions: UpcomingSession[];
  groupedByDate: Record<string, UpcomingSession[]>;
  todaysSessions: UpcomingSession[];
  tomorrowsSessions: UpcomingSession[];
  summary: {
    total: number;
    today: number;
    tomorrow: number;
    thisWeek: number;
  };
}

// ==================== BOOKINGS TYPES ====================

export interface Booking {
  id: string;
  bookingDate: Date;
  startTime: Date;
  endTime: Date;
  duration: number;
  amount: number;
  status: BookingStatus;
  notes: string | null;
  meetingLink: string | null;
  
  studentProfile: {
    id: string;
    userId: string;
    grade: string | null;
    subjects: string[];
  };
  
  category: {
    id: string;
    name: string;
    description: string | null;
  };
  
  availabilitySlot: {
    id: string;
    date: Date;
    startTime: Date;
    endTime: Date;
  } | null;
  
  review: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
  } | null;
  
  studentUser: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export interface BookingsResponse {
  data: Booking[];
  pagination: PaginationMeta;
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

// ==================== REVIEWS TYPES ====================

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  studentUser: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  } | null;
  
  studentProfile: {
    grade: string | null;
    subjects: string[];
  } | null;
  
  booking: {
    id: string;
    bookingDate: Date;
    startTime: Date;
    endTime: Date;
    category: {
      name: string;
    } | null;
  } | null;
}

export interface ReviewsStatistics {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Array<{
    rating: number;
    count: number;
    percentage: number;
  }>;
}

export interface ReviewsResponse {
  reviews: Review[];
  statistics: ReviewsStatistics;
}

// ==================== COMPREHENSIVE DASHBOARD DATA ====================

export interface TutorDashboardData {
  dashboardStats: DashboardStats;
  upcomingSessions: UpcomingSessionsData;
  bookingStats: BookingStats;
  recentBookings: Booking[];
  recentReviews: ReviewsResponse;
}

// ==================== FILTER TYPES ====================

export interface BookingFilters {
  status?: BookingStatus;
  page?: number;
  limit?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface UpcomingSessionsFilters {
  days?: number;
  limit?: number;
}

export interface ReviewsFilters {
  page?: number;
  limit?: number;
  sortBy?: 'newest' | 'oldest' | 'highest' | 'lowest';
  minRating?: number;
}