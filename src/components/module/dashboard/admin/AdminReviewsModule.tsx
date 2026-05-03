"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { reviewService } from "@/services/reviewService";
import { deleteReviewByAdminAction } from "@/actions/review.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Star, 
  Trash2, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  MessageSquare,
  User,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  MoreHorizontal
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "../shared/TableSkeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AdminReviewsModule() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  const fetchReviews = async () => {
    setLoading(true);
    const response = await reviewService.getAllReviews({ searchTerm }, { page, limit });
    if (response.success) {
      const payload = response.data as any;
      setReviews(payload.data ?? payload);
      setTotalPages(payload.meta?.totalPage || 1);
    } else {
      toast.error("Failed to load review registry");
    }
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchReviews();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, page]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this review? This action is irreversible.")) return;
    const result = await deleteReviewByAdminAction(id);
    if (result.success) {
      toast.success(result.message);
      fetchReviews();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Content Moderation</h1>
          <p className="text-sm font-medium text-slate-500">Monitor and moderate community feedback and ratings.</p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 shadow-inner group transition-all hover:scale-110">
           <Star className="h-7 w-7" />
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <Input 
          placeholder="Search reviews by comment, user, or event..." 
          className="h-14 pl-12 rounded-2xl border-slate-200 bg-white shadow-xl shadow-slate-100/50 focus:ring-primary-500"
          value={searchTerm}
          onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
          }}
        />
      </div>

      <Card className="overflow-hidden border-0 bg-white shadow-2xl shadow-slate-200/50 dark:bg-slate-900 dark:shadow-none">
        <div className="overflow-x-auto">
          {loading ? (
             <TableSkeleton columns={5} rows={8} />
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
                <TableRow>
                  <TableHead className="px-8 py-5 font-black uppercase tracking-widest text-slate-400">Reviewer</TableHead>
                  <TableHead className="px-8 py-5 font-black uppercase tracking-widest text-slate-400">Context</TableHead>
                  <TableHead className="px-8 py-5 font-black uppercase tracking-widest text-slate-400">Rating</TableHead>
                  <TableHead className="px-8 py-5 font-black uppercase tracking-widest text-slate-400">Commentary</TableHead>
                  <th className="px-8 py-5 text-right font-black uppercase tracking-widest text-slate-400">Moderation</th>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                {reviews.map((review, index) => (
                  <motion.tr 
                    key={review.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                  >
                    <TableCell className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-primary-600">
                             {review.user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[120px]">{review.user?.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{review.user?.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-5">
                      <div className="flex items-center gap-2">
                         <Calendar className="h-3.5 w-3.5 text-primary-500" />
                         <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate max-w-[150px]">{review.event?.title}</p>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-5">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} 
                          />
                        ))}
                        <span className="ml-2 text-xs font-black text-slate-900">{review.rating}.0</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-5">
                       <p className="text-xs text-slate-500 line-clamp-2 max-w-[250px] italic font-medium leading-relaxed">
                          "{review.comment}"
                       </p>
                    </TableCell>
                    <TableCell className="px-8 py-5 text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-slate-100">
                                    <MoreHorizontal className="h-5 w-5 text-slate-400" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 rounded-2xl border-0 p-2 shadow-2xl ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
                                <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    Moderation Logic
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-slate-50 dark:bg-slate-800" />
                                <DropdownMenuItem 
                                    onClick={() => handleDelete(review.id)}
                                    className="flex cursor-pointer items-center gap-2 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Purge Review
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800">
                                    <ShieldAlert className="h-4 w-4" />
                                    Flag for Review
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
                </AnimatePresence>
                {!loading && reviews.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-24 text-center">
                        <div className="flex flex-col items-center justify-center opacity-40">
                             <MessageSquare className="h-12 w-12 text-slate-300 mb-2" />
                             <p className="text-sm font-black uppercase tracking-widest text-slate-400">No community feedback detected</p>
                        </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Intelligence Pagination */}
        <div className="flex items-center justify-between border-t border-slate-50 bg-slate-50/20 px-8 py-6">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Segment <span className="text-primary-600 font-black">{page}</span> / {totalPages}
            </span>
            <div className="flex gap-3">
                <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={page <= 1 || loading}
                    className="h-10 rounded-2xl border-slate-100 font-bold px-6 transition-all active:scale-95"
                    onClick={() => setPage(p => p - 1)}
                >
                    <ChevronLeft className="h-4 w-4 mr-1.5" /> Previous
                </Button>
                <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={page >= totalPages || loading}
                    className="h-10 rounded-2xl border-slate-100 font-bold px-6 transition-all active:scale-95"
                    onClick={() => setPage(p => p + 1)}
                >
                    Next <ChevronRight className="h-4 w-4 ml-1.5" />
                </Button>
            </div>
        </div>
      </Card>
    </motion.div>
  );
}
