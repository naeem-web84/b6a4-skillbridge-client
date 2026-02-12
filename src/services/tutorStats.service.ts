import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface WeeklyEarning {
  week: string;
  amount: number;
  sessions: number;
}

export interface SessionsByStatus {
  completed: number;
  confirmed: number;
  pending: number;
  cancelled: number;
  rescheduled: number;
}

export interface TutorDashboardStats {
  totalEarnings: number;
  todayEarnings: number;
  averageSessionPrice: number;
  totalStudents: number;
  totalSessions: number;
  completedSessions: number;
  upcomingSessions: number;
  pendingRequests: number;
  availableSlots: number;
  completionRate: number;
  averageRating: number;
  totalReviews: number;
  recentReviews: number;
  recentAverageRating: number;
  hourlyRate: number;
  experienceYears: number;
  sessionsByStatus: SessionsByStatus;
  weeklyEarnings?: WeeklyEarning[];
}

export interface StatsResponse {
  success: boolean;
  message?: string;
  data?: TutorDashboardStats;
}

export const tutorStatsService = {
  getDashboardStats: async function (): Promise<StatsResponse> {
    try {
      const cookieStore = await cookies();
      const cookieHeader = cookieStore.toString();

      const res = await fetch(`${API_BASE_URL}/tutors/dashboard/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookieHeader,
        },
        credentials: 'include',
        cache: 'no-store',
      });

      if (!res.ok) {
        return {
          success: false,
          message: `Error: ${res.status} ${res.statusText}`,
        };
      }

      const data = await res.json();
      
      if (!data.success) {
        return {
          success: false,
          message: data.message || 'Failed to load stats',
        };
      }

      return {
        success: true,
        data: data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Network error',
      };
    }
  },
};