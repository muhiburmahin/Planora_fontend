"use client";

import { useState } from "react";
import { X, Star, Loader2, CheckCircle } from "lucide-react";

interface ReviewModalProps {
  eventId: string;
  eventTitle: string;
  existingReview?: { id: string; rating: number; comment: string } | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReviewModal({
  eventId,
  eventTitle,
  existingReview,
  onClose,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState(existingReview?.rating || 5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isEdit = !!existingReview;

  const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  const handleSubmit = async () => {
    if (!comment.trim()) {
      setError("Please write a comment for your review.");
      return;
    }
    if (comment.trim().length < 10) {
      setError("Comment must be at least 10 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const url = isEdit ? `/api/reviews/${existingReview!.id}` : "/api/reviews";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, rating, comment }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit review");

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-slide-up">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 transition-colors">
          <X className="w-4 h-4 text-gray-500" />
        </button>

        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Review {isEdit ? "Updated" : "Submitted"}! 🎉</h3>
            <p className="text-gray-500 text-sm">Thank you for your feedback.</p>
          </div>
        ) : (
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {isEdit ? "Edit Your Review" : "Write a Review"}
            </h3>
            <p className="text-sm text-gray-500 mb-6 line-clamp-1">{eventTitle}</p>

            {/* Star Rating */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Your Rating</label>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= (hoveredRating || rating)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-700 ml-1">
                  {ratingLabels[hoveredRating || rating]}
                </span>
              </div>
            </div>

            {/* Comment */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Your Comment <span className="text-red-400">*</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Share your experience about this event..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
              <div className="flex justify-between mt-1">
                {error ? (
                  <p className="text-xs text-red-500">{error}</p>
                ) : (
                  <span />
                )}
                <span className={`text-xs ${comment.length > 500 ? "text-red-500" : "text-gray-400"}`}>
                  {comment.length}/500
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !comment.trim()}
                className="flex-1 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-primary-200"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isEdit ? "Update Review" : "Submit Review"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}