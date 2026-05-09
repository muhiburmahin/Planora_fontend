"use client";

import React, { useEffect, useState } from "react";
import { Star, MessageSquare, Award, Loader2, Calendar, Trash2, Edit3, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getMyReviewsAction, deleteReviewAction } from "@/actions/review.actions";
import { Review } from "@/types/review";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function UserReviewsModule() {
  const queryClient = useQueryClient();
  const { data: reviewsResponse, isLoading: loading } = useQuery({
    queryKey: ["user-reviews"],
    queryFn: () => getMyReviewsAction(),
    refetchInterval: 60000,
  });

  const reviews = reviewsResponse?.data || [];

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await deleteReviewAction(id);
      if (res.success) {
        toast.success("Review deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["user-reviews"] });
      } else {
        toast.error(res.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
        <p className="text-slate-400 font-bold animate-pulse">Loading your feedback...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 pb-20">
      <header className="relative p-12 rounded-[3rem] bg-gradient-to-br from-slate-900 via-slate-900 to-amber-900 text-white overflow-hidden shadow-2xl shadow-amber-500/10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-white/10 backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-inner">
              <Star className="w-10 h-10 text-amber-400" />
            </div>
            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
              Community Influence
            </Badge>
          </div>
          <h1 className="text-6xl font-black tracking-tighter mb-4 leading-none">My Reviews</h1>
          <p className="text-slate-400 font-medium text-xl max-w-2xl leading-relaxed">
            Your shared experiences help others discover amazing events and improve our community.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {reviews.length > 0 ? (
            reviews.map((review: any) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                layout
              >
                <Card className="group border-0 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 rounded-[2.5rem] overflow-hidden flex flex-col h-full">
                  <CardContent className="p-8 space-y-6 flex flex-col h-full">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-5 h-5 ${i < review.rating ? "text-amber-500 fill-amber-500" : "text-slate-200 dark:text-slate-700"}`} 
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {format(new Date(review.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>

                    <div className="space-y-2">
                       <Link 
                         href={`/events/${review.event?.id}`}
                         className="text-xl font-black text-slate-900 dark:text-white hover:text-amber-600 transition-colors inline-flex items-center gap-2 group/link"
                       >
                         {review.event?.title}
                         <ExternalLink className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                       </Link>
                    </div>

                    <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic flex-1">
                      "{review.comment}"
                    </p>

                    <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-slate-400" />
                         </div>
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Feedback Shared</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-10 w-10 rounded-xl text-slate-400 hover:text-amber-500 hover:bg-amber-50"
                        >
                          <Edit3 className="w-5 h-5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-10 w-10 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                          onClick={() => handleDelete(review.id)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 rounded-[3rem] p-10 text-center border border-slate-50 dark:border-slate-800">
              <div className="w-32 h-32 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-8 mx-auto">
                <MessageSquare className="w-16 h-16 text-slate-300" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3">No Feedback Yet</h3>
              <p className="text-slate-400 font-medium text-lg max-w-sm mx-auto">Your voice matters! Attend events and share your thoughts to start building your community profile.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
