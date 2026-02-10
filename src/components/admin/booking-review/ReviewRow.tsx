// components/admin/bookings-review/ReviewRow.tsx (Complete)
"use client";

import React, { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Star,
  User,
  GraduationCap,
  Shield,
  Calendar,
  MessageSquare,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";
import type { Review } from "@/services/admin.service";
import { format } from "date-fns";
import ViewReviewModal from "./ViewReviewModal";
import EditReviewModal from "./EditReviewModal";

interface ReviewRowProps {
  review: Review;
  onUpdateReview: (reviewId: string, data: any) => Promise<void>;
  onDeleteReview: (reviewId: string) => Promise<void>;
  onRefresh?: () => void;
}

// Rating display component
const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
          }`}
        />
      ))}
      <span className="ml-1 font-medium">{rating.toFixed(1)}</span>
    </div>
  );
};

// Verification badge component
const VerificationBadge = ({ verified }: { verified: boolean }) => {
  return verified ? (
    <Badge variant="outline" className="gap-1 bg-green-50 text-green-700 border-green-200">
      <Shield className="w-3 h-3" />
      Verified
    </Badge>
  ) : (
    <Badge variant="outline" className="gap-1 bg-yellow-50 text-yellow-700 border-yellow-200">
      <Shield className="w-3 h-3" />
      Unverified
    </Badge>
  );
};

export default function ReviewRow({ review, onUpdateReview, onDeleteReview, onRefresh }: ReviewRowProps) {
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  const handleRatingChange = (newRating: number) => {
    onUpdateReview(review.id, { rating: newRating });
  };

  const handleVerificationToggle = () => {
    const newStatus = !review.isVerified;
    onUpdateReview(review.id, { isVerified: newStatus });
  };

  const handleModalSuccess = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const student = review.studentUser || { name: "Unknown Student", email: "" };
  const tutor = review.tutorUser || { name: "Unknown Tutor", email: "" };

  return (
    <>
      <TableRow>
        <TableCell>
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <RatingStars rating={review.rating} />
              </div>
              {review.comment && (
                <div className="text-sm text-muted-foreground line-clamp-2 flex-1">
                  "{review.comment}"
                </div>
              )}
            </div>
            {review.booking && (
              <div className="text-xs text-muted-foreground">
                Booking #{review.booking.id.substring(0, 8)}...
              </div>
            )}
          </div>
        </TableCell>
        <TableCell>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <VerificationBadge verified={review.isVerified} />
            </div>
            <div className="text-sm">
              {review.comment ? (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MessageSquare className="w-3 h-3" />
                  <span>With comment</span>
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">No comment</div>
              )}
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-3 h-3 text-muted-foreground" />
              <span className="text-sm font-medium">{student.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-3 h-3 text-muted-foreground" />
              <span className="text-sm font-medium">{tutor.name}</span>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="space-y-1">
            <div className="text-sm">
              {formatDate(review.createdAt)}
            </div>
          </div>
        </TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Review Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => setShowViewModal(true)}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Review
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuLabel>Update Rating</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleRatingChange(5)}>
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                Set to 5 stars
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRatingChange(4)}>
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                Set to 4 stars
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRatingChange(3)}>
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                Set to 3 stars
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRatingChange(2)}>
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                Set to 2 stars
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRatingChange(1)}>
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                Set to 1 star
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={handleVerificationToggle}>
                {review.isVerified ? (
                  <>
                    <XCircle className="w-4 h-4 mr-2" />
                    Mark as Unverified
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Verified
                  </>
                )}
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {review.bookingId && (
                <DropdownMenuItem 
                  onClick={() => window.open(`/admin/bookings/${review.bookingId}`, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Booking
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => onDeleteReview(review.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Review
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {/* View Review Modal */}
      <ViewReviewModal
        review={review}
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        onEditClick={() => {
          setShowViewModal(false);
          setShowEditModal(true);
        }}
      />

      {/* Edit Review Modal */}
      <EditReviewModal
        review={review}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={handleModalSuccess}
        onUpdateReview={onUpdateReview}
      />
    </>
  );
}