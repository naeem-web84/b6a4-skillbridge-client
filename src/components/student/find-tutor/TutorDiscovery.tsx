"use client";

import { useState, useEffect } from "react";
import studentFindTutorService from "@/services/studentFindTutor.service";
import { TutorProfile } from "@/services/studentFindTutor.service";

export default function TutorDiscovery() {
  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    minRate: 0,
    maxRate: 100,
    minRating: 0,
    categoryId: ''
  });

  const fetchTutors = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await studentFindTutorService.tutor.browseTutors({
        page: 1,
        limit: 12,
        maxHourlyRate: filters.maxRate || undefined,
        minRating: filters.minRating || undefined,
        category: filters.categoryId || undefined
      });

      if (result.success && result.data) {
        // Access tutors from result.data.tutors (service returns BrowseTutorsResponse)
        setTutors(Array.isArray(result.data.tutors) ? result.data.tutors : []);
      } else {
        setError(result.message || "Failed to load tutors");
        setTutors([]);
      }
    } catch (err: any) {
      setError(err.message || "Error fetching tutors");
      setTutors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutors();
  }, [filters]);

  const handleBookTutor = async (tutor: TutorProfile) => {
    setBookingLoading(tutor.id);
    
    try {
      const availabilityResult = await studentFindTutorService.tutor.getTutorAvailability(tutor.id);

      if (!availabilityResult.success) {
        alert(`Failed to check availability: ${availabilityResult.message}`);
        return;
      }

      const availableSlots = availabilityResult.data?.totalAvailableSlots || 0;
      
      if (availableSlots === 0) {
        alert("This tutor has no available slots at the moment.");
        return;
      }

      const confirmBooking = confirm(
        `Book Session with ${tutor.user?.name || 'Tutor'}\n\n` +
        `Rate: $${tutor.hourlyRate}/hour\n` +
        `Available Slots: ${availableSlots}\n\n` +
        `Click OK to proceed with booking.`
      );

      if (confirmBooking) {
        alert(
          `Booking request sent to ${tutor.user?.name || 'Tutor'}!\n\n` +
          `You can manage your bookings in the Bookings section.`
        );
      }
    } catch (error: any) {
      alert(`Failed to book tutor: ${error.message || "Unknown error"}`);
    } finally {
      setBookingLoading(null);
    }
  };

  const getTotalSessions = () => {
    if (!Array.isArray(tutors) || tutors.length === 0) return 0;
    return tutors.reduce((sum, t) => sum + (t.completedSessions || 0), 0);
  };

  const getAverageRating = () => {
    if (!Array.isArray(tutors) || tutors.length === 0) return '0.0';
    const avg = tutors.reduce((sum, t) => sum + (t.rating || 0), 0) / tutors.length;
    return avg.toFixed(1);
  };

  const getAverageRate = () => {
    if (!Array.isArray(tutors) || tutors.length === 0) return '0';
    const avg = tutors.reduce((sum, t) => sum + (t.hourlyRate || 0), 0) / tutors.length;
    return Math.round(avg).toString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Loading tutors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-8 max-w-md mx-auto">
          <p className="text-destructive font-semibold text-lg mb-2">Error Loading Tutors</p>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={fetchTutors}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Find Your Perfect Tutor</h2>
          <p className="text-muted-foreground mt-1">Browse expert tutors and book sessions instantly</p>
        </div>
        
        <button
          onClick={fetchTutors}
          className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors text-foreground flex items-center gap-2"
        >
          <span>↻</span> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 p-5 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Available Tutors</p>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-300 mt-1">
                {Array.isArray(tutors) ? tutors.length : 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-2xl">
              👨‍🏫
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 p-5 rounded-xl border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">Total Sessions</p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-300 mt-1">
                {getTotalSessions()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-2xl">
              📊
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 p-5 rounded-xl border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Average Rating</p>
              <p className="text-3xl font-bold text-purple-700 dark:text-purple-300 mt-1">
                {getAverageRating()}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center text-2xl">
              ⭐
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/50 p-5 rounded-xl border border-amber-200 dark:border-amber-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">Avg Rate/Hour</p>
              <p className="text-3xl font-bold text-amber-700 dark:text-amber-300 mt-1">
                ${getAverageRate()}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center text-2xl">
              💰
            </div>
          </div>
        </div>
      </div>

      {!Array.isArray(tutors) || tutors.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <div className="text-muted-foreground mb-4">
            <span className="text-7xl">👨‍🏫</span>
          </div>
          <h3 className="text-2xl font-semibold text-muted-foreground mb-2">No Tutors Available</h3>
          <p className="text-muted-foreground">Check back later for new tutor listings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tutors.map((tutor) => (
            <div
              key={tutor.id}
              className="group bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center text-2xl font-bold text-primary border-2 border-primary/30">
                      {tutor.user?.name?.charAt(0) || 'T'}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">
                        {tutor.user?.name || 'Expert Tutor'}
                      </h3>
                      <p className="text-muted-foreground text-sm mt-0.5">{tutor.headline}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${tutor.hourlyRate || 0}
                      <span className="text-sm font-normal text-muted-foreground">/hr</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 justify-end">
                      <span className="text-yellow-500">★</span>
                      <span className="font-semibold text-foreground">{(tutor.rating || 0).toFixed(1)}</span>
                      <span className="text-muted-foreground text-sm">({tutor.totalReviews || 0})</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-muted/50 rounded-lg p-2 text-center">
                    <p className="text-xs text-muted-foreground">Experience</p>
                    <p className="font-semibold text-foreground">{tutor.experienceYears || 1}+ years</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-2 text-center">
                    <p className="text-xs text-muted-foreground">Sessions</p>
                    <p className="font-semibold text-foreground">{tutor.completedSessions || 0}+</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-2 text-center">
                    <p className="text-xs text-muted-foreground">Students</p>
                    <p className="font-semibold text-foreground">{tutor.statistics?.totalStudents || 0}</p>
                  </div>
                </div>

                {tutor.bio && (
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {tutor.bio}
                  </p>
                )}

                {Array.isArray(tutor.categories) && tutor.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tutor.categories.slice(0, 3).map((cat) => (
                      <span
                        key={cat.id}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                      >
                        {cat.name}
                      </span>
                    ))}
                    {tutor.categories.length > 3 && (
                      <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs">
                        +{tutor.categories.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>📧 {tutor.user?.email ? tutor.user.email.split('@')[0] + '@...' : 'Contact on book'}</span>
                  </div>
                  <button
                    onClick={() => handleBookTutor(tutor)}
                    disabled={bookingLoading === tutor.id}
                    className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {bookingLoading === tutor.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Booking...
                      </>
                    ) : (
                      <>
                        <span>📅</span>
                        Book Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}