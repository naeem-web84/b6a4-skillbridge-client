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
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Tutor Portal</h1>
          <p className="text-gray-600 mt-2">Find tutors, manage bookings, and leave reviews</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 overflow-x-auto border-b border-gray-200">
          <button
            onClick={() => setActiveTab('tutors')}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${activeTab === 'tutors' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-600 hover:bg-gray-100'}`}
          >
            👨‍🏫 Find Tutors
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${activeTab === 'bookings' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-600 hover:bg-gray-100'}`}
          >
            📅 My Bookings
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${activeTab === 'reviews' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-600 hover:bg-gray-100'}`}
          >
            ⭐ My Reviews
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${activeTab === 'categories' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-600 hover:bg-gray-100'}`}
          >
            📚 Categories
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          {activeTab === 'tutors' && <TutorDiscovery />}
          {activeTab === 'bookings' && <BookingManagement />}
          {activeTab === 'reviews' && <ReviewManagement />}
          {activeTab === 'categories' && <CategoryManagement />}
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">8</div>
            <div className="text-gray-600 text-sm">Available Tutors</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">2</div>
            <div className="text-gray-600 text-sm">Tutoring Categories</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-yellow-600">0</div>
            <div className="text-gray-600 text-sm">Your Bookings</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-gray-600 text-sm">Your Reviews</div>
          </div>
        </div>
      </div>
    </div>
  );
}