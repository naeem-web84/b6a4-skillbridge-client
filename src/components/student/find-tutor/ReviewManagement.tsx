// components/student-find-tutor/ReviewManagement.tsx
"use client";

import { useState, useEffect } from "react";
import studentFindTutorService from "@/services/studentFindTutor.service";

// Define local Review type that matches the API response
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
        // Cast the API response to our local Review type
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

  if (loading) return <div className="text-center py-8">Loading reviews...</div>;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">My Reviews</h2>
          <p className="text-gray-600">Share your experience with tutors</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Write a Review
        </button>
      </div>

      {/* Create/Edit Form Modal */}
      {(showCreateForm || editingReview) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  {editingReview ? 'Edit Review' : 'Write a Review'}
                </h3>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingReview(null);
                    setFormData({ bookingId: "", rating: 5, comment: "" });
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={editingReview ? handleUpdateReview : handleCreateReview}>
                {!editingReview && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Booking ID
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.bookingId}
                      onChange={(e) => setFormData({...formData, bookingId: e.target.value})}
                      className="w-full p-2 border rounded"
                      placeholder="Enter booking ID"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      You can only review completed bookings
                    </p>
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({...formData, rating: star})}
                        className="text-3xl focus:outline-none"
                      >
                        {star <= formData.rating ? '★' : '☆'}
                      </button>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Selected: {formData.rating}/5 stars
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comment (Optional)
                  </label>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData({...formData, comment: e.target.value})}
                    className="w-full p-2 border rounded h-32"
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
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
        <div className="bg-red-50 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">⭐</div>
          <h3 className="text-xl font-semibold text-gray-600">No reviews yet</h3>
          <p className="text-gray-500 mt-2">Share your experience with tutors you've worked with.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="text-yellow-500 text-xl">
                      {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                    </div>
                    <span className="text-sm text-gray-500">
                      ({review.rating}/5)
                    </span>
                    {review.isVerified && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-bold mt-2">{review.tutor?.headline || 'Tutor'}</h3>
                  
                  {review.comment && (
                    <p className="text-gray-700 mt-2">{review.comment}</p>
                  )}
                  
                  <div className="mt-4 text-sm text-gray-500">
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
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Statistics */}
      {reviews.length > 0 && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-3">Review Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold text-blue-600">{reviews.length}</div>
              <div className="text-sm text-gray-600">Total Reviews</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}