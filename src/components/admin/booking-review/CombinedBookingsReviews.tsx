// components/admin/bookings-review/CombinedBookingsReviews.tsx
"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingManagement from "./BookingManagement";
import ReviewManagement from "./ReviewManagement";

export default function CombinedBookingsReviews() {
  const [activeTab, setActiveTab] = useState("bookings");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bookings & Reviews Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage all tutoring bookings and student reviews in one place
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="bookings" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="bookings" className="gap-2">
            <span className="hidden sm:inline">📅</span>
            Bookings Management
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary/10">
              View & Update Status
            </span>
          </TabsTrigger>
          <TabsTrigger value="reviews" className="gap-2">
            <span className="hidden sm:inline">⭐</span>
            Review Management
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary/10">
              Rating & Comment Moderation
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-4">
          <BookingManagement showHeader={false} />
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <ReviewManagement showHeader={false} />
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-muted/30 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">Quick Actions</h3>
          <ul className="space-y-2 text-sm">
            <li>• Update booking statuses</li>
            <li>• Mark bookings as paid/unpaid</li>
            <li>• Moderate reviews and comments</li>
            <li>• Verify/unverify reviews</li>
            <li>• Filter by date, status, or rating</li>
          </ul>
        </div>
        <div className="p-4 bg-muted/30 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">Booking Status Guide</h3>
          <ul className="space-y-1 text-sm">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              <span>Pending - Awaiting confirmation</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>Confirmed - Scheduled session</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span>Completed - Session finished</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>Cancelled - Session cancelled</span>
            </li>
          </ul>
        </div>
        <div className="p-4 bg-muted/30 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">Review Moderation</h3>
          <ul className="space-y-1 text-sm">
            <li>• Delete inappropriate reviews</li>
            <li>• Verify authentic feedback</li>
            <li>• Update ratings if needed</li>
            <li>• Filter by verification status</li>
            <li>• View booking context</li>
          </ul>
        </div>
      </div>
    </div>
  );
}