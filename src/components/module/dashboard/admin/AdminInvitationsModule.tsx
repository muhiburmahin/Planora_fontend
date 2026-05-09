"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { invitationService } from "@/services/invitationService";
import { cleanupInvitationsAction } from "@/actions/invitation.actions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Mail, 
  Trash2, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Filter,
  User,
  Calendar,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "../shared/TableSkeleton";

export function AdminInvitationsModule() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [isCleaning, setIsCleaning] = useState(false);
  const limit = 8;

  const { data: invitationsResponse, isLoading: loading } = useQuery({
    queryKey: ["admin-invitations", searchTerm, page],
    queryFn: () => invitationService.getAllInvitations({ searchTerm }, { page, limit }),
    refetchInterval: 60000,
  });

  const invitations = (invitationsResponse?.data as any)?.data ?? invitationsResponse?.data ?? [];
  const totalPages = (invitationsResponse?.data as any)?.meta?.totalPage || 1;

  const handleCleanup = async () => {
    if (!confirm("Are you sure? This will archive all processed or stale invitations.")) return;
    setIsCleaning(true);
    const result = await cleanupInvitationsAction();
    setIsCleaning(false);
    if (result.success) {
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: ["admin-invitations"] });
    } else {
      toast.error(result.message);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Communication Mesh</h1>
          <p className="text-sm font-medium text-slate-500">Audit and manage global event invitation flows.</p>
        </div>
        <Button 
          onClick={handleCleanup} 
          disabled={isCleaning}
          variant="outline"
          className="rounded-2xl border-rose-200 text-rose-600 hover:bg-rose-50 px-6 font-black transition-all hover:scale-105"
        >
          {isCleaning ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
          Cleanup Registry
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Search by sender, receiver, or event..." 
            className="h-12 pl-10 rounded-2xl border-slate-200 bg-white shadow-sm focus:ring-primary-500"
            value={searchTerm}
            onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
            }}
          />
        </div>
        <Button variant="outline" className="h-12 rounded-2xl border-slate-200 gap-2 font-bold px-6">
           <Filter className="h-4 w-4" />
           Filter Ledger
        </Button>
      </div>

      <Card className="overflow-hidden border-0 bg-white shadow-2xl shadow-slate-200/50 dark:bg-slate-900 dark:shadow-none">
        {/* Desktop View: Advanced Mesh Ledger */}
        <div className="hidden md:block overflow-x-auto">
          {loading ? (
             <TableSkeleton columns={5} rows={8} />
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
                <TableRow>
                  <TableHead className="px-8 py-5 font-black uppercase tracking-widest text-slate-400">Interaction Pair</TableHead>
                  <TableHead className="px-8 py-5 font-black uppercase tracking-widest text-slate-400">Contextual Target</TableHead>
                  <TableHead className="px-8 py-5 font-black uppercase tracking-widest text-slate-400">Current Status</TableHead>
                  <TableHead className="px-8 py-5 font-black uppercase tracking-widest text-slate-400">Timestamp</TableHead>
                  <TableHead className="px-8 py-5 text-right font-black uppercase tracking-widest text-slate-400">Integrity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                {invitations.map((invite: any, index: number) => (
                  <motion.tr 
                    key={invite.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                  >
                    <TableCell className="px-8 py-5">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[9px] font-black uppercase text-blue-600 bg-blue-50 border-blue-100">FROM</Badge>
                            <span className="text-sm font-black text-slate-900 dark:text-white">{invite.sender?.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 border-emerald-100">TO</Badge>
                            <span className="text-sm font-black text-slate-900 dark:text-white">{invite.receiver?.name}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-5">
                      <div className="flex items-center gap-2">
                         <Calendar className="h-3.5 w-3.5 text-primary-500" />
                         <p className="max-w-[200px] truncate font-black text-slate-700 dark:text-slate-200">{invite.event?.title}</p>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-5">
                      <Badge className={`rounded-lg border-0 px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                        invite.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200' :
                        invite.status === 'PENDING' ? 'bg-amber-50 text-amber-600 ring-1 ring-amber-200' :
                        'bg-rose-50 text-red-600 ring-1 ring-rose-200'
                      }`}>
                        {invite.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-8 py-5">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                         {new Date(invite.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </TableCell>
                    <TableCell className="px-8 py-5 text-right">
                       <div className="flex justify-end">
                           <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-300 transition-colors group-hover:bg-primary-50 group-hover:text-primary-400">
                               <AlertCircle className="h-5 w-5" />
                           </div>
                       </div>
                    </TableCell>
                  </motion.tr>
                ))}
                </AnimatePresence>
                {!loading && invitations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-24 text-center">
                        <div className="flex flex-col items-center justify-center opacity-40">
                             <Mail className="h-12 w-12 text-slate-300 mb-2" />
                             <p className="text-sm font-black uppercase tracking-widest text-slate-400">No communication logs recorded</p>
                        </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Mobile View: Intelligence Mesh Cards */}
        <div className="block md:hidden">
            {loading ? (
                <div className="p-6 space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-44 rounded-3xl bg-slate-100 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="divide-y divide-slate-50 dark:divide-slate-800">
                    <AnimatePresence>
                        {invitations.map((invite: any, index: number) => (
                            <motion.div 
                                key={invite.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-6 space-y-5"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-primary-500" />
                                        <h3 className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[200px]">
                                            {invite.event?.title}
                                        </h3>
                                    </div>
                                    <Badge className={`rounded-lg border-0 px-2 py-1 text-[9px] font-black uppercase ${
                                        invite.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' :
                                        invite.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-red-600'
                                    }`}>
                                        {invite.status}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 dark:bg-slate-800/50">
                                        <div className="space-y-0.5">
                                            <p className="text-[9px] font-black text-slate-400 uppercase">Sender</p>
                                            <p className="text-xs font-black text-slate-700 dark:text-slate-200">{invite.sender?.name}</p>
                                        </div>
                                        <div className="h-1 w-4 bg-slate-200 rounded-full" />
                                        <div className="space-y-0.5 text-right">
                                            <p className="text-[9px] font-black text-slate-400 uppercase">Recipient</p>
                                            <p className="text-xs font-black text-slate-700 dark:text-slate-200">{invite.receiver?.name}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between px-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase">
                                        Sent {new Date(invite.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </p>
                                    <AlertCircle className="h-4 w-4 text-slate-200" />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
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
