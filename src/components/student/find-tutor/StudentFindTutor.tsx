"use client";

import { useState, useEffect } from "react";
import { studentService } from "@/services/student.service";
import TutorDiscovery from "./TutorDiscovery";
import BookingManagement from "./BookingManagement";
import ReviewManagement from "./ReviewManagement";
import CategoryManagement from "./CategoryManagement";

export default function StudentFindTutor() {
  const [activeTab, setActiveTab] = useState<'tutors' | 'bookings' | 'reviews' | 'categories'>('tutors');
  const [stats, setStats] = useState({
    tutors: 0,
    categories: 0,
    bookings: 0,
    reviews: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [tutorsResult, categoriesResult, bookingsResult, reviewsResult] = await Promise.all([
        studentService.discovery.searchTutors({ page: 1, limit: 1 }),
        studentService.categories.getAllCategories(),
        studentService.bookings.getBookings({ page: 1, limit: 1 }),
        studentService.reviews.getStudentReviews()
      ]);

      setStats({
        tutors: tutorsResult.pagination?.total || 0,
        categories: categoriesResult.data?.length || 0,
        bookings: bookingsResult.pagination?.total || 0,
        reviews: reviewsResult.data?.length || 0
      });
    } catch {
      setStats({ tutors: 0, categories: 0, bookings: 0, reviews: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Student Tutor Portal</h1>
          <p className="text-muted-foreground mt-2">Find tutors, manage bookings, and leave reviews</p>
        </div>

        <div className="flex space-x-1 mb-8 overflow-x-auto border-b border-border">
          {[
            { id: 'tutors', label: 'Find Tutors', icon: '👨‍🏫' },
            { id: 'bookings', label: 'My Bookings', icon: '📅' },
            { id: 'reviews', label: 'My Reviews', icon: '⭐' },
            { id: 'categories', label: 'Categories', icon: '📚' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
                activeTab === tab.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-card rounded-lg shadow p-4 md:p-6">
          {activeTab === 'tutors' && <TutorDiscovery />}
          {activeTab === 'bookings' && <BookingManagement />}
          {activeTab === 'reviews' && <ReviewManagement />}
          {activeTab === 'categories' && <CategoryManagement />}
        </div>

        {!loading && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card p-4 rounded-lg shadow border border-border">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.tutors}</div>
              <div className="text-muted-foreground text-sm">Available Tutors</div>
            </div>
            <div className="bg-card p-4 rounded-lg shadow border border-border">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.categories}</div>
              <div className="text-muted-foreground text-sm">Categories</div>
            </div>
            <div className="bg-card p-4 rounded-lg shadow border border-border">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.bookings}</div>
              <div className="text-muted-foreground text-sm">Your Bookings</div>
            </div>
            <div className="bg-card p-4 rounded-lg shadow border border-border">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.reviews}</div>
              <div className="text-muted-foreground text-sm">Your Reviews</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}