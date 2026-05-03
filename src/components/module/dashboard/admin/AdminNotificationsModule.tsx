"use client";

import { motion } from "framer-motion";
import { Bell, Info, AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function AdminNotificationsModule() {
  const alerts = [
    { id: 1, type: "system", title: "Security Patch Applied", time: "2h ago", message: "Kernel update v2.4.1 has been successfully deployed to all nodes.", icon: ShieldAlert, color: "text-blue-500", bg: "bg-blue-50" },
    { id: 2, type: "critical", title: "DB Cluster Latency", time: "5h ago", message: "High latency detected in Asia-East region. Automated scaling triggered.", icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50" },
    { id: 3, type: "info", title: "New Feature: Mesh Analytics", time: "1d ago", message: "The new mesh analytics module is now available for all admins.", icon: Info, color: "text-indigo-500", bg: "bg-indigo-50" },
    { id: 4, type: "success", title: "Backup Finalized", time: "1d ago", message: "Global database backup has been synchronized with secondary storage.", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Alert Registry</h1>
          <p className="text-sm font-medium text-slate-500">Monitor system-wide events and security protocols.</p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 shadow-inner group transition-all hover:scale-110">
           <Bell className="h-7 w-7" />
        </div>
      </div>

      <div className="grid gap-4">
        {alerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-0 bg-white shadow-xl shadow-slate-200/50 dark:bg-slate-900 dark:shadow-none overflow-hidden group">
              <CardContent className="p-6 flex items-start gap-5">
                <div className={`h-14 w-14 shrink-0 rounded-2xl ${alert.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                   <alert.icon className={`h-7 w-7 ${alert.color}`} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">{alert.title}</h3>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{alert.time}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-500 leading-relaxed">{alert.message}</p>
                  <div className="flex items-center gap-2 pt-2">
                     <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-100 border-0 text-[9px] font-black uppercase tracking-widest px-2">#SYSTEM</Badge>
                     <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-100 border-0 text-[9px] font-black uppercase tracking-widest px-2">#{alert.type.toUpperCase()}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
