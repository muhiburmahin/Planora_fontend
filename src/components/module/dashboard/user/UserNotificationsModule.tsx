"use client";

import React from "react";
import { Bell, BellOff, Trash2, CheckCheck, Loader2, Calendar, CreditCard, MessageSquare, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { markAsReadAction, markAllAsReadAction, deleteNotificationAction, clearAllNotificationsAction } from "@/actions/notification.actions";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services/notificationService";

export function UserNotificationsModule() {
  const queryClient = useQueryClient();
  const { data: notifResponse, isLoading: loading } = useQuery({
    queryKey: ["user-notifications"],
    queryFn: () => notificationService.getMyNotifications(),
    refetchInterval: 30000,
  });

  const notifications = (notifResponse?.data as unknown as any[]) || [];
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const handleMarkAsRead = async (id: string) => {
    const res = await markAsReadAction(id);
    if (res.success) {
      queryClient.invalidateQueries({ queryKey: ["user-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["navbar-notifications"] });
    }
  };

  const handleMarkAllRead = async () => {
    const res = await markAllAsReadAction();
    if (res.success) {
      queryClient.invalidateQueries({ queryKey: ["user-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["navbar-notifications"] });
      toast.success("All caught up!");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteNotificationAction(id);
    if (res.success) {
      queryClient.invalidateQueries({ queryKey: ["user-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["navbar-notifications"] });
      toast.success("Notification removed");
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Are you sure you want to clear all notifications?")) return;
    const res = await clearAllNotificationsAction();
    if (res.success) {
      queryClient.invalidateQueries({ queryKey: ["user-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["navbar-notifications"] });
      toast.success("Notifications cleared");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "EVENT_INVITATION": return <Calendar className="w-5 h-5 text-primary-500" />;
      case "PAYMENT_SUCCESS": return <CreditCard className="w-5 h-5 text-green-500" />;
      case "REVIEW_RECEIVED": return <MessageSquare className="w-5 h-5 text-amber-500" />;
      case "SYSTEM_ALERT": return <AlertTriangle className="w-5 h-5 text-rose-500" />;
      default: return <Bell className="w-5 h-5 text-slate-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
        <p className="text-slate-400 font-bold animate-pulse">Fetching your updates...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4 pb-20">
      <header className="relative p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-slate-900 via-slate-900 to-rose-900 text-white overflow-hidden shadow-2xl shadow-rose-500/10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 md:p-4 bg-white/10 backdrop-blur-2xl rounded-[1.5rem] md:rounded-[2rem] border border-white/10 shadow-inner">
                <Bell className="w-8 h-8 md:w-10 md:h-10 text-rose-400" />
              </div>
              {unreadCount > 0 && (
                <Badge className="bg-rose-500 text-white border-0 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest animate-bounce">
                  {unreadCount} New Update{unreadCount > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">Notifications</h1>
            <p className="text-slate-400 font-medium text-lg md:text-xl max-w-md leading-relaxed">
              Stay in the loop with real-time updates from your community.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl md:rounded-2xl border-white/10 bg-white/5 backdrop-blur-md text-white hover:bg-white/20 h-10 md:h-12 px-4 md:px-6 font-black text-xs md:text-sm gap-2"
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
            >
              <CheckCheck className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Mark All Read
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl md:rounded-2xl border-white/10 bg-white/5 backdrop-blur-md text-white hover:bg-rose-500/20 h-10 md:h-12 px-4 md:px-6 font-black text-xs md:text-sm gap-2"
              onClick={handleClearAll}
              disabled={notifications.length === 0}
            >
              <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Clear All
            </Button>
          </div>
        </div>
      </header>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {notifications.length > 0 ? (
            notifications.map((n: any) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
              >
                <Card
                  className={`group border-0 transition-all duration-300 rounded-[2rem] overflow-hidden ${n.isRead
                    ? "bg-white/60 dark:bg-slate-900/40 opacity-80"
                    : "bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 border-l-4 border-rose-500"
                    }`}
                  onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                >
                  <CardContent className="p-5 md:p-6 flex items-center gap-4 md:gap-6 cursor-pointer">
                    <div className={`shrink-0 p-3 md:p-4 rounded-2xl ${n.isRead
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-400"
                      : "bg-rose-50 dark:bg-rose-900/20 text-rose-500"
                      }`}>
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                        <p className={`text-sm font-bold leading-relaxed ${n.isRead ? "text-slate-500" : "text-slate-900 dark:text-white"}`}>
                          {n.message}
                        </p>
                        <span className="text-[10px] font-black text-slate-400 uppercase whitespace-nowrap">
                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <div className="md:opacity-0 md:group-hover:opacity-100 flex items-center gap-2 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 active:bg-rose-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(n.id);
                        }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 rounded-[3rem] p-10 text-center border border-slate-50 dark:border-slate-800">
              <div className="w-32 h-32 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-8 mx-auto">
                <BellOff className="w-16 h-16 text-slate-300" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3">No New Updates</h3>
              <p className="text-slate-400 font-medium text-lg max-w-sm mx-auto">When things happen in your Planora world, we'll make sure you're the first to know.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}