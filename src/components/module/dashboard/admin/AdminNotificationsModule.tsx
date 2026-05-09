"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BellOff, Trash2, CheckCheck, Loader2, Calendar, MessageSquare, ShieldAlert, CheckCircle, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services/notificationService";
import { markAsReadAction, markAllAsReadAction, deleteNotificationAction, clearAllNotificationsAction } from "@/actions/notification.actions";
import { formatDistanceToNow } from "date-fns";

export function AdminNotificationsModule() {
  const queryClient = useQueryClient();
  const { data: notifResponse, isLoading: loading } = useQuery({
    queryKey: ["admin-notifications"],
    queryFn: () => notificationService.getMyNotifications(),
    refetchInterval: 30000,
  });

  const notifications = (notifResponse?.data as unknown as any[]) || [];
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const handleMarkAsRead = async (id: string) => {
    const res = await markAsReadAction(id);
    if (res.success) {
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["navbar-notifications"] });
    }
  };

  const handleMarkAllRead = async () => {
    const res = await markAllAsReadAction();
    if (res.success) {
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["navbar-notifications"] });
      toast.success("Admin registry synchronized");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteNotificationAction(id);
    if (res.success) {
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["navbar-notifications"] });
      toast.success("Entry removed from ledger");
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Are you sure you want to purge the notification registry?")) return;
    const res = await clearAllNotificationsAction();
    if (res.success) {
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["navbar-notifications"] });
      toast.success("Registry cleared");
    }
  };

  const getIcon = (type: string) => {
    const iconClass = "w-5 h-5 md:w-6 md:h-6";
    switch (type) {
      case "SYSTEM_ALERT": return <ShieldAlert className={`${iconClass} text-indigo-500`} />;
      case "EVENT_INVITATION": return <Calendar className={`${iconClass} text-primary-500`} />;
      case "PAYMENT_SUCCESS": return <CheckCircle className={`${iconClass} text-emerald-500`} />;
      case "REVIEW_RECEIVED": return <MessageSquare className={`${iconClass} text-amber-500`} />;
      default: return <Bell className={`${iconClass} text-slate-400`} />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "SYSTEM_ALERT": return "bg-indigo-50 dark:bg-indigo-900/20";
      case "EVENT_INVITATION": return "bg-primary-50 dark:bg-primary-900/20";
      case "PAYMENT_SUCCESS": return "bg-emerald-50 dark:bg-emerald-900/20";
      case "REVIEW_RECEIVED": return "bg-amber-50 dark:bg-amber-900/20";
      default: return "bg-slate-50 dark:bg-slate-800";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
        <p className="text-slate-500 font-bold animate-pulse text-sm">Accessing Alert Registry...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-8 pb-24"
    >
      {/* Header Section */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">Alerts</h1>
              {unreadCount > 0 && (
                <Badge className="bg-primary-600 text-white border-0 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                  {unreadCount} NEW
                </Badge>
              )}
            </div>
            <p className="text-sm md:text-base font-medium text-slate-500">System updates and administrative updates.</p>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              className="flex-1 sm:flex-none rounded-xl border-slate-200 h-11 px-4 text-xs font-bold gap-2 hover:bg-primary-50"
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
            >
              <CheckCheck className="w-4 h-4" />
              <span className="inline">Mark Read</span>
            </Button>
            <Button
              variant="outline"
              className="flex-1 sm:flex-none rounded-xl border-slate-200 h-11 px-4 text-xs font-bold gap-2 hover:bg-rose-50"
              onClick={handleClearAll}
              disabled={notifications.length === 0}
            >
              <Trash2 className="w-4 h-4" />
              <span className="inline">Purge</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {notifications.length > 0 ? (
            notifications.map((n: any, index: number) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <Card
                  className={`group border-0 transition-all duration-300 rounded-3xl overflow-hidden shadow-sm hover:shadow-md ${n.isRead
                      ? "bg-white/60 dark:bg-slate-900/40 opacity-75"
                      : "bg-white dark:bg-slate-900 ring-1 ring-primary-100 dark:ring-primary-900/30"
                    }`}
                  onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                >
                  <CardContent className="p-4 md:p-6 flex flex-row items-start gap-4 cursor-pointer relative">
                    {/* Icon */}
                    <div className={`shrink-0 h-12 w-12 md:h-14 md:w-14 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6 ${getBgColor(n.type)}`}>
                      {getIcon(n.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-2 pr-8 md:pr-0">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                          </span>
                          {!n.isRead && <div className="h-2 w-2 rounded-full bg-primary-600 md:hidden" />}
                        </div>
                        <p className={`text-sm md:text-base font-bold leading-snug ${n.isRead ? "text-slate-500" : "text-slate-900 dark:text-white"}`}>
                          {n.message}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-500 border-0 text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md">#SYSTEM</Badge>
                        <Badge className={`${getBgColor(n.type)} border-0 text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md`}>#{n.type.replace('_', ' ')}</Badge>
                      </div>
                    </div>

                    {/* Desktop Action (Hover) & Mobile Action */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 md:opacity-0 md:group-hover:opacity-100 transition-all">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(n.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-900 rounded-[2.5rem] px-6 text-center shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <BellOff className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Ledger is Empty</h3>
              <p className="text-slate-400 font-medium text-sm max-w-xs mx-auto">All system events have been processed. No pending alerts.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}