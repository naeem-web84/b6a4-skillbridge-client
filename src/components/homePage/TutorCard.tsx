'use client';

import React, { useState } from 'react';
import { Star, Clock, Award, BookOpen, Users, ChevronRight, LogIn } from 'lucide-react';

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
  certifications?: string[];
  completedSessions?: number;
  categories?: TutorCategory[];
}

interface TutorCardProps {
  tutor: Tutor;
  compact?: boolean;
  showActions?: boolean;
  onViewProfile?: (tutorId: string) => void;
}

export const TutorCard: React.FC<TutorCardProps> = ({ 
  tutor, 
  compact = false,
  showActions = true,
  onViewProfile
}) => {
  const [imageError, setImageError] = useState(false);

  const handleViewProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onViewProfile) {
      onViewProfile(tutor.id);
    } else {
      window.location.href = `/tutors/${tutor.id}`;
    }
  };

  const handleLoginRedirect = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    window.location.href = `/login?redirect=/dashboard`;
  };

  const renderStars = (rating: number, size: 'sm' | 'md' = 'md') => {
    const starSize = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4'
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
    if (tutor.image && !imageError && tutor.image !== 'null' && tutor.image !== 'undefined') {
      return tutor.image;
    }
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(tutor.name || 'Tutor')}&backgroundColor=3b82f6&textColor=ffffff`;
  };

  const getTutorName = () => tutor.name || 'Tutor';
  const getTutorHeadline = () => tutor.headline || 'Expert Tutor';
  const getTutorHourlyRate = () => tutor.hourlyRate || 0;
  const getTutorRating = () => tutor.rating || 0;
  const getTutorTotalReviews = () => tutor.totalReviews || 0;
  const getTutorExperienceYears = () => tutor.experienceYears || 0;
  const getTutorCompletedSessions = () => tutor.completedSessions || 0;
  const getTutorCategories = () => tutor.categories || [];
  const getTutorBio = () => tutor.bio || '';

  if (compact) {
    return (
      <div 
        className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer group hover:border-primary/30"
        onClick={handleViewProfile}
      >
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10">
              <img
                src={getAvatarUrl()}
                alt={getTutorName()}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            </div>
            {getTutorExperienceYears() >= 5 && (
              <div className="absolute -top-1 -right-1">
                <div className="bg-yellow-500 text-yellow-900 text-xs font-bold px-1 py-0.5 rounded-full">
                  <Award className="w-3 h-3" />
                </div>
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-card-foreground truncate group-hover:text-primary transition-colors">
              {getTutorName()}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {getTutorHeadline()}
            </p>
            <div className="flex items-center gap-2 mt-1">
              {renderStars(getTutorRating(), 'sm')}
              <span className="text-sm font-medium text-card-foreground">
                {getTutorRating().toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">
                ({getTutorTotalReviews()})
              </span>
            </div>
          </div>
          
          <div className="text-right flex-shrink-0">
            <div className="font-bold text-lg text-card-foreground">
              ${getTutorHourlyRate().toFixed(0)}
            </div>
            <div className="text-xs text-muted-foreground">/hour</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
      {/* Header with Avatar and Info */}
      <div 
        className="flex items-start gap-4 mb-4 cursor-pointer"
        onClick={handleViewProfile}
      >
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-card shadow-md bg-primary/10">
            <img
              src={getAvatarUrl()}
              alt={getTutorName()}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          </div>
          {getTutorExperienceYears() >= 5 && (
            <div className="absolute -top-1 -right-1">
              <div className="bg-yellow-500 text-yellow-900 text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                <Award className="w-3 h-3" />
                <span className="hidden sm:inline">Expert</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-lg text-card-foreground group-hover:text-primary transition-colors line-clamp-1">
                {getTutorName()}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {getTutorHeadline()}
              </p>
            </div>
            <div className="text-right flex-shrink-0 ml-2">
              <div className="font-bold text-xl text-card-foreground">
                ${getTutorHourlyRate().toFixed(0)}
              </div>
              <div className="text-sm text-muted-foreground">per hour</div>
            </div>
          </div>
          
          {/* Rating and Reviews */}
          <div className="flex items-center gap-2 mt-3">
            {renderStars(getTutorRating())}
            <span className="font-medium text-card-foreground">
              {getTutorRating().toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">
              ({getTutorTotalReviews()} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Categories */}
      {getTutorCategories().length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">Teaches</p>
          <div className="flex flex-wrap gap-2">
            {getTutorCategories().slice(0, 3).map((category, index) => (
              <span
                key={category.id || index}
                className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full font-medium"
              >
                {category.name}
              </span>
            ))}
            {getTutorCategories().length > 3 && (
              <span className="px-2 py-1 text-xs text-muted-foreground">
                +{getTutorCategories().length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Award className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <div className="text-sm font-medium text-card-foreground">
              {getTutorExperienceYears()}+ years
            </div>
            <div className="text-xs text-muted-foreground">Experience</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-green-500" />
          </div>
          <div>
            <div className="text-sm font-medium text-card-foreground">
              {getTutorCompletedSessions()}+
            </div>
            <div className="text-xs text-muted-foreground">Sessions</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <div>
            <div className="text-sm font-medium text-card-foreground">
              {getTutorTotalReviews()}+
            </div>
            <div className="text-xs text-muted-foreground">Reviews</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <Clock className="w-4 h-4 text-orange-500" />
          </div>
          <div>
            <div className="text-sm font-medium text-card-foreground">
              ${getTutorHourlyRate()}/hour
            </div>
            <div className="text-xs text-muted-foreground">Rate</div>
          </div>
        </div>
      </div>

      {/* Bio (truncated) */}
      {getTutorBio() && (
        <p className="text-sm text-muted-foreground line-clamp-2 mb-6">
          {getTutorBio()}
        </p>
      )}

      {/* Action Buttons */}
      {showActions && (
        <div className="flex flex-col gap-3">
          <button
            onClick={handleViewProfile}
            className="w-full px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
          >
            View Full Profile
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="text-center">
            <button
              onClick={handleLoginRedirect}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Want to book? Please login and go to dashboard
            </button>
          </div>
        </div>
      )}

      {/* Quick View Footer */}
      {!showActions && (
        <div 
          className="pt-4 border-t border-border flex items-center justify-between text-sm cursor-pointer hover:text-primary transition-colors"
          onClick={handleViewProfile}
        >
          <span className="text-muted-foreground">View full profile</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

export default TutorCard;