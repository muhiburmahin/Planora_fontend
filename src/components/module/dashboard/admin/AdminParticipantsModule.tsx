"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { participationService } from "@/services/participationService";
import { updateParticipationStatusAction } from "@/actions/participation.actions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  User,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Ticket,
  Mail,
  History
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "../shared/TableSkeleton";

export function AdminParticipantsModule() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 8;

  const { data: participationResponse, isLoading: loading } = useQuery({
    queryKey: ["admin-participations", searchTerm, page],
    queryFn: () => participationService.getAllParticipations({ searchTerm }, { page, limit }),
    refetchInterval: 60000,
  });

  const participations = (participationResponse?.data as any)?.data ?? participationResponse?.data ?? [];
  const totalPages = (participationResponse?.data as any)?.meta?.totalPage || 1;

  const handleStatusUpdate = async (id: string, status: string) => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("status", status);

    const result = await updateParticipationStatusAction(null, formData);
    if (result.success) {
      toast.success(`Entry ${status.toLowerCase()} finalized`);
      queryClient.invalidateQueries({ queryKey: ["admin-participations"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] });
    } else {
      toast.error(result.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-6 space-y-6 max-w-7xl"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Admission Control
          </h1>
          <p className="text-sm font-medium text-slate-500">Manage global event participations and status.</p>
        </div>
        <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-100 text-secondary-600 shadow-sm transition-transform hover:rotate-6">
          <ShieldCheck className="h-6 w-6" />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-secondary-500 transition-colors" />
          <Input
            placeholder="Search participant or email..."
            className="h-12 pl-11 rounded-xl border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-secondary-500/20 transition-all dark:bg-slate-900 dark:border-slate-800"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Button variant="outline" className="h-12 rounded-xl border-slate-200 gap-2 font-bold px-5 hover:bg-slate-50 dark:border-slate-800">
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Refine Ledger</span>
        </Button>
      </div>

      <Card className="overflow-hidden border-0 bg-white shadow-xl shadow-slate-200/50 dark:bg-slate-900 dark:shadow-none ring-1 ring-slate-100 dark:ring-slate-800">

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          {loading ? (
            <TableSkeleton columns={5} rows={8} />
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b">
                <TableRow>
                  <TableHead className="px-6 py-4 font-bold uppercase text-[11px] tracking-widest text-slate-500">Participant</TableHead>
                  <TableHead className="px-6 py-4 font-bold uppercase text-[11px] tracking-widest text-slate-500">Event</TableHead>
                  <TableHead className="px-6 py-4 font-bold uppercase text-[11px] tracking-widest text-slate-500">Status</TableHead>
                  <TableHead className="px-6 py-4 font-bold uppercase text-[11px] tracking-widest text-slate-500">Date</TableHead>
                  <TableHead className="px-6 py-4 text-right font-bold uppercase text-[11px] tracking-widest text-slate-500">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {participations.map((p: any, index: number) => (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 rounded-lg bg-gradient-to-br from-secondary-100 to-primary-50 flex items-center justify-center font-black text-secondary-600 border border-secondary-200/30 text-sm">
                            {p.user?.name?.[0]?.toUpperCase() || <User size={16} />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{p.user?.name}</p>
                            <div className="flex items-center text-[10px] text-slate-400 font-medium">
                              <Mail className="h-3 w-3 mr-1" /> {p.user?.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-2 max-w-[180px]">
                          <Calendar className="h-3.5 w-3.5 text-secondary-400 shrink-0" />
                          <p className="font-bold text-slate-700 dark:text-slate-300 truncate text-sm">{p.event?.title}</p>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge variant="outline" className={`rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider border-0 ring-1 ring-inset ${p.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 ring-emerald-200/50' :
                            p.status === 'PENDING' ? 'bg-amber-50 text-amber-600 ring-amber-200/50' :
                              'bg-rose-50 text-rose-600 ring-rose-200/50'
                          }`}>
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex flex-col text-[10px] font-bold text-slate-400 uppercase">
                          <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {p.status === 'PENDING' ? (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-full"
                                onClick={() => handleStatusUpdate(p.id, 'APPROVED')}
                              >
                                <CheckCircle2 className="h-5 w-5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-full"
                                onClick={() => handleStatusUpdate(p.id, 'REJECTED')}
                              >
                                <XCircle className="h-5 w-5" />
                              </Button>
                            </>
                          ) : (
                            <History className="h-4 w-4 text-slate-300" />
                          )}
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          )}
        </div>

        {/* Mobile View: Cards */}
        <div className="md:hidden">
          {loading ? (
            <div className="p-4 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-40 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="divide-y dark:divide-slate-800">
              {participations.map((p: any, index: number) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600">
                        {p.user?.name?.[0] || 'P'}
                      </div>
                      <div>
                        <p className="text-sm font-black dark:text-white">{p.user?.name}</p>
                        <p className="text-[10px] text-slate-500 truncate max-w-[120px]">{p.user?.email}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={`text-[9px] font-bold ${p.status === 'APPROVED' ? 'text-emerald-600 bg-emerald-50' :
                        p.status === 'PENDING' ? 'text-amber-600 bg-amber-50' : 'text-rose-600 bg-rose-50'
                      }`}>
                      {p.status}
                    </Badge>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 uppercase font-bold">Event</span>
                      <span className="text-slate-700 dark:text-slate-300 font-bold truncate max-w-[150px]">{p.event?.title}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 uppercase font-bold">Date</span>
                      <span className="text-slate-500 font-bold">{new Date(p.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {p.status === 'PENDING' && (
                    <div className="flex gap-2 pt-1">
                      <Button
                        onClick={() => handleStatusUpdate(p.id, 'APPROVED')}
                        className="flex-1 h-10 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleStatusUpdate(p.id, 'REJECTED')}
                        className="flex-1 h-10 rounded-lg border-rose-200 text-rose-600 text-xs font-bold"
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Empty State */}
        {!loading && participations.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
            <Ticket className="h-12 w-12 text-slate-200" />
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No Admissions Found</p>
          </div>
        )}

        {/* Improved Pagination */}
        <div className="px-4 py-4 md:px-8 md:py-6 border-t bg-slate-50/30 dark:bg-slate-800/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Page <span className="text-secondary-600">{page}</span> of {totalPages}
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || loading}
              className="flex-1 sm:flex-none h-9 rounded-lg font-bold px-4"
              onClick={() => setPage(p => p - 1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || loading}
              className="flex-1 sm:flex-none h-9 rounded-lg font-bold px-4"
              onClick={() => setPage(p => p + 1)}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}