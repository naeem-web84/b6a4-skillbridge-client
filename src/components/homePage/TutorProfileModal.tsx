'use client';

import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Clock, 
  Award, 
  BookOpen, 
  Users,
  Calendar,
  X,
  Shield,
  CheckCircle,
  ChevronLeft,
  LogIn
} from 'lucide-react';
import { homePageService } from '@/services/homePage.service';
import { useRouter } from 'next/navigation';

interface TutorCategory {
  id: string;
  name: string;
  description?: string | null;
}

interface Tutor {
  id: string;
  userId: string;
  name: string;
  email?: string;
  image?: string | null;
  headline: string;
  bio?: string;
  hourlyRate: number;
  rating: number;
  totalReviews: number;
  experienceYears?: number;
  education?: string;
  certifications?: string[] | string | null;
  completedSessions?: number;
  categories?: TutorCategory[];
  createdAt?: string;
  updatedAt?: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  student: {
    id: string;
    name: string;
    image?: string | null;
    grade?: string | null;
  };
}

interface TutorProfile extends Tutor {
  reviews: Review[];
  statistics: {
    totalStudents: number;
    totalSessions: number;
    availableSlots: number;
    completedSessions: number;
  };
}

interface TutorProfileModalProps {
  tutorId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const TutorProfileModal: React.FC<TutorProfileModalProps> = ({
  tutorId,
  isOpen,
  onClose
}) => {
  const router = useRouter();
  const [tutor, setTutor] = useState<TutorProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (isOpen && tutorId) {
      fetchTutorProfile();
    } else {
      setTutor(null);
      setActiveTab('overview');
      setImageError(false);
    }
  }, [isOpen, tutorId]);

  const fetchTutorProfile = async () => {
    setLoading(true);
    try {
      const result = await homePageService.getTutorProfile(tutorId);
      if (result.success && result.data) {
        const processedData = {
          ...result.data,
          certifications: safeCertificationsArray(result.data.certifications)
        };
        setTutor(processedData);
      } else {
        setTutor({
          id: tutorId,
          userId: '',
          name: 'Tutor Profile',
          headline: 'Available for tutoring',
          hourlyRate: 0,
          rating: 0,
          totalReviews: 0,
          reviews: [],
          statistics: {
            totalStudents: 0,
            totalSessions: 0,
            availableSlots: 0,
            completedSessions: 0
          },
          categories: []
        } as TutorProfile);
      }
    } catch (error) {
      setTutor({
        id: tutorId,
        userId: '',
        name: 'Tutor Profile',
        headline: 'Available for tutoring',
        hourlyRate: 0,
        rating: 0,
        totalReviews: 0,
        reviews: [],
        statistics: {
          totalStudents: 0,
          totalSessions: 0,
          availableSlots: 0,
          completedSessions: 0
        },
        categories: []
      } as TutorProfile);
    } finally {
      setLoading(false);
    }
  };

  const safeCertificationsArray = (certifications: any): string[] => {
    if (!certifications) return [];
    if (Array.isArray(certifications)) return certifications;
    if (typeof certifications === 'string') {
      try {
        const parsed = JSON.parse(certifications);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        if (certifications.includes(',')) {
          return certifications.split(',').map((cert: string) => cert.trim());
        }
        return [certifications];
      }
    }
    return [];
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const starSize = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5'
    }[size];

    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${starSize} ${
              i < Math.floor(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-muted text-muted'
            }`}
          />
        ))}
      </div>
    );
  };

  const getAvatarUrl = () => {
    if (!tutor) return '';
    if (tutor.image && !imageError) {
      return tutor.image;
    }
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(tutor?.name || 'Tutor')}&backgroundColor=3b82f6&textColor=ffffff`;
  };

  const handleBookSession = () => {
    router.push('/login?redirect=/dashboard');
  };

  const handleLogin = () => {
    router.push(`/login?redirect=/tutors/${tutorId}`);
  };

  const getCertifications = () => {
    if (!tutor) return [];
    if (!tutor.certifications) return [];
    if (Array.isArray(tutor.certifications)) return tutor.certifications;
    return [];
  };

  const getCategories = () => {
    if (!tutor) return [];
    if (!tutor.categories) return [];
    if (Array.isArray(tutor.categories)) return tutor.categories;
    return [];
  };

  const getReviews = () => {
    if (!tutor) return [];
    if (!tutor.reviews) return [];
    if (Array.isArray(tutor.reviews)) return tutor.reviews;
    return [];
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 overflow-y-auto">
        <div 
          className="bg-background rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-border bg-card/50 backdrop-blur-sm">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-muted-foreground hover:text-card-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-muted"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-muted-foreground">Loading tutor profile...</p>
              </div>
            ) : tutor ? (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-card rounded-2xl p-6 border border-border">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-card shadow-lg">
                          <img
                            src={getAvatarUrl()}
                            alt={tutor.name}
                            className="w-full h-full object-cover"
                            onError={() => setImageError(true)}
                          />
                        </div>
                        {tutor.experienceYears && tutor.experienceYears >= 5 && (
                          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                            <div className="bg-yellow-500 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                              <Award className="w-3 h-3" />
                              Verified Expert
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div>
                            <h1 className="text-3xl font-bold text-card-foreground mb-2">
                              {tutor.name}
                            </h1>
                            <h2 className="text-lg text-muted-foreground mb-4">
                              {tutor.headline}
                            </h2>
                            
                            <div className="flex items-center gap-4 mb-4">
                              <div className="flex items-center gap-2">
                                {renderStars(tutor.rating, 'lg')}
                                <span className="font-bold text-lg text-card-foreground">
                                  {tutor.rating.toFixed(1)}
                                </span>
                                <span className="text-muted-foreground">
                                  ({tutor.totalReviews} reviews)
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  {tutor.statistics?.totalStudents || 0} students
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-3xl font-bold text-card-foreground">
                              ${tutor.hourlyRate.toFixed(0)}
                            </div>
                            <div className="text-sm text-muted-foreground">per hour</div>
                          </div>
                        </div>

                        {getCategories().length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {getCategories().map((category) => (
                              <span
                                key={category.id}
                                className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                              >
                                {category.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-border">
                    <nav className="flex space-x-8">
                      {['overview', 'reviews'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`py-3 font-medium transition-colors relative ${
                            activeTab === tab
                              ? 'text-primary'
                              : 'text-muted-foreground hover:text-card-foreground'
                          }`}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                          {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                          )}
                        </button>
                      ))}
                    </nav>
                  </div>

                  <div className="space-y-8">
                    {activeTab === 'overview' && (
                      <>
                        <div className="bg-card rounded-xl p-6 border border-border">
                          <h3 className="text-xl font-bold text-card-foreground mb-4">
                            About {tutor.name.split(' ')[0]}
                          </h3>
                          <p className="text-muted-foreground whitespace-pre-line">
                            {tutor.bio || 'No bio available'}
                          </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="bg-card rounded-xl p-6 border border-border">
                            <h3 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
                              <Award className="w-5 h-5" />
                              Experience
                            </h3>
                            <div className="space-y-4">
                              <div>
                                <div className="font-medium text-card-foreground">
                                  {(tutor.experienceYears || 0)}+ years experience
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Professional tutoring
                                </div>
                              </div>
                              <div>
                                <div className="font-medium text-card-foreground">
                                  {(tutor.completedSessions || 0)}+ sessions completed
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  98% satisfaction rate
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-card rounded-xl p-6 border border-border">
                            <h3 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
                              <BookOpen className="w-5 h-5" />
                              Education
                            </h3>
                            {tutor.education ? (
                              <p className="text-muted-foreground">{tutor.education}</p>
                            ) : (
                              <p className="text-muted-foreground">
                                Information not provided
                              </p>
                            )}
                          </div>
                        </div>

                        {getCertifications().length > 0 && (
                          <div className="bg-card rounded-xl p-6 border border-border">
                            <h3 className="text-xl font-bold text-card-foreground mb-4">
                              Certifications
                            </h3>
                            <ul className="space-y-2">
                              {getCertifications().map((cert, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                  <span className="text-muted-foreground">{cert}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    )}

                    {activeTab === 'reviews' && (
                      <div className="space-y-6">
                        <div className="bg-card rounded-xl p-6 border border-border">
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-card-foreground">
                              Student Reviews ({getReviews().length})
                            </h3>
                            <div className="text-right">
                              <div className="text-3xl font-bold text-card-foreground">
                                {tutor.rating.toFixed(1)}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Average rating
                              </div>
                            </div>
                          </div>

                          <div className="space-y-6">
                            {getReviews().length > 0 ? (
                              getReviews().slice(0, 5).map((review) => (
                                <div key={review.id} className="pb-6 border-b border-border last:border-0 last:pb-0">
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        {review.student.image ? (
                                          <img
                                            src={review.student.image}
                                            alt={review.student.name}
                                            className="w-full h-full rounded-full object-cover"
                                            onError={(e) => {
                                              const target = e.target as HTMLImageElement;
                                              target.style.display = 'none';
                                              const parent = target.parentElement;
                                              if (parent) {
                                                const fallback = document.createElement('span');
                                                fallback.className = 'text-primary font-semibold';
                                                fallback.textContent = review.student.name?.charAt(0) || 'S';
                                                parent.appendChild(fallback);
                                              }
                                            }}
                                          />
                                        ) : (
                                          <span className="text-primary font-semibold">
                                            {review.student.name?.charAt(0) || 'S'}
                                          </span>
                                        )}
                                      </div>
                                      <div>
                                        <div className="font-medium text-card-foreground">
                                          {review.student.name || 'Anonymous'}
                                        </div>
                                        {review.student.grade && (
                                          <div className="text-xs text-muted-foreground">
                                            Grade {review.student.grade}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="flex items-center gap-1">
                                        {renderStars(review.rating, 'sm')}
                                        <span className="font-medium text-card-foreground">
                                          {review.rating.toFixed(1)}
                                        </span>
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                      </div>
                                    </div>
                                  </div>
                                  <p className="text-muted-foreground">
                                    {review.comment || 'No comment provided'}
                                  </p>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-8">
                                <p className="text-muted-foreground">No reviews yet</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-card rounded-2xl p-6 border border-border sticky top-6">
                    <h3 className="text-xl font-bold text-card-foreground mb-6">
                      Book a Session
                    </h3>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-card-foreground">
                            {tutor.statistics?.availableSlots || 0} slots available
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Next 30 days
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <Clock className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <div className="font-medium text-card-foreground">
                            Flexible scheduling
                          </div>
                          <div className="text-sm text-muted-foreground">
                            24/7 availability
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                          <Shield className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                          <div className="font-medium text-card-foreground">
                            Payment protection
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Secure & reliable
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <button
                        onClick={handleBookSession}
                        className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Calendar className="w-5 h-5" />
                        Book Session
                      </button>
                    </div>

                    <div className="mt-6 pt-6 border-t border-border text-center">
                      <div className="text-xs text-muted-foreground mb-2">
                        <Shield className="w-3 h-3 inline mr-1" />
                        Secure payment • 24-hour cancellation
                      </div>
                      <button
                        onClick={handleLogin}
                        className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors mt-2"
                      >
                        <LogIn className="w-4 h-4" />
                        Login to book this tutor
                      </button>
                    </div>
                  </div>

                  <div className="bg-card rounded-2xl p-6 border border-border">
                    <h3 className="text-lg font-bold text-card-foreground mb-4">
                      Session Stats
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Total Students</span>
                        <span className="font-bold text-card-foreground">
                          {tutor.statistics?.totalStudents || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Sessions Completed</span>
                        <span className="font-bold text-card-foreground">
                          {tutor.statistics?.totalSessions || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Response Rate</span>
                        <span className="font-bold text-card-foreground">98%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Member Since</span>
                        <span className="font-bold text-card-foreground">
                          {tutor.createdAt ? new Date(tutor.createdAt).getFullYear() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground">Failed to load tutor profile</p>
                <button
                  onClick={onClose}
                  className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TutorProfileModal;