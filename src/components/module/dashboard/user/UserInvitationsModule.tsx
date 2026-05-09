"use client";

import React, { useEffect, useState } from "react";
import { Mail, Clock, CheckCircle2, XCircle, AlertCircle, Loader2, Calendar, MapPin, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getMyInvitationsAction, respondToInvitationAction } from "@/actions/invitation.actions";
import { Invitation } from "@/types/invitation";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { invitationService } from "@/services/invitationService";

export function UserInvitationsModule() {
  const queryClient = useQueryClient();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const { data: invitationsData, isLoading: loading } = useQuery({
    queryKey: ["user-invitations"],
    queryFn: () => invitationService.getMyInvitations(),
    refetchInterval: 30000,
  });

  const invitations = invitationsData?.data || [];

  const handleResponse = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      setProcessingId(id);
      const formData = new FormData();
      formData.append("id", id);
      formData.append("status", status);

      const result = await respondToInvitationAction(null, formData);
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["user-invitations"] });
        queryClient.invalidateQueries({ queryKey: ["navbar-notifications"] });
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
        <p className="text-slate-400 font-bold animate-pulse">Loading invitations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 pb-20">
      <header className="relative p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-slate-900 via-slate-900 to-primary-900 text-white overflow-hidden shadow-2xl shadow-primary-500/10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6 md:mb-8">
            <div className="p-3 md:p-4 bg-white/10 backdrop-blur-2xl rounded-[1.5rem] md:rounded-[2rem] border border-white/10 shadow-inner">
              <Mail className="w-8 h-8 md:w-10 md:h-10 text-primary-400" />
            </div>
            <Badge className="bg-primary-500/20 text-primary-300 border-primary-500/30 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest">
              Exclusive Invites
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 leading-none">Invitations</h1>
          <p className="text-slate-400 font-medium text-lg md:text-xl max-w-2xl leading-relaxed">
            Manage your incoming invitations and access requests for private experiences.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {invitations.length > 0 ? (
            invitations.map((inv: any) => (
              <motion.div
                key={inv.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
              >
                <Card className="group border-0 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row items-stretch">
                      {/* Left Side - Event Info */}
                      <div className="flex-1 p-6 md:p-8 space-y-6 border-b lg:border-b-0 lg:border-r border-slate-50 dark:border-slate-800">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1 min-w-0">
                            <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors truncate">
                              {inv.event?.title}
                            </h3>
                            <p className="text-sm text-slate-400 font-medium flex items-center gap-2">
                              Invited by <span className="text-slate-900 dark:text-white font-black truncate">{inv.sender?.name}</span>
                            </p>
                          </div>
                          <Badge className="shrink-0 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-0 px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                            {inv.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 shrink-0 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-500">
                              <Calendar className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Date</p>
                              <p className="text-xs md:text-sm font-black text-slate-900 dark:text-white truncate">
                                {inv.event?.date ? format(new Date(inv.event.date), "PPP") : "N/A"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 shrink-0 rounded-2xl bg-secondary-50 dark:bg-secondary-900/20 flex items-center justify-center text-secondary-500">
                              <MapPin className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Venue</p>
                              <p className="text-xs md:text-sm font-black text-slate-900 dark:text-white truncate">{inv.event?.venue}</p>
                            </div>
                          </div>
                        </div>

                        {inv.message && (
                          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-l-4 border-primary-500">
                             <p className="text-xs md:text-sm italic text-slate-600 dark:text-slate-400 font-medium">"{inv.message}"</p>
                          </div>
                        )}
                      </div>

                      {/* Right Side - Actions */}
                      <div className="lg:w-64 bg-slate-50/50 dark:bg-slate-800/30 p-6 md:p-8 flex flex-col justify-center gap-3">
                        <Button 
                          className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-black shadow-lg shadow-primary-500/20 gap-2 disabled:opacity-50"
                          onClick={() => handleResponse(inv.id, 'APPROVED')}
                          disabled={processingId === inv.id}
                        >
                          {processingId === inv.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                          Accept
                        </Button>
                        <Button 
                          variant="outline" 
                          className="h-12 md:h-14 rounded-xl md:rounded-2xl border-slate-200 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all gap-2"
                          onClick={() => handleResponse(inv.id, 'REJECTED')}
                          disabled={processingId === inv.id}
                        >
                          <XCircle className="w-5 h-5" />
                          Decline
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 rounded-[3rem] p-10 text-center border border-slate-50 dark:border-slate-800">
              <div className="w-32 h-32 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-8 mx-auto">
                <Mail className="w-16 h-16 text-slate-300" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Your Inbox is Quiet</h3>
              <p className="text-slate-400 font-medium text-lg max-w-sm mx-auto">When someone invites you to an exclusive event, you'll find the magic right here.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
