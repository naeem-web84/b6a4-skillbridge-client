'use client';

import React, { useState, useEffect } from 'react';
import { TutorSearchBar } from './TutorSearchBar';
import { TutorCard } from './TutorCard'; 
import { Loader2, Filter, SortAsc, SortDesc, Grid, List, Search, ChevronRight } from 'lucide-react';
import { homePageService } from '@/services/homePage.service';
import { useRouter } from 'next/navigation';
import TutorProfileModal from './TutorProfileModal';

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

interface SearchFilters {
  search: string;
  category: string;
  minRating: string;
  minPrice: string;
  maxPrice: string;
}

interface TutorSearchResultsProps {
  initialTutors?: Tutor[];
  initialCategories?: Category[];
}

export const TutorSearchResults: React.FC<TutorSearchResultsProps> = ({
  initialTutors = [],
  initialCategories = []
}) => {
  const router = useRouter();
  const [allTutors, setAllTutors] = useState<Tutor[]>(initialTutors);
  const [searchResults, setSearchResults] = useState<Tutor[]>([]);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'experience'>('rating');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedTutorId, setSelectedTutorId] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialCategories.length === 0) {
      fetchCategories();
    }
  }, []);

  const fetchCategories = async () => {
    try {
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
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = async (filters: SearchFilters) => {
    setSearching(true);
    setHasSearched(true);
    console.log('🔍 Searching with filters:', filters);
    
    try {
      const searchParams: any = {
        page: 1,
        limit: 12,
        sortBy: sortBy === 'rating' ? 'rating' : 
                sortBy === 'price' ? 'hourlyRate' : 'experienceYears',
        sortOrder
      };

      // Add filters only if they have values
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

      console.log('📤 API search params:', searchParams);

      const result = await homePageService.browseTutors(searchParams);
      console.log('📥 Search result:', result);
      
      if (result.success && result.data) {
        setSearchResults(result.data.tutors);
        setPagination(result.data.pagination);
        console.log(`✅ Found ${result.data.tutors.length} search results`);
      } else {
        console.error('❌ Search failed:', result.message);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('💥 Error searching tutors:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSort = (field: 'rating' | 'price' | 'experience') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    // Trigger search with new sort
    handleSearch({} as SearchFilters);
  };

  const handleLoadMore = async () => {
    if (!pagination.hasNextPage || loading) return;

    setLoading(true);
    try {
      const nextPage = pagination.page + 1;
      const result = await homePageService.browseTutors({
        page: nextPage,
        limit: pagination.limit,
        sortBy: sortBy === 'rating' ? 'rating' : 
                sortBy === 'price' ? 'hourlyRate' : 'experienceYears',
        sortOrder
      });

      if (result.success && result.data) {
        setAllTutors(prev => [...prev, ...(result.data!.tutors as Tutor[])]);
        setPagination(result.data.pagination);
      }
    } catch (error) {
      console.error('Error loading more tutors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (tutorId: string) => {
    setSelectedTutorId(tutorId);
  };

  const handleCloseModal = () => {
    setSelectedTutorId(null);
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'rating': return 'Rating';
      case 'price': return 'Price';
      case 'experience': return 'Experience';
      default: return 'Rating';
    }
  };

  const handleViewAllTutors = () => {
    router.push('/tutors/all-tutor');
  };

  const handleViewAllSearchResults = () => {
    router.push('/tutors/all-tutor');
  };

  const displayedTutors = hasSearched ? searchResults : allTutors;
  const isShowingSearchResults = hasSearched && searchResults.length > 0;
  const isShowingAllTutors = !hasSearched || (hasSearched && searchResults.length === 0);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-card-foreground mb-2">
          Find Your Perfect Tutor
        </h1>
        <p className="text-muted-foreground">
          Browse {pagination.total} expert tutors and book sessions instantly
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <TutorSearchBar
          categories={categories}
          onSearch={handleSearch}
          isLoading={searching}
        />
      </div>

      {/* Search Results Section */}
      {isShowingSearchResults && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold text-card-foreground">
                Search Results ({searchResults.length})
              </h2>
            </div>
            <button
              onClick={handleViewAllTutors}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              View All Tutors
            </button>
          </div>

          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {searchResults.map((tutor) => (
              <TutorCard
                key={tutor.id}
                tutor={tutor}
                compact={viewMode === 'list'}
                onViewProfile={() => handleViewProfile(tutor.id)}
              />
            ))}
          </div>
          
          <div className="text-center mt-6">
            <button
              onClick={handleViewAllSearchResults}
              className="inline-flex items-center gap-2 px-6 py-2 border border-primary text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              View All Search Results
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Browse All Tutors Section */}
      {isShowingAllTutors && (
        <div>
          {/* Results Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-card-foreground">
                Browse All Tutors
              </h2>
              <span className="text-sm text-muted-foreground">
                {allTutors.length} of {pagination.total} tutors
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* View Toggle */}
              <div className="flex items-center gap-1 border border-input rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-card-foreground'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-card-foreground'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => handleSort(sortBy)}
                  className="flex items-center gap-2 px-4 py-2 border border-input rounded-lg text-card-foreground hover:border-border transition-colors"
                >
                  <span className="text-sm">Sort by: {getSortLabel()}</span>
                  {sortOrder === 'asc' ? (
                    <SortAsc className="w-4 h-4" />
                  ) : (
                    <SortDesc className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* All Tutors Results */}
          {loading && allTutors.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : allTutors.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <Filter className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">
                No tutors found
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Try adjusting your search filters
              </p>
              <button
                onClick={() => router.push('/tutors/all-tutor')}
                className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
              >
                View All Tutors
              </button>
            </div>
          ) : (
            <>
              <div className={`grid gap-6 mb-8 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {allTutors.map((tutor) => (
                  <TutorCard
                    key={tutor.id}
                    tutor={tutor}
                    compact={viewMode === 'list'}
                    onViewProfile={() => handleViewProfile(tutor.id)}
                  />
                ))}
              </div>

              {/* Load More */}
              {pagination.hasNextPage && (
                <div className="text-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="px-8 py-3 border border-input hover:border-primary text-primary hover:bg-primary/10 rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      'Load More Tutors'
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* No Search Results Message */}
      {hasSearched && searchResults.length === 0 && (
        <div className="text-center py-20">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <Search className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-card-foreground mb-2">
            No tutors found matching your search
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Try different keywords or filters
          </p>
          <button
            onClick={() => router.push('/tutors/all-tutor')}
            className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
          >
            View All Tutors
          </button>
        </div>
      )}

      {/* Profile Modal */}
      {selectedTutorId && (
        <TutorProfileModal
          tutorId={selectedTutorId}
          isOpen={!!selectedTutorId}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};