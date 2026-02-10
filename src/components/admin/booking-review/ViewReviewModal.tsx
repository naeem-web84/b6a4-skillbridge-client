// components/admin/bookings-review/ViewReviewModal.tsx
"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Star, 
  User, 
  GraduationCap, 
  Shield,
  Calendar,
  MessageSquare,
  DollarSign,
  Copy,
  Edit,
} from "lucide-react";
import type { Review } from "@/services/admin.service";
import { format } from "date-fns";

interface ViewReviewModalProps {
  review: Review;
  isOpen: boolean;
  onClose: () => void;
  onEditClick?: () => void;
}

export default function ViewReviewModal({
  review,
  isOpen,
  onClose,
  onEditClick,
}: ViewReviewModalProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy • hh:mm a");
    } catch {
      return dateString;
    }
  };

  const handleCopyReviewId = () => {
    navigator.clipboard.writeText(review.id);
    alert("Review ID copied to clipboard!");
  };

  const ratingStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-xl font-bold">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const student = review.studentUser || { name: "Unknown Student", email: "" };
  const tutor = review.tutorUser || { name: "Unknown Tutor", email: "" };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Review Details
          </DialogTitle>
          <DialogDescription>
            View complete review information and context
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Review Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg">
            <div>
              <div className="text-xl font-bold mb-2">Student Review</div>
              <div className="flex items-center gap-4">
                {ratingStars(review.rating)}
                <Badge variant={review.isVerified ? "outline" : "secondary"} className="gap-1">
                  <Shield className="w-3 h-3" />
                  {review.isVerified ? "Verified" : "Unverified"}
                </Badge>
              </div>
            </div>
            {review.booking && (
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Booking Amount</div>
                <div className="text-xl font-bold flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  ${review.booking.amount}
                </div>
              </div>
            )}
          </div>

          {/* Rating & Comment */}
          <div className="space-y-4">
            <h3 className="font-semibold">Rating & Feedback</h3>
            
            <div className="p-4 bg-muted/20 rounded-lg">
              {ratingStars(review.rating)}
              
              {review.comment ? (
                <div className="mt-4">
                  <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Student Comment
                  </div>
                  <div className="p-3 bg-white dark:bg-gray-900 rounded border">
                    <p className="text-sm italic">"{review.comment}"</p>
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-3 bg-muted/30 rounded text-center">
                  <p className="text-sm text-muted-foreground">No comment provided by the student</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Participant Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <User className="w-4 h-4" />
                Student Information
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Name</span>
                  <span className="font-medium">{student.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="font-medium">{student.email}</span>
                </div>
                {review.studentProfile?.grade && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Grade</span>
                    <span className="font-medium">{review.studentProfile.grade}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Tutor Information
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Name</span>
                  <span className="font-medium">{tutor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="font-medium">{tutor.email}</span>
                </div>
                {review.tutorProfile && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Headline</span>
                      <span className="font-medium text-right">{review.tutorProfile.headline}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Current Rating</span>
                      <span className="font-medium">{review.tutorProfile.rating}/5</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Booking Context */}
          {review.booking && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-semibold">Booking Context</h4>
                <div className="p-4 bg-muted/20 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Booking Date</div>
                      <div className="font-medium">{review.booking.bookingDate}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Amount</div>
                      <div className="font-medium">${review.booking.amount}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Booking ID</div>
                      <div className="font-mono text-sm">{review.booking.id.substring(0, 8)}...</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Review Created</div>
                      <div className="font-medium">{formatDate(review.createdAt)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Timestamps */}
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Review Created</span>
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">
                  {formatDate(review.createdAt)}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Last Updated</span>
              <div className="p-3 bg-muted/30 rounded">
                <span className="font-medium">
                  {formatDate(review.updatedAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {onEditClick && (
              <Button
                variant="default"
                className="gap-2"
                onClick={onEditClick}
              >
                <Edit className="w-4 h-4" />
                Edit Review
              </Button>
            )}
            <Button
              variant="outline"
              className="gap-2 ml-auto"
              onClick={handleCopyReviewId}
            >
              <Copy className="w-4 h-4" />
              Copy Review ID
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}