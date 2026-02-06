import { env } from '@/env';
import { CreateTutorProfileInput, TutorProfileResponse } from '@/types';
import { getUserRole } from './getUserRole.service';

const API_BASE_URL = env.NEXT_PUBLIC_API_URL||'http://localhost:5000/api';

export const updateTutorService = { 
  updateTutorProfile: async (data: Partial<CreateTutorProfileInput>): Promise<TutorProfileResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tutors/profile`, {
        method: 'PUT',
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
          message: result.message || `Failed to update tutor profile: ${response.status}`
        };
      }

      return result;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to update tutor profile'
      };
    }
  },
};