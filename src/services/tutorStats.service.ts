 
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const tutorStatsService = {
  getDashboardStats: async function () {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_BASE_URL}/tutors/dashboard/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookieStore.toString(),
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
      console.error('Error fetching dashboard stats:', error);
      return {
        success: false,
        message: error.message || 'Network error',
      };
    }
  },
};