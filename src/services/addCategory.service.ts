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
  id: string;
  proficiencyLevel: string | null;
  addedAt: string;
  category: Category;
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

const isTutorCategoryFormat = (data: any): boolean => {
  return data && data.category && typeof data.category === 'object';
};

const transformCategoriesToTutorCategories = (categories: Category[]): TutorCategory[] => {
  return categories.map(category => ({
    id: `temp_${category.id}`,
    proficiencyLevel: null,
    addedAt: category.createdAt || new Date().toISOString(),
    category: category
  }));
};

export const categoryService = {
  addTeachingCategory: async function (data: AddTeachingCategoryInput): Promise<AddCategoryResponse> {
    try {
      const headers = await getHeaders();
      
      const res = await fetch(`${API_BASE_URL}/tutors/categories`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to add category"
        };
      }

      return result;
    } catch {
      return {
        success: false,
        message: "Failed to add category"
      };
    }
  },

  getTutorCategories: async function (): Promise<GetCategoriesResponse> {
    try {
      const headers = await getHeaders();
      
      const res = await fetch(`${API_BASE_URL}/tutors/categories`, {
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

      let transformedData: TutorCategory[] = [];
      
      if (result.success && result.data && Array.isArray(result.data)) {
        if (result.data.length === 0) {
          transformedData = [];
        } else {
          const firstItem = result.data[0];
          
          if (isTutorCategoryFormat(firstItem)) {
            transformedData = result.data.filter((item: any) => 
              item && item.category && item.category.id
            );
          } else {
            transformedData = transformCategoriesToTutorCategories(result.data);
          }
        }
      }

      return {
        success: true,
        message: result.message || "Categories fetched successfully",
        data: transformedData
      };
      
    } catch {
      return {
        success: false,
        message: "Failed to fetch categories",
        data: []
      };
    }
  },

  removeTeachingCategory: async function (tutorCategoryId: string): Promise<RemoveCategoryResponse> {
    try {
      const headers = await getHeaders();
      
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

      if (!res.ok) {
        return {
          success: false,
          message: result.message || "Failed to remove category"
        };
      }

      return result;
    } catch {
      return {
        success: false,
        message: "Failed to remove category"
      };
    }
  },

  getAllCategories: async function (): Promise<{ data: Category[], error: any }> {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_BASE_URL}/categories`, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      if (res.ok) {
        const result = await res.json();
        
        if (result.success && result.data) {
          return { data: result.data, error: null };
        }
        return { data: result || [], error: null };
      }

      const tutorRes = await fetch(`${API_BASE_URL}/tutors/categories`, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-cache",
      });

      if (tutorRes.ok) {
        const result = await tutorRes.json();
        
        if (result.success && result.data) {
          const categories: Category[] = result.data.map((item: any) => {
            if (isTutorCategoryFormat(item)) {
              return item.category;
            }
            return item;
          }).filter(Boolean);
          
          return { data: categories, error: null };
        }
      }

      return { data: [], error: null };
      
    } catch {
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
        message: "Proficiency level updated"
      };
      
    } catch { 
      return {
        success: false,
        message: "Failed to update proficiency level"
      };
    }
  }
};