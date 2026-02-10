 
import TutorProfilePage from '@/components/homePage/TutorProfilePage';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    id: string;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function to transform API data
const transformTutorData = (apiTutor: any) => {
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
    updatedAt: apiTutor.updatedAt,
    reviews: apiTutor.reviews || [],
    statistics: apiTutor.statistics || {
      totalStudents: 0,
      totalSessions: 0,
      availableSlots: 0,
      completedSessions: 0
    }
  };
};

async function getTutorProfile(tutorId: string) {
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
      throw new Error(`Failed to fetch tutor: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    
    if (!data.success) {
      console.error('API error:', data.message);
      return null;
    }

    return transformTutorData(data.data);
  } catch (error) {
    console.error('Error fetching tutor profile:', error);
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
      title: 'Tutor Not Found',
    };
  }

  return {
    title: `${tutorData.name} - Expert Tutor | SkillBridge`,
    description: tutorData.headline,
    keywords: tutorData.categories?.map(cat => cat.name).join(', ') || '',
    openGraph: {
      title: `${tutorData.name} - Expert Tutor`,
      description: tutorData.headline,
      images: tutorData.image ? [tutorData.image] : [],
    },
  };
}