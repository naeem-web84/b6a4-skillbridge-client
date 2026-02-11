import { env } from '@/env';
import { CreateTutorProfileInput, TutorProfileResponse, EligibilityCheckResponse, CategoriesResponse } from '@/types';

const API_BASE_URL = 'http://localhost:5000/api';

export const tutorService = {
  checkEligibility: async (): Promise<EligibilityCheckResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tutors/check-eligibility`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          canBecome: false,
          message: `Failed to check eligibility: ${response.status}`
        };
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return {
        canBecome: false,
        message: error.message || 'Failed to check eligibility'
      };
    }
  },

  getCategories: async (): Promise<CategoriesResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tutors/categories`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return {
          success: false,
          categories: [],
          message: `Failed to fetch categories: ${response.status}`
        };
      }

      const result = await response.json();
      
      const categories = result.data || result.categories || [];
      
      return {
        success: true,
        categories: categories
      };
    } catch (error: any) {
      return {
        success: false,
        categories: [],
        message: error.message || 'Failed to fetch categories'
      };
    }
  },

  createTutorProfile: async (data: CreateTutorProfileInput): Promise<TutorProfileResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tutors/create-profile`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || `Failed to create tutor profile: ${response.status}`
        };
      }

      return result;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to create tutor profile'
      };
    }
  },

  getTutorProfile: async (): Promise<TutorProfileResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tutors/profile`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch tutor profile: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to fetch tutor profile',
      };
    }
  },
};