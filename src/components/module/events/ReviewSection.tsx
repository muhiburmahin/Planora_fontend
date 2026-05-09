"use client";

import React, { useState, useEffect } from "react";
import { Star, MessageSquare, ThumbsUp, Trash2, Edit2, Loader2, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { reviewService } from "@/services/reviewService";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface ReviewSectionProps {
  eventId: string;
  reviews: any[];
  averageRating: number;
  totalReviews: number;
  currentUserId?: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  eventId,
  reviews: initialReviews,
  averageRating: initialAvg,
  totalReviews: initialTotal,
  currentUserId,
}) => {
  const [reviews, setReviews] = useState(initialReviews);
  const [avgRating, setAvgRating] = useState(initialAvg);
  const [total, setTotal] = useState(initialTotal);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId) {
      toast.error("Please login to write a review");
      return;
    }
    if (!newReview.comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await reviewService.createReview({
        eventId,
        rating: newReview.rating,
        comment: newReview.comment,
      });

      if (res.success) {
        toast.success("Review submitted successfully!");
        setReviews([(res.data as any)?.data || res.data, ...reviews]);
        setTotal(total + 1);
        setNewReview({ rating: 5, comment: "" });
        // Recalculate average (simplified)
        setAvgRating((avgRating * total + newReview.rating) / (total + 1));
      } else {
        toast.error(res.message || "Failed to submit review");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await reviewService.deleteReview(reviewId);
      if (res.success) {
        toast.success("Review deleted");
        setReviews(reviews.filter((r) => r.id !== reviewId));
        setTotal(total - 1);
      }
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  return (
    <div className="space-y-10">
      {/* Summary */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center gap-10">
        <div className="text-center px-10 border-r border-gray-100 dark:border-gray-800">
          <h2 className="text-6xl font-black text-gray-900 dark:text-white">
            {avgRating.toFixed(1)}
          </h2>
          <div className="flex items-center justify-center gap-1 my-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-5 h-5 ${s <= Math.round(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200 dark:text-gray-700"
                  }`}
              />
            ))}
          </div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            {total} Reviews
          </p>
        </div>

        <div className="flex-1 w-full space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = reviews.filter((r) => r.rating === rating).length;
            const percentage = total > 0 ? (count / total) * 100 : 0;
            return (
              <div key={rating} className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-600 dark:text-gray-400 w-4">{rating}</span>
                <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    className="h-full bg-yellow-400"
                  />
                </div>
                <span className="text-sm font-medium text-gray-400 w-8">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Form */}
      {currentUserId && (
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-3xl p-8 border border-dashed border-gray-200 dark:border-gray-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Write a Review</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-500 mr-2">Your Rating:</span>
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setNewReview({ ...newReview, rating: s })}
                  className="transition-transform active:scale-90"
                >
                  <Star
                    className={`w-8 h-8 ${s <= newReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200 dark:text-gray-700"
                      }`}
                  />
                </button>
              ))}
            </div>
            <Textarea
              placeholder="Share your experience..."
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              className="min-h-[120px] rounded-2xl bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 focus:ring-primary-500"
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl px-8 h-12 bg-primary-600 hover:bg-primary-700 text-white font-bold"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              Post Review
            </Button>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        <AnimatePresence>
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-gray-100">
                    <Image
                      src={review.user?.image || "/default-avatar.png"}
                      alt={review.user?.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{review.user?.name}</h4>
                    <p className="text-xs text-gray-400 font-medium">
                      {format(new Date(review.createdAt), "MMM d, yyyy")}
                    </p>
                    <div className="flex items-center gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-100 dark:text-gray-800"
                            }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {currentUserId === review.userId && (
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
              <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {review.comment}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ReviewSection;
