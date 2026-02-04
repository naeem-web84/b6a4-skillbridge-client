/* Tutor Profile Types */
export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface TutorCategoryInput {
  categoryId: string;
  proficiencyLevel?: string;
}

export interface CreateTutorProfileInput {
  headline: string;
  bio?: string;
  hourlyRate: number;
  experienceYears: number;
  education?: string;
  certifications?: string;
  categories?: TutorCategoryInput[];
}

export interface TutorProfile {
  id: string;
  userId: string;
  headline: string;
  bio?: string;
  hourlyRate: number;
  experienceYears: number;
  education?: string;
  certifications?: string;
  rating: number;
  totalReviews: number;
  completedSessions: number;
  categories: {
    id: string;
    proficiencyLevel?: string;
    category: Category;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EligibilityCheckResponse {
  canBecome: boolean;
  message?: string;
}

export interface TutorProfileResponse {
  success: boolean;
  message?: string;
  tutorProfile?: TutorProfile;
}

export interface CategoriesResponse {
  success: boolean;
  categories: Category[];
  message?: string;
}