"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { participationService } from "@/services/participationService";
import { updateParticipationStatusAction } from "@/actions/participation.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Ticket,
  Search,
  Filter,
  User,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "../shared/TableSkeleton";

export function AdminParticipantsModule() {
  const [participations, setParticipations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  const fetchParticipations = async () => {
    setLoading(true);
    const response = await participationService.getAllParticipations({ searchTerm }, { page, limit });
    if (response.success) {
      const payload = response.data as any;
      setParticipations(payload.data ?? payload);
      setTotalPages(payload.meta?.totalPage || 1);
    } else {
      toast.error("Failed to load registration ledger");
    }
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchParticipations();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, page]);

  const handleStatusUpdate = async (id: string, status: string) => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("status", status);

    const result = await updateParticipationStatusAction(null, formData);
    if (result.success) {
      toast.success(`Entry ${status.toLowerCase()} finalized`);
      fetchParticipations();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Admission Control</h1>
          <p className="text-sm font-medium text-slate-500">Global ledger of event participation and status.</p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-100 text-secondary-600 shadow-inner group transition-all hover:rotate-12">
           <ShieldCheck className="h-7 w-7" />
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Search by participant name or event ID..." 
            className="h-12 pl-10 rounded-2xl border-slate-200 bg-white shadow-sm focus:ring-secondary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-12 rounded-2xl border-slate-200 gap-2 font-bold px-6">
           <Filter className="h-4 w-4" />
           Refine Ledger
        </Button>
      </div>

      <Card className="overflow-hidden border-0 bg-white shadow-2xl shadow-slate-200/50 dark:bg-slate-900 dark:shadow-none">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
              <TableRow>
                <TableHead className="px-8 py-5 font-black uppercase tracking-widest text-slate-400">Participant</TableHead>
                <TableHead className="px-8 py-5 font-black uppercase tracking-widest text-slate-400">Target Event</TableHead>
                <TableHead className="px-8 py-5 font-black uppercase tracking-widest text-slate-400">Status</TableHead>
                <TableHead className="px-8 py-5 font-black uppercase tracking-widest text-slate-400">Timestamp</TableHead>
                <TableHead className="px-8 py-5 text-right font-black uppercase tracking-widest text-slate-400">Management</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
              {loading ? (
                 <TableRow>
                    <TableCell colSpan={5} className="py-20">
                         <TableSkeleton columns={5} rows={5} />
                    </TableCell>
                 </TableRow>
              ) : participations.map((p, index) => (
                <motion.tr 
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                >
                  <TableCell className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 font-black text-slate-400 shadow-inner">
                        {p.user?.name?.[0]?.toUpperCase() || <User size={20} />}
                      </div>
                      <div>
                        <p className="text-base font-black text-slate-900 dark:text-white">{p.user?.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{p.user?.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-5">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-secondary-500" />
                        <p className="max-w-[200px] truncate font-black text-slate-700 dark:text-slate-200">{p.event?.title}</p>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-5">
                    <Badge className={`rounded-lg border-0 px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                      p.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200' :
                      p.status === 'PENDING' ? 'bg-amber-50 text-amber-600 ring-1 ring-amber-200' :
                      'bg-red-50 text-red-600 ring-1 ring-red-200'
                    }`}>
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-8 py-5">
                    <p className="text-[10px] font-black text-slate-400 uppercase">
                        {new Date(p.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </TableCell>
                  <TableCell className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-3">
                      {p.status === 'PENDING' ? (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-10 border-emerald-100 text-emerald-600 hover:bg-emerald-50 rounded-xl px-3 font-black transition-all hover:scale-105"
                            onClick={() => handleStatusUpdate(p.id, 'APPROVED')}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1.5" /> Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-10 border-red-100 text-red-600 hover:bg-red-50 rounded-xl px-3 font-black transition-all hover:scale-105"
                            onClick={() => handleStatusUpdate(p.id, 'REJECTED')}
                          >
                            <XCircle className="h-4 w-4 mr-1.5" /> Reject
                          </Button>
                        </>
                      ) : (
                        <div className="flex h-10 items-center px-4">
                           <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Immutable Entry</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
              </AnimatePresence>
              {!loading && participations.length === 0 && (
                 <TableRow>
                    <TableCell colSpan={5} className="py-24 text-center">
                        <div className="flex flex-col items-center justify-center opacity-40">
                             <Ticket className="h-12 w-12 text-slate-300 mb-2" />
                             <p className="text-sm font-black uppercase tracking-widest text-slate-400">No Admissions Found</p>
                        </div>
                    </TableCell>
                 </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-50 bg-slate-50/20 px-8 py-6">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                Ledger Page <span className="text-secondary-600 font-black">{page}</span> / {totalPages}
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
