'use client';

import React, { useState, useEffect } from 'react';
import { TutorCard } from './TutorCard';
import { 
  Loader2, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Grid, 
  List,
  Users,
  Search,
  ChevronRight
} from 'lucide-react';
import { homePageService } from '@/services/homePage.service';
import { TutorProfileModal } from './TutorProfileModal';

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

interface TutorSearchBarProps {
  categories: Category[];
  onSearch: (filters: SearchFilters) => void;
  isLoading?: boolean;
}

const TutorSearchBar: React.FC<TutorSearchBarProps> = ({
  categories,
  onSearch,
  isLoading = false
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    category: '',
    minRating: '',
    minPrice: '',
    maxPrice: ''
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleInputChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      category: '',
      minRating: '',
      minPrice: '',
      maxPrice: ''
    };
    setFilters(clearedFilters);
    onSearch(clearedFilters);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Search tutors by name, subject, or expertise..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-input bg-popover text-popover-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              value={filters.search}
              onChange={(e) => handleInputChange('search', e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(e);
                }
              }}
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground font-semibold rounded-xl transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                Searching...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Find Tutors
              </>
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          <Filter className="w-4 h-4" />
          {showAdvancedFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        {showAdvancedFilters && (
          <div className="bg-popover rounded-xl p-4 border border-border space-y-4 animate-in fade-in-50">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-card-foreground">Advanced Filters</h3>
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-muted-foreground hover:text-card-foreground flex items-center gap-1"
              >
                Clear all
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Subject
                </label>
                <select
                  className="w-full px-3 py-2 rounded-lg border border-input bg-popover text-popover-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  value={filters.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                >
                  <option value="">All Subjects</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Minimum Rating
                </label>
                <select
                  className="w-full px-3 py-2 rounded-lg border border-input bg-popover text-popover-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  value={filters.minRating}
                  onChange={(e) => handleInputChange('minRating', e.target.value)}
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                  <option value="3.0">3.0+ Stars</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Price Range ($/hour)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    min="0"
                    step="10"
                    className="w-1/2 px-3 py-2 rounded-lg border border-input bg-popover text-popover-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    value={filters.minPrice}
                    onChange={(e) => handleInputChange('minPrice', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    min="0"
                    step="10"
                    className="w-1/2 px-3 py-2 rounded-lg border border-input bg-popover text-popover-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    value={filters.maxPrice}
                    onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Searching...' : 'Apply Filters'}
              </button>
              <button
                type="button"
                onClick={clearFilters}
                className="px-4 py-2 border border-input hover:border-border text-card-foreground font-medium rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export const AllTutor: React.FC = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: 'math', name: 'Mathematics' },
    { id: 'science', name: 'Science' },
    { id: 'programming', name: 'Programming' },
    { id: 'languages', name: 'Languages' },
    { id: 'business', name: 'Business' },
    { id: 'arts', name: 'Arts' },
    { id: 'music', name: 'Music' },
    { id: 'test-prep', name: 'Test Prep' }
  ]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'experience'>('rating');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [selectedTutorId, setSelectedTutorId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadTutors();
  }, []);

  const loadTutors = async (filters?: SearchFilters) => {
    setLoading(true);
    try {
      const searchParams: any = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: sortBy === 'rating' ? 'rating' : 
                sortBy === 'price' ? 'hourlyRate' : 'experienceYears',
        sortOrder
      };

      if (filters) {
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
      }

      const result = await homePageService.browseTutors(searchParams);
      
      if (result.success && result.data) {
        setTutors(result.data.tutors);
        setPagination(result.data.pagination);
      } else {
        setTutors([]);
      }
    } catch (error) {
      setTutors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (filters: SearchFilters) => {
    setPagination(prev => ({ ...prev, page: 1 }));
    loadTutors(filters);
  };

  const handleSort = (field: 'rating' | 'price' | 'experience') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    loadTutors();
  };

  const handleLoadMore = async () => {
    if (!pagination.hasNextPage || loading) return;

    setLoading(true);
    try {
      const nextPage = pagination.page + 1;
      const searchParams: any = {
        page: nextPage,
        limit: pagination.limit,
        sortBy: sortBy === 'rating' ? 'rating' : 
                sortBy === 'price' ? 'hourlyRate' : 'experienceYears',
        sortOrder
      };

      const result = await homePageService.browseTutors(searchParams);

      if (result.success && result.data) {
        setTutors(prev => [...prev, ...(result.data!.tutors as Tutor[])]);
        setPagination(result.data.pagination);
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

  const getSortLabel = () => {
    switch (sortBy) {
      case 'rating': return 'Rating';
      case 'price': return 'Price';
      case 'experience': return 'Experience';
      default: return 'Rating';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-card-foreground mb-2">
            All Expert Tutors
          </h1>
          <p className="text-muted-foreground">
            Browse {pagination.total} expert tutors
          </p>
        </div>

        <div className="mb-8">
          <TutorSearchBar
            categories={categories}
            onSearch={handleSearch}
            isLoading={loading}
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-card-foreground">
                {tutors.length} of {pagination.total} tutors
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
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

        {loading && tutors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading tutors...</p>
          </div>
        ) : tutors.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Filter className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground mb-2">
              No tutors found
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Try adjusting your search filters or clear filters to see all tutors
            </p>
            <button
              onClick={() => handleSearch({} as SearchFilters)}
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
              {tutors.map((tutor) => (
                <TutorCard
                  key={tutor.id}
                  tutor={tutor}
                  compact={viewMode === 'list'}
                  onViewProfile={handleViewProfile}
                />
              ))}
            </div>

            {pagination.hasNextPage && (
              <div className="text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-8 py-3 border border-input hover:border-primary text-primary hover:bg-primary/10 rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <ChevronRight className="w-4 h-4" />
                      Load More Tutors ({pagination.total - tutors.length} more)
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}

        {tutors.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-card-foreground">
                  {pagination.total}
                </div>
                <div className="text-sm text-muted-foreground">Total Tutors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-card-foreground">
                  {Math.round(tutors.reduce((sum, tutor) => sum + tutor.rating, 0) / tutors.length * 10) / 10}
                </div>
                <div className="text-sm text-muted-foreground">Avg. Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-card-foreground">
                  ${Math.round(tutors.reduce((sum, tutor) => sum + tutor.hourlyRate, 0) / tutors.length)}
                </div>
                <div className="text-sm text-muted-foreground">Avg. Hourly Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-card-foreground">
                  {tutors.filter(t => (t.experienceYears || 0) >= 5).length}
                </div>
                <div className="text-sm text-muted-foreground">Expert Tutors (5+ yrs)</div>
              </div>
            </div>
          </div>
        )}
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