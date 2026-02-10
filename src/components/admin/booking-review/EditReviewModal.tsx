// components/admin/bookings-review/EditReviewModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Star, 
  Shield,
  MessageSquare,
  Save,
  Copy,
  User,
  GraduationCap,
  Calendar,
} from "lucide-react";
import type { Review, UpdateReviewData } from "@/services/admin.service";
import { format } from "date-fns";

interface EditReviewModalProps {
  review: Review;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onUpdateReview: (reviewId: string, data: UpdateReviewData) => Promise<void>;
}

export default function EditReviewModal({
  review,
  isOpen,
  onClose,
  onSuccess,
  onUpdateReview,
}: EditReviewModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateReviewData>({
    rating: review.rating,
    comment: review.comment,
    isVerified: review.isVerified,
  });

  // Update form data when review changes
  useEffect(() => {
    setFormData({
      rating: review.rating,
      comment: review.comment,
      isVerified: review.isVerified,
    });
  }, [review]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await onUpdateReview(review.id, formData);
      toast.success("Review updated successfully");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReviewId = () => {
    navigator.clipboard.writeText(review.id);
    toast.success("Review ID copied to clipboard!");
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy • HH:mm");
    } catch {
      return dateString;
    }
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
        <span className="ml-2 text-lg font-bold">{rating.toFixed(1)}</span>
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
            Edit Review
          </DialogTitle>
          <DialogDescription>
            Update rating, comment, and verification status
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Form */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (1-5) *</Label>
                  <Select
                    value={formData.rating?.toString()}
                    onValueChange={(value) => setFormData({ ...formData, rating: parseFloat(value) })}
                    required
                  >
                    <SelectTrigger>
                      <div className="flex items-center gap-2">
                        {ratingStars(formData.rating || 0)}
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 stars - Excellent</SelectItem>
                      <SelectItem value="4">4 stars - Very Good</SelectItem>
                      <SelectItem value="3">3 stars - Good</SelectItem>
                      <SelectItem value="2">2 stars - Fair</SelectItem>
                      <SelectItem value="1">1 star - Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comment">Comment</Label>
                  <Textarea
                    id="comment"
                    value={formData.comment || ""}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    placeholder="Update or add a comment..."
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty to remove existing comment
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                  <div className="space-y-0.5">
                    <Label htmlFor="isVerified" className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Verification Status
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Mark review as verified or unverified
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${formData.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                      {formData.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                    <Button
                      type="button"
                      variant={formData.isVerified ? "outline" : "default"}
                      size="sm"
                      onClick={() => setFormData({ ...formData, isVerified: !formData.isVerified })}
                    >
                      {formData.isVerified ? "Mark as Unverified" : "Mark as Verified"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Review Summary
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Review ID</span>
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                        {review.id.substring(0, 8)}...
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={handleCopyReviewId}
                        title="Copy Review ID"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Student</span>
                    <span className="font-medium">{student.name}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tutor</span>
                    <span className="font-medium">{tutor.name}</span>
                  </div>
                  
                  {review.booking && (
                    <>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Booking</span>
                        <span className="font-medium">#{review.booking.id.substring(0, 8)}...</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Booking Date</span>
                        <span className="font-medium">{review.booking.bookingDate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Amount</span>
                        <span className="font-medium">${review.booking.amount}</span>
                      </div>
                    </>
                  )}
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Created</span>
                    <span className="text-sm flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Current Review */}
              <div className="p-4 border rounded-lg bg-muted/30">
                <h4 className="font-semibold mb-2">Current Review</h4>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Rating</div>
                    {ratingStars(review.rating)}
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Comment
                    </div>
                    {review.comment ? (
                      <p className="text-sm p-2 bg-white dark:bg-gray-900 rounded border">
                        "{review.comment}"
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No comment</p>
                    )}
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Status</div>
                    <Badge variant={review.isVerified ? "outline" : "secondary"}>
                      {review.isVerified ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
              <Save className="w-4 h-4 ml-2" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}