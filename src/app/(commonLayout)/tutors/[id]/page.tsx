import TutorProfilePage from '@/components/homePage/TutorProfilePage';
import { notFound } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  description?: string | null;
}

interface Student {
  id: string;
  name: string;
  image?: string | null;
  grade?: string | null;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  userName: string;
  userImage?: string | null;
  createdAt: string;
  student: Student;
}

interface TutorStatistics {
  totalStudents: number;
  totalSessions: number;
  availableSlots: number;
  completedSessions: number;
}

interface TutorData {
  id: string;
  userId: string;
  name: string;
  email?: string;
  image?: string | null;
  headline: string;
  bio: string;
  hourlyRate: number;
  rating: number;
  totalReviews: number;
  experienceYears: number;
  education?: string;
  certifications: string[];
  completedSessions: number;
  categories: Category[];
  recentReviews: Review[];
  createdAt?: string;
  updatedAt?: string;
  reviews: Review[];
  statistics: TutorStatistics;
}

interface PageProps {
  params: {
    id: string;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const transformTutorData = (apiTutor: any): TutorData => {
  const transformReview = (review: any): Review => ({
    id: review.id || '',
    rating: review.rating || 0,
    comment: review.comment || '',
    userId: review.userId || review.user?.id || '',
    userName: review.userName || review.user?.name || 'Student',
    userImage: review.userImage || review.user?.image || null,
    createdAt: review.createdAt || new Date().toISOString(),
    student: {
      id: review.student?.id || review.userId || review.user?.id || '',
      name: review.student?.name || review.userName || review.user?.name || 'Student',
      image: review.student?.image || review.userImage || review.user?.image || null,
      grade: review.student?.grade || null
    }
  });

  const formatEducation = (edu: any): string | undefined => {
    if (!edu) return undefined;
    if (typeof edu === 'string') return edu;
    if (edu.degree && edu.institution) {
      return `${edu.degree} from ${edu.institution}`;
    }
    return undefined;
  };

  const formatCertifications = (certs: any[]): string[] => {
    if (!certs || !Array.isArray(certs)) return [];
    return certs.map(cert => {
      if (typeof cert === 'string') return cert;
      if (cert.name) return cert.name;
      return JSON.stringify(cert);
    });
  };

  const formatCategories = (cats: any[]): Category[] => {
    if (!cats || !Array.isArray(cats)) return [];
    return cats.map((cat: any): Category => ({
      id: cat.id || `temp-${Date.now()}-${Math.random()}`,
      name: cat.name || cat || 'Uncategorized',
      description: cat.description || null
    }));
  };

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
    education: formatEducation(apiTutor.education),
    certifications: formatCertifications(apiTutor.certifications),
    completedSessions: apiTutor.completedSessions || 0,
    categories: formatCategories(apiTutor.categories),
    recentReviews: (apiTutor.recentReviews || []).map(transformReview),
    createdAt: apiTutor.createdAt,
    updatedAt: apiTutor.updatedAt,
    reviews: (apiTutor.reviews || []).map(transformReview),
    statistics: apiTutor.statistics || {
      totalStudents: 0,
      totalSessions: 0,
      availableSlots: 0,
      completedSessions: 0
    }
  };
};

async function getTutorProfile(tutorId: string): Promise<TutorData | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/tutors/public/${tutorId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      cache: 'no-store',
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch tutor: ${res.status}`);
    }

    const data = await res.json();
    
    if (!data.success) {
      return null;
    }

    return transformTutorData(data.data);
  } catch {
    return null;
  }
}

export default async function TutorProfileRoute({ params }: PageProps) {
  const tutorId = params.id;
  
  if (!tutorId) {
    notFound();
  }

  const tutorData = await getTutorProfile(tutorId);
  
  if (!tutorData) {
    notFound();
  }

  return <TutorProfilePage initialTutor={tutorData} />;
}

export async function generateMetadata({ params }: PageProps) {
  const tutorData = await getTutorProfile(params.id);
  
  if (!tutorData) {
    return {
      title: 'Tutor Not Found | SkillBridge',
    };
  }

  return {
    title: `${tutorData.name} - Expert Tutor | SkillBridge`,
    description: tutorData.headline,
    keywords: tutorData.categories?.map((cat: Category) => cat.name).join(', ') || '',
    openGraph: {
      title: `${tutorData.name} - Expert Tutor`,
      description: tutorData.headline,
      images: tutorData.image ? [tutorData.image] : [],
    },
  };
}