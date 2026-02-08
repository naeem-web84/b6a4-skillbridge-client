// components/student-find-tutor/FindTutor.tsx
"use client";

import { useState } from "react";
import TutorDiscovery from "./TutorDiscovery";
import BookingManagement from "./BookingManagement";
import ReviewManagement from "./ReviewManagement";
import CategoryManagement from "./CategoryManagement";

export default function StudentFindTutor() {
  const [activeTab, setActiveTab] = useState<'tutors' | 'bookings' | 'reviews' | 'categories'>('tutors');

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Student Tutor Portal</h1>
          <p className="text-muted-foreground mt-2">Find tutors, manage bookings, and leave reviews</p>
        </div>

        <div className="flex space-x-1 mb-8 overflow-x-auto border-b border-border">
          <button
            onClick={() => setActiveTab('tutors')}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${activeTab === 'tutors' 
              ? 'bg-primary text-primary-foreground' 
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
          >
            👨‍🏫 Find Tutors
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${activeTab === 'bookings' 
              ? 'bg-primary text-primary-foreground' 
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
          >
            📅 My Bookings
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${activeTab === 'reviews' 
              ? 'bg-primary text-primary-foreground' 
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
          >
            ⭐ My Reviews
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${activeTab === 'categories' 
              ? 'bg-primary text-primary-foreground' 
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
          >
            📚 Categories
          </button>
        </div>

        <div className="bg-card rounded-lg shadow p-4 md:p-6">
          {activeTab === 'tutors' && <TutorDiscovery />}
          {activeTab === 'bookings' && <BookingManagement />}
          {activeTab === 'reviews' && <ReviewManagement />}
          {activeTab === 'categories' && <CategoryManagement />}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">8</div>
            <div className="text-muted-foreground text-sm">Available Tutors</div>
          </div>
          <div className="bg-card p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">2</div>
            <div className="text-muted-foreground text-sm">Tutoring Categories</div>
          </div>
          <div className="bg-card p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">0</div>
            <div className="text-muted-foreground text-sm">Your Bookings</div>
          </div>
          <div className="bg-card p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">0</div>
            <div className="text-muted-foreground text-sm">Your Reviews</div>
          </div>
        </div>
      </div>
    </div>
  );
}