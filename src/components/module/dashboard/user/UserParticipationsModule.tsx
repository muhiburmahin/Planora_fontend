"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Calendar,
  MapPin,
  Ticket,
  Info,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Participation } from "@/types/participition";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { participationService } from "@/services/participationService";

export function UserParticipationsModule() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [selectedParticipation, setSelectedParticipation] = useState<Participation | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const limit = 8;

  const { data: participationsData, isLoading: loading } = useQuery({
    queryKey: ["user-participations", page, statusFilter],
    queryFn: () => participationService.getMyParticipations({
      limit,
      page,
      ...(statusFilter !== "ALL" ? { status: statusFilter } : {}),
      sortBy: "createdAt",
      sortOrder: "desc",
    }),
    refetchInterval: 30000,
  });

  const participations = (participationsData?.data as unknown as Participation[]) || [];
  const totalPages = participationsData?.meta?.totalPage ?? participationsData?.meta?.totalPage ?? 1;

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-3 py-1 rounded-full font-bold">Confirmed</Badge>;
      case "PENDING":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 px-3 py-1 rounded-full font-bold">Awaiting Approval</Badge>;
      case "REJECTED":
        return <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/20 px-3 py-1 rounded-full font-bold">Declined</Badge>;
      case "CANCELLED":
        return <Badge className="bg-slate-500/10 text-slate-600 border-slate-500/20 px-3 py-1 rounded-full font-bold">Withdrawn</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-bold">{status}</Badge>;
    }
  };

  const filteredParticipations = participations.filter((p: Participation) =>
    p.event?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.ticketNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openDetails = (p: Participation) => {
    setSelectedParticipation(p);
    setDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      <header className="relative p-10 rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-900 to-primary-900 text-white overflow-hidden shadow-2xl shadow-primary-500/10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10">
              <Ticket className="w-8 h-8 text-primary-400" />
            </div>
            <Badge className="bg-primary-500/20 text-primary-300 border-primary-500/30 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
              My Experiences
            </Badge>
          </div>

          <h1 className="text-5xl font-black tracking-tight mb-4">Joined Events</h1>
          <p className="text-slate-400 font-medium text-lg max-w-2xl leading-relaxed">
            Manage your event participations, access digital tickets, and stay updated with your upcoming experiences.
          </p>
        </div>
      </header>

      <Card className="border-0 bg-white/60 shadow-xl shadow-slate-200/50 backdrop-blur-md dark:bg-slate-900/40 dark:shadow-none rounded-3xl">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <Input
              placeholder="Search by event title or ticket ID..."
              className="h-14 pl-12 rounded-2xl border-slate-200 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-slate-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {["ALL", "PENDING", "APPROVED", "REJECTED"].map((s) => (
              <Button
                key={s}
                variant={statusFilter === s ? "default" : "outline"}
                onClick={() => setStatusFilter(s)}
                className={`h-14 px-6 rounded-2xl font-bold transition-all ${statusFilter === s
                  ? "bg-primary-600 shadow-lg shadow-primary-500/30"
                  : "border-slate-200 hover:border-primary-300"
                  }`}
              >
                {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 bg-white/50 dark:bg-slate-900/50 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
            <Loader2 className="h-12 w-12 animate-spin text-primary-500 mb-4" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Synchronizing Data...</p>
          </div>
        ) : filteredParticipations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <AnimatePresence>
              {filteredParticipations.map((p: Participation, idx: number) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="group border-0 bg-white shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 rounded-[2rem] overflow-hidden dark:bg-slate-900">
                    <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent z-10" />
                      <div className="absolute top-4 left-4 z-20">
                        {getStatusBadge(p.status)}
                      </div>
                      <div className="absolute top-4 right-4 z-20">
                        <div className="bg-white/20 backdrop-blur-md rounded-full px-3 py-1 text-[10px] font-black text-white uppercase tracking-tighter">
                          ID: {p.ticketNumber?.slice(-8) || p.id.slice(0, 8)}
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-8 relative">
                      <div className="mb-6">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors line-clamp-1">
                          {p.event?.title}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1.5 text-sm font-bold">
                            <Calendar className="w-4 h-4 text-primary-500" />
                            {p.event?.date ? format(new Date(p.event.date), "PPP") : "N/A"}
                          </div>
                          <div className="flex items-center gap-1.5 text-sm font-bold">
                            <MapPin className="w-4 h-4 text-secondary-500" />
                            {p.event?.venue}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Paid</p>
                            <p className="text-sm font-black text-slate-900 dark:text-white">৳ {p.event?.registrationFee || 0}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="rounded-xl border-slate-200 font-bold hover:bg-slate-50 dark:hover:bg-slate-800"
                          onClick={() => openDetails(p)}
                        >
                          <Info className="w-4 h-4 mr-2" />
                          Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-96 bg-white shadow-xl shadow-slate-200/50 rounded-[2.5rem] p-10 text-center dark:bg-slate-900">
            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-12 h-12 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No Participations Found</h3>
            <p className="text-slate-400 font-medium mb-8 max-w-sm">You haven't joined any events yet.</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Page <span className="text-slate-900 dark:text-white">{page}</span> of {totalPages}
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="h-12 w-12 p-0 rounded-2xl border-slate-200 disabled:opacity-30"
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              className="h-12 w-12 p-0 rounded-2xl border-slate-200 disabled:opacity-30"
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl p-0 border-0 bg-white dark:bg-slate-950 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <DialogTitle className="sr-only">Participation Details</DialogTitle>
          {selectedParticipation && (
            <div className="flex flex-col">
              <div className="relative p-8 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <Badge className="bg-white/20 backdrop-blur-md text-white border-0 py-1 px-4 rounded-full text-xs font-black uppercase tracking-widest">
                      Digital Entry Pass
                    </Badge>
                    <div className="h-12 w-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                      <Ticket className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h2 className="text-4xl font-black mb-2 leading-tight">
                    {selectedParticipation.event?.title}
                  </h2>
                  <div className="flex items-center gap-4 text-primary-100 font-bold">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {selectedParticipation.event?.date ? format(new Date(selectedParticipation.event.date), "PPP") : "N/A"}
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {selectedParticipation.event?.time || "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8 relative bg-white dark:bg-slate-950">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-1 grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Ticket ID</p>
                      <p className="text-lg font-black text-primary-600 font-mono">
                        #{selectedParticipation.ticketNumber?.toUpperCase()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Registration Status</p>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(selectedParticipation.status)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-4">
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 h-14 rounded-2xl bg-slate-900 dark:bg-white dark:text-slate-950 text-white font-black hover:scale-[1.02] transition-transform shadow-xl shadow-slate-900/10"
                      onClick={() => window.print()}
                    >
                      Download PDF Ticket
                    </Button>
                    <Button
                      variant="outline"
                      className="h-14 rounded-2xl border-slate-200 px-6 font-black"
                      onClick={() => setDetailsOpen(false)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}