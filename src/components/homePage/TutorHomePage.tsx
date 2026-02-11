'use client';

import React, { useState, useEffect } from 'react';
import { TutorCard } from './TutorCard';
import { 
  Star, 
  Award, 
  Clock, 
  Users, 
  TrendingUp,
  ChevronRight,
  Sparkles,
  Shield,
  Search,
  Filter
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { homePageService } from '@/services/homePage.service';
import { TutorProfileModal } from './TutorProfileModal'; 
import { QuickMatchQuiz } from './QuickMatchQuiz';

type Tutor = {
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
  certifications?: string[];
  completedSessions?: number;
  categories?: Array<{
    id: string;
    name: string;
    description?: string | null;
  }>;
};

interface Category {
  id: string;
  name: string;
}

interface Stats {
  totalTutors: number;
  totalSessions: number;
  avgRating: number;
  studentSatisfaction: number;
}

interface SearchFilters {
  search: string;
  category: string;
  minRating: string;
  minPrice: string;
  maxPrice: string;
}

export const TutorHomePage = () => {
  const router = useRouter();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [searchResults, setSearchResults] = useState<Tutor[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalTutors: 0,
    totalSessions: 0,
    avgRating: 4.8,
    studentSatisfaction: 98
  });
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedTutorId, setSelectedTutorId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const allResult = await homePageService.browseTutors({
        page: 1,
        limit: 8,
        sortBy: 'rating',
        sortOrder: 'desc'
      });
      if (allResult.success && allResult.data) {
        setTutors(allResult.data.tutors);
        setStats(prev => ({
          ...prev,
          totalTutors: allResult.data?.pagination.total || 0
        }));
      }

      setCategories([
        { id: 'math', name: 'Mathematics' },
        { id: 'science', name: 'Science' },
        { id: 'programming', name: 'Programming' },
        { id: 'languages', name: 'Languages' },
        { id: 'business', name: 'Business' },
        { id: 'arts', name: 'Arts' },
        { id: 'music', name: 'Music' },
        { id: 'test-prep', name: 'Test Prep' }
      ]);

    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (filters: SearchFilters) => {
    setSearching(true);
    setHasSearched(true);
    
    try {
      const searchParams: any = {
        page: 1,
        limit: 4,
        sortBy: 'rating',
        sortOrder: 'desc'
      };

      if (filters.search && filters.search.trim()) {
        searchParams.search = filters.search.trim();
      }
      if (filters.category && filters.category.trim()) {
        searchParams.category = filters.category.trim();
      }
      if (filters.minRating && filters.minRating.trim()) {
        searchParams.minRating = parseFloat(filters.minRating);
      }
      
      if (filters.minPrice && filters.minPrice.trim() && !isNaN(parseFloat(filters.minPrice))) {
        searchParams.minHourlyRate = parseFloat(filters.minPrice);
      }
      if (filters.maxPrice && filters.maxPrice.trim() && !isNaN(parseFloat(filters.maxPrice))) {
        searchParams.maxHourlyRate = parseFloat(filters.maxPrice);
      }

      const result = await homePageService.browseTutors(searchParams);
      
      if (result.success && result.data) {
        setSearchResults(result.data.tutors);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleCategoryClick = async (categoryId: string) => {
    setActiveCategory(categoryId);
    setLoading(true);
    try {
      const result = await homePageService.getTutorsByCategory(categoryId, 8);
      if (result.success && result.data) {
        setTutors(result.data.tutors);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (tutorId: string) => {
    setSelectedTutorId(tutorId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTutorId(null);
  };

  const handleViewAllTutors = () => {
    router.push('/tutors/all-tutor');
  };

  const handleClearSearch = () => {
    setHasSearched(false);
    setSearchResults([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden bg-gradient-to-br from-card to-secondary/30 dark:from-card dark:to-muted/30">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Trusted by 10,000+ students worldwide
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-card-foreground">
              Find Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600 dark:from-primary-foreground dark:to-purple-400">
                Perfect Tutor
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with expert tutors for personalized 1-on-1 learning. Achieve your learning goals.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-16">
          <QuickMatchQuiz onViewProfile={handleViewProfile}  />
        </div>

        {hasSearched && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold text-card-foreground">
                  Search Results ({searchResults.length})
                </h2>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleClearSearch}
                  className="text-sm text-muted-foreground hover:text-card-foreground transition-colors"
                >
                  Clear Search
                </button>
                {searchResults.length > 0 && (
                  <button
                    onClick={handleViewAllTutors}
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    View All Results
                  </button>
                )}
              </div>
            </div>

            {searching ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3 text-muted-foreground">Searching...</span>
              </div>
            ) : searchResults.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  {searchResults.slice(0, 4).map((tutor) => (
                    <TutorCard
                      key={tutor.id}
                      tutor={tutor}
                      onViewProfile={() => handleViewProfile(tutor.id)}
                    />
                  ))}
                </div>
                {searchResults.length > 4 && (
                  <div className="text-center">
                    <button
                      onClick={handleViewAllTutors}
                      className="px-6 py-2 border border-input hover:border-primary text-primary hover:bg-primary/10 rounded-lg transition-colors font-medium"
                    >
                      View All {searchResults.length} Results
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 border border-dashed border-border rounded-2xl">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-card-foreground mb-2">
                  No tutors found matching your search
                </h3>
                <p className="text-muted-foreground">
                  Try different keywords or filters
                </p>
              </div>
            )}
          </section>
        )}

        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-card-foreground mb-3">
              Browse by Subject
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find expert tutors in your favorite subjects
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
            <button
              onClick={() => handleCategoryClick('all')}
              className={`px-4 py-3 rounded-xl border transition-all ${
                activeCategory === 'all'
                  ? 'border-primary bg-primary/10 text-primary font-medium'
                  : 'border-border hover:border-primary/50 hover:bg-primary/5 text-card-foreground'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`px-4 py-3 rounded-xl border transition-all ${
                  activeCategory === category.id
                    ? 'border-primary bg-primary/10 text-primary font-medium'
                    : 'border-border hover:border-primary/50 hover:bg-primary/5 text-card-foreground'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-card rounded-xl p-6 animate-pulse border border-border">
                  <div className="h-40 bg-muted rounded-lg mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : tutors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tutors.map((tutor) => (
                <TutorCard
                  key={tutor.id}
                  tutor={tutor}
                  onViewProfile={() => handleViewProfile(tutor.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-border rounded-2xl">
              <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-card-foreground mb-2">
                No tutors in this category
              </h3>
              <p className="text-muted-foreground">
                Try selecting a different subject or view all tutors
              </p>
            </div>
          )}
          
          <div className="text-center mt-8">
            <button
              onClick={handleViewAllTutors}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-colors"
            >
              View All Tutors
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        <section className="mb-16">
          <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 dark:from-primary/10 dark:to-purple-500/10 border border-border rounded-3xl p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-card-foreground mb-4">
                Why Choose Our Platform
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Experience the difference with our student-first approach
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Verified Experts',
                  description: 'Every tutor undergoes strict verification with background checks and credential validation',
                  icon: Shield,
                  color: 'bg-blue-500/10 text-blue-500'
                },
                {
                  title: 'Quality Learning',
                  description: 'Personalized 1-on-1 sessions tailored to your learning style and goals',
                  icon: Award,
                  color: 'bg-green-500/10 text-green-500'
                },
                {
                  title: 'Progress Tracking',
                  description: 'Monitor your learning journey with detailed analytics and session feedback',
                  icon: TrendingUp,
                  color: 'bg-purple-500/10 text-purple-500'
                }
              ].map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-card-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="text-center">
          <div className="bg-gradient-to-r from-primary to-purple-600 rounded-3xl p-8 md:p-12 text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              Join thousands of students who have transformed their learning with our expert tutors
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleViewAllTutors}
                className="px-8 py-3 bg-white text-primary hover:bg-white/90 font-bold rounded-xl transition-colors"
              >
                Browse All Tutors
              </button>
              <button
                onClick={() => router.push('/login')}
                className="px-8 py-3 border-2 border-white text-white hover:bg-white/10 font-bold rounded-xl transition-colors"
              >
                Login to Book
              </button>
            </div>
          </div>
        </section>
      </div>

      {selectedTutorId && (
        <TutorProfileModal
          tutorId={selectedTutorId}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};