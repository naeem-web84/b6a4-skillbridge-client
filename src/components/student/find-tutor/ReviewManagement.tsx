// components/student-find-tutor/ReviewManagement.tsx
"use client";

import { useState, useEffect } from "react";
import studentFindTutorService from "@/services/studentFindTutor.service";

interface Review {
  id: string;
  rating: number;
  comment?: string;
  isVerified: boolean;
  createdAt: string;
  tutor?: {
    id: string;
    userId?: string;
    headline: string;
    hourlyRate?: number;
    rating?: number;
    user?: {
      name: string;
      image?: string;
      email?: string;
    };
  };
  booking?: {
    id: string;
    bookingDate: string;
    startTime?: string;
    endTime?: string;
    category?: {
      id: string;
      name: string;
    };
  };
}

export default function ReviewManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [formData, setFormData] = useState({
    bookingId: "",
    rating: 5,
    comment: ""
  });

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await studentFindTutorService.review.getStudentReviews();
      
      if (result.success && result.data?.reviews) {
        setReviews(result.data.reviews as Review[]);
      } else {
        setError(result.message || "Failed to load reviews");
      }
    } catch (err: any) {
      setError(err.message || "Error fetching reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await studentFindTutorService.review.createReview(
        formData.bookingId,
        {
          rating: formData.rating,
          comment: formData.comment || undefined
        }
      );

      if (result.success) {
        alert("Review created successfully!");
        setShowCreateForm(false);
        setFormData({ bookingId: "", rating: 5, comment: "" });
        fetchReviews();
      } else {
        alert(`Failed to create review: ${result.message}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleUpdateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;
    
    try {
      const result = await studentFindTutorService.review.updateReview(
        editingReview.id,
        {
          rating: formData.rating,
          comment: formData.comment || undefined
        }
      );

      if (result.success) {
        alert("Review updated successfully!");
        setEditingReview(null);
        setFormData({ bookingId: "", rating: 5, comment: "" });
        fetchReviews();
      } else {
        alert(`Failed to update review: ${result.message}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    
    try {
      const result = await studentFindTutorService.review.deleteReview(reviewId);
      if (result.success) {
        alert("Review deleted successfully!");
        fetchReviews();
      } else {
        alert(`Failed to delete review: ${result.message}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const startEditReview = (review: Review) => {
    setEditingReview(review);
    setFormData({
      bookingId: "",
      rating: review.rating,
      comment: review.comment || ""
    });
  };

  if (loading) return <div className="text-center py-8 text-muted-foreground">Loading reviews...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Reviews</h2>
          <p className="text-muted-foreground">Share your experience with tutors</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          + Write a Review
        </button>
      </div>

      {(showCreateForm || editingReview) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-foreground">
                  {editingReview ? 'Edit Review' : 'Write a Review'}
                </h3>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingReview(null);
                    setFormData({ bookingId: "", rating: 5, comment: "" });
                  }}
                  className="text-muted-foreground hover:text-foreground text-2xl transition-colors"
                >
                  ×
                </button>
              </div>

              <form onSubmit={editingReview ? handleUpdateReview : handleCreateReview}>
                {!editingReview && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Booking ID
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.bookingId}
                      onChange={(e) => setFormData({...formData, bookingId: e.target.value})}
                      className="w-full p-2 border rounded bg-background text-foreground"
                      placeholder="Enter booking ID"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      You can only review completed bookings
                    </p>
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Rating
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({...formData, rating: star})}
                        className="text-3xl focus:outline-none text-yellow-500 dark:text-yellow-400"
                      >
                        {star <= formData.rating ? '★' : '☆'}
                      </button>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Selected: {formData.rating}/5 stars
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Comment (Optional)
                  </label>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData({...formData, comment: e.target.value})}
                    className="w-full p-2 border rounded h-32 bg-background text-foreground"
                    placeholder="Share your experience..."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingReview(null);
                      setFormData({ bookingId: "", rating: 5, comment: "" });
                    }}
                    className="px-4 py-2 border border-input rounded hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                  >
                    {editingReview ? 'Update Review' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded mb-4 border border-destructive/20">
          {error}
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-6xl mb-4">⭐</div>
          <h3 className="text-xl font-semibold text-muted-foreground">No reviews yet</h3>
          <p className="text-muted-foreground mt-2">Share your experience with tutors you've worked with.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-5 hover:shadow-md transition-shadow bg-card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="text-yellow-500 dark:text-yellow-400 text-xl">
                      {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({review.rating}/5)
                    </span>
                    {review.isVerified && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-bold mt-2 text-foreground">{review.tutor?.headline || 'Tutor'}</h3>
                  
                  {review.comment && (
                    <p className="text-foreground mt-2">{review.comment}</p>
                  )}
                  
                  <div className="mt-4 text-sm text-muted-foreground">
                    <span>
                      Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                    {review.booking && (
                      <>
                        <span className="mx-2">•</span>
                        <span>
                          Booking: {new Date(review.booking.bookingDate).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => startEditReview(review)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {reviews.length > 0 && (
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-3 text-foreground">Review Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{reviews.length}</div>
              <div className="text-sm text-muted-foreground">Total Reviews</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}