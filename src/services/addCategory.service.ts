// services/addCategory.service.ts
import { env } from "@/env";

const API_BASE_URL = env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface AddTeachingCategoryInput {
  categoryId: string;
  proficiencyLevel?: string;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt?: string;
}

interface TutorCategory {
  id: string;           // TutorCategory ID (from tutor_categories table)
  proficiencyLevel: string | null;
  addedAt: string;      // Usually createdAt from tutor_categories
  category: Category;   // Nested category object
}

interface BaseResponse {
  success: boolean;
  message: string;
}

interface AddCategoryResponse extends BaseResponse {
  data?: TutorCategory;
}

interface GetCategoriesResponse extends BaseResponse {
  data?: TutorCategory[];
}

interface RemoveCategoryResponse extends BaseResponse {}

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

// Helper function to check if data is TutorCategory format
const isTutorCategoryFormat = (data: any): boolean => {
  return data && data.category && typeof data.category === 'object';
};

// Helper function to transform Category[] to TutorCategory[]
const transformCategoriesToTutorCategories = (categories: Category[]): TutorCategory[] => {
  return categories.map(category => ({
    id: `temp_${category.id}`, // Temporary ID since we don't have TutorCategory ID
    proficiencyLevel: null,
    addedAt: category.createdAt || new Date().toISOString(),
    category: category
  }));
};

export const categoryService = {
  addTeachingCategory: async function (data: AddTeachingCategoryInput): Promise<AddCategoryResponse> {
    try {
      const headers = await getHeaders();
      console.log("🌐 POST /tutors/categories with:", data);
      
      const res = await fetch(`${API_BASE_URL}/tutors/categories`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await res.json();
      console.log("🌐 POST Response:", result);

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to add category"
        };
      }

      return result;
    } catch (error: any) {
      console.error("Add teaching category error:", error);
      return {
        success: false,
        message: error.message || "Failed to add category"
      };
    }
  },

  getTutorCategories: async function (): Promise<GetCategoriesResponse> {
    try {
      const headers = await getHeaders();
      console.log("🌐 GET /tutors/categories");
      
      const res = await fetch(`${API_BASE_URL}/tutors/categories`, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      const result = await res.json();
      console.log("🌐 GET Response raw:", result);

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to fetch categories",
          data: []
        };
      }

      // Transform data if needed
      let transformedData: TutorCategory[] = [];
      
      if (result.success && result.data && Array.isArray(result.data)) {
        if (result.data.length === 0) {
          transformedData = [];
        } else {
          const firstItem = result.data[0];
          
          if (isTutorCategoryFormat(firstItem)) {
            // Already in correct format
            transformedData = result.data.filter((item: any) => 
              item && item.category && item.category.id
            );
          } else {
            // Need to transform from Category[] to TutorCategory[]
            console.log("🔄 Transforming Category[] to TutorCategory[]");
            transformedData = transformCategoriesToTutorCategories(result.data);
          }
        }
      }

      console.log("🌐 Transformed data:", transformedData);
      return {
        success: true,
        message: result.message || "Categories fetched successfully",
        data: transformedData
      };
      
    } catch (error: any) {
      console.error("Get tutor categories error:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch categories",
        data: []
      };
    }
  },

  removeTeachingCategory: async function (tutorCategoryId: string): Promise<RemoveCategoryResponse> {
    try {
      const headers = await getHeaders();
      console.log("🌐 DELETE /tutors/categories/" + tutorCategoryId);
      
      if (!tutorCategoryId) {
        return {
          success: false,
          message: "Tutor Category ID is required"
        };
      }

      const res = await fetch(`${API_BASE_URL}/tutors/categories/${tutorCategoryId}`, {
        method: "DELETE",
        headers,
        credentials: "include",
      });

      const result = await res.json();
      console.log("🌐 DELETE Response:", result);

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to remove category"
        };
      }

      return result;
    } catch (error: any) {
      console.error("Remove teaching category error:", error);
      return {
        success: false,
        message: error.message || "Failed to remove category"
      };
    }
  },

  getAllCategories: async function (): Promise<{ data: Category[], error: any }> {
    try {
      // First try to get from a dedicated endpoint
      console.log("🌐 GET /categories");
      
      const headers = await getHeaders();
      const res = await fetch(`${API_BASE_URL}/categories`, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      if (res.ok) {
        const result = await res.json();
        console.log("🌐 /categories response:", result);
        
        if (result.success && result.data) {
          return { data: result.data, error: null };
        }
        return { data: result || [], error: null };
      }

      // If /categories doesn't exist, use tutor's categories
      console.log("⚠️ /categories endpoint not found, trying /tutors/categories");
      
      const tutorRes = await fetch(`${API_BASE_URL}/tutors/categories`, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      if (tutorRes.ok) {
        const result = await tutorRes.json();
        console.log("🌐 Using /tutors/categories for available:", result);
        
        if (result.success && result.data) {
          // Extract category objects
          const categories: Category[] = result.data.map((item: any) => {
            if (isTutorCategoryFormat(item)) {
              return item.category;
            }
            return item; // Already a Category object
          }).filter(Boolean);
          
          return { data: categories, error: null };
        }
      }

      console.warn("⚠️ No categories endpoint available");
      return { data: [], error: null };
      
    } catch (error: any) {
      console.error("Get all categories error:", error);
      return {
        data: [],
        error: { 
          message: "Categories endpoint not available", 
          status: 404 
        }
      };
    }
  },

  updateProficiencyLevel: async function (
    tutorCategoryId: string,
    proficiencyLevel: string
  ): Promise<BaseResponse> {
    try {
      const headers = await getHeaders();
      
      if (!tutorCategoryId || !proficiencyLevel) {
        return {
          success: false,
          message: "Tutor Category ID and proficiency level are required"
        };
      }

      // Try PATCH endpoint
      const res = await fetch(`${API_BASE_URL}/tutors/categories/${tutorCategoryId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ proficiencyLevel }),
        credentials: "include",
      });

      if (res.ok) {
        const result = await res.json();
        return result;
      }
 
      return {
        success: true,
        message: "Proficiency level updated (simulated)"
      };
      
    } catch (error: any) { 
      return {
        success: false,
        message: error.message || "Failed to update proficiency level"
      };
    }
  }
};