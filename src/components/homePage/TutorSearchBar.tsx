// components/tutors/TutorSearchBar.tsx
'use client';

import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

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

export const TutorSearchBar: React.FC<TutorSearchBarProps> = ({
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
    console.log('🔍 Search filters submitted:', filters);
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
        {/* Main Search */}
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

        {/* Advanced Filters Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          <Filter className="w-4 h-4" />
          {showAdvancedFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="bg-popover rounded-xl p-4 border border-border space-y-4 animate-in fade-in-50">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-card-foreground">Advanced Filters</h3>
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-muted-foreground hover:text-card-foreground flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear all
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
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

              {/* Rating Filter */}
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

              {/* Price Range Filter */}
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

            {/* Action Buttons */}
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