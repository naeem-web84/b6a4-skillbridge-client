// components/student-find-tutor/TutorDiscovery.tsx
"use client";

import { useState, useEffect } from "react";
import studentFindTutorService from "@/services/studentFindTutor.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, BookOpen, CheckCircle, Mail, Award, GraduationCap, Clock, User, Calendar, MessageSquare, DollarSign, Bookmark } from "lucide-react";

interface Tutor {
  id: string;
  userId: string;
  headline: string;
  bio?: string;
  hourlyRate: number;
  rating: number;
  experienceYears?: number;
  completedSessions?: number;
  totalReviews?: number;
  categories: Array<{
    id: string;
    name: string;
  }>;
  user?: {
    name: string;
    image?: string;
    email?: string;
  };
  education?: string;
  certifications?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  statistics?: {
    totalStudents: number;
    totalSessions: number;
    availableSlots: number;
    completedSessions: number;
  };
}

export default function TutorDiscovery() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);

  const fetchTutors = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await studentFindTutorService.tutor.browseTutors({
        page: 1,
        limit: 12,
      });

      if (result.success && result.data?.tutors) {
        setTutors(result.data.tutors as unknown as Tutor[]);
      } else {
        setError(result.message || "Failed to load tutors");
      }
    } catch (err: any) {
      setError(err.message || "Error fetching tutors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  const handleBookTutor = async (tutor: Tutor) => {
    setBookingLoading(tutor.id);
    
    try {
      const availabilityResult = await studentFindTutorService.tutor.getTutorAvailability(tutor.id, {
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

      if (!availabilityResult.success) {
        alert(`Failed to check availability: ${availabilityResult.message}`);
        return;
      }

      const availableSlots = availabilityResult.data?.totalAvailableSlots || 0;
      
      if (availableSlots === 0) {
        alert("This tutor has no available slots at the moment. Please check back later.");
        return;
      }

      const categoriesResult = await studentFindTutorService.category.getAllCategories();
      
      if (!categoriesResult.success || !categoriesResult.data || categoriesResult.data.length === 0) {
        alert("Failed to load subjects. Please try again.");
        return;
      }

      const tutorAvailability = availabilityResult.data?.availability?.[0]?.slots?.[0];
      
      if (!tutorAvailability) {
        alert("No specific time slots available. Please try a different date range.");
        return;
      }

      const confirmBooking = confirm(
        `📋 BOOKING SUMMARY\n\n` +
        `Tutor: ${tutor.user?.name || 'Unknown Tutor'}\n` +
        `Rate: $${tutor.hourlyRate}/hour\n` +
        `Date: ${new Date(tutorAvailability.date).toLocaleDateString()}\n` +
        `Time: ${tutorAvailability.startTime} - ${tutorAvailability.endTime}\n` +
        `Available Slots: ${availableSlots}\n\n` +
        `Click OK to proceed with booking.`
      );

      if (!confirmBooking) {
        return;
      }

      alert(
        `✅ BOOKING REQUEST SENT!\n\n` +
        `Your booking request has been submitted to ${tutor.user?.name}.\n` +
        `You will receive a confirmation email shortly.\n\n` +
        `Booking Details:\n` +
        `• Rate: $${tutor.hourlyRate}/hour\n` +
        `• Status: Pending confirmation\n` +
        `• You can manage your bookings in the Bookings section.`
      );

      fetchTutors();

    } catch (error: any) {
      alert(`Failed to book tutor: ${error.message || "Unknown error"}`);
    } finally {
      setBookingLoading(null);
    }
  };

  const handleViewMyBookings = async () => {
    try {
      const bookingsResult = await studentFindTutorService.booking.getBookings({
        page: 1,
        limit: 10,
      });

      if (bookingsResult.success && bookingsResult.data && bookingsResult.data.length > 0) {
        const bookingList = bookingsResult.data.map((booking: any, index: number) =>
          `${index + 1}. ${booking.tutorProfile?.headline || 'Tutor'}: $${booking.amount} - ${booking.status}`
        ).join('\n');

        alert(`📋 YOUR BOOKINGS:\n\n${bookingList}\n\nTotal: ${bookingsResult.data.length} bookings`);
      } else {
        alert("📭 You don't have any bookings yet.");
      }
    } catch (error: any) {
      alert("Failed to load your bookings.");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading tutors...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="p-8 text-center">
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
        <p className="text-destructive font-medium mb-2">Error Loading Tutors</p>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={fetchTutors} variant="outline">
          Try Again
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
              Find Your Perfect Tutor
            </h1>
            <p className="text-muted-foreground">
              Browse expert tutors and book sessions instantly
            </p>
          </div>
          <Button
            onClick={handleViewMyBookings}
            variant="outline"
            className="border-primary/20 hover:bg-primary/10 text-primary"
          >
            <Bookmark className="mr-2 h-4 w-4" />
            View My Bookings
          </Button>
        </div>

        <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{tutors.length}</div>
            <div className="text-sm text-muted-foreground">Available Tutors</div>
          </div>
          <div className="bg-card p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {tutors.reduce((sum, tutor) => sum + (tutor.completedSessions || 0), 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Sessions</div>
          </div>
          <div className="bg-card p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {tutors.length > 0 ? (tutors.reduce((sum, tutor) => sum + tutor.rating, 0) / tutors.length).toFixed(1) : '0.0'}
            </div>
            <div className="text-sm text-muted-foreground">Avg Rating</div>
          </div>
          <div className="bg-card p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              ${tutors.length > 0 ? (tutors.reduce((sum, tutor) => sum + tutor.hourlyRate, 0) / tutors.length).toFixed(0) : '0'}
            </div>
            <div className="text-sm text-muted-foreground">Avg Rate/Hour</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutors.map((tutor) => (
            <Card key={tutor.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-border bg-card">
              
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-black">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold">
                          {tutor.user?.name || "Expert Tutor"}
                        </CardTitle>
                        <p className="text-blue-100 text-sm">{tutor.headline}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">${tutor.hourlyRate}</div>
                    <div className="text-blue-100 text-sm">per hour</div>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-black mb-3 flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                    About
                  </h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-black text-sm">
                      {tutor.bio || "Experienced tutor dedicated to student success."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-lg">
                      <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400 fill-current" />
                    </div>
                    <div>
                      <div className="font-bold text-lg text-black">{tutor.rating}/5</div>
                      <div className="text-xs text-muted-foreground">{tutor.totalReviews || 0} reviews</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                      <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="font-bold text-lg text-black">{tutor.experienceYears || 1}+</div>
                      <div className="text-xs text-muted-foreground">Years Exp</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <div className="font-bold text-lg text-black">{tutor.completedSessions || 0}</div>
                      <div className="text-xs text-muted-foreground">Sessions</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-pink-100 dark:bg-pink-900 p-2 rounded-lg">
                      <Clock className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                    </div>
                    <div>
                      <div className="font-bold text-lg text-black">{tutor.statistics?.totalStudents || 0}</div>
                      <div className="text-xs text-muted-foreground">Students</div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-primary mr-3" />
                    <div>
                      <div className="text-sm font-medium text-black">Contact</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {tutor.user?.email || "Email available upon booking"}
                      </div>
                    </div>
                  </div>
                </div>

                {tutor.categories && tutor.categories.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-black mb-3">Subjects</h3>
                    <div className="flex flex-wrap gap-2">
                      {tutor.categories.map((cat) => (
                        <span
                          key={cat.id}
                          className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium"
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-border">
                  <Button
                    onClick={() => handleBookTutor(tutor)}
                    disabled={bookingLoading === tutor.id}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-black py-6 text-lg font-bold shadow-lg hover:shadow-xl"
                  >
                    {bookingLoading === tutor.id ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-3"></div>
                        Processing Booking...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Calendar className="mr-3 h-6 w-6" />
                        BOOK NOW - ${tutor.hourlyRate}/hour
                      </span>
                    )}
                  </Button>
                  <p className="text-center text-muted-foreground text-sm mt-2">
                    Instant booking • Flexible scheduling • Secure payment
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {tutors.length === 0 && (
          <div className="text-center py-12 bg-card rounded-lg shadow">
            <div className="text-muted-foreground mb-4">
              <User className="h-20 w-20 mx-auto opacity-50" />
            </div>
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Tutors Available</h3>
            <p className="text-muted-foreground">Check back later for new tutor listings.</p>
          </div>
        )}
      </div>
    </div>
  );
}