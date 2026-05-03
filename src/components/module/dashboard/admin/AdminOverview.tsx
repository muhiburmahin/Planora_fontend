"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { CalendarDays, TrendingUp, Users, Star, ArrowUpRight, Loader2, CheckCircle2, Activity as ActivityIcon, ArrowDownRight, Mail } from "lucide-react";
import { userService } from "@/services/userService";
import { AdminDashboardStats } from "@/types/user";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PIE_COLORS = ["#9333ea", "#f97316", "#7e22ce", "#ea580c", "#6b21a8", "#c2410c"];

export function AdminOverview() {
  const [data, setData] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await userService.getDashboardStats();
        if (response.success) {
          setData(response.data as AdminDashboardStats);
        } else {
          toast.error("Failed to load dashboard stats");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while fetching stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
        <p className="animate-pulse text-sm font-black uppercase tracking-widest text-slate-400">Synchronizing Intelligence...</p>
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    { label: "Total Users", value: data.summary.totalUsers, change: data.summary.userGrowthRate, icon: Users, color: "from-primary-600 to-primary-400", positive: true },
    { label: "Total Events", value: data.summary.totalEvents, change: "+5.2%", icon: CalendarDays, color: "from-secondary-500 to-secondary-400", positive: true },
    { label: "Feedback Loop", value: data.summary.totalReviews, change: "+12.1%", icon: Star, color: "from-primary-500 to-secondary-500", positive: true },
    // { label: "Pending Mesh", value: data.summary.pendingInvitations || 0, change: "-3.1%", icon: Mail, color: "from-rose-500 to-rose-400", positive: false },
  ];

  const pieData = data.categoryDistribution.map(item => ({
    name: item.name,
    value: item._count.events
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-10"
    >
      {/* Hero Analytics Header */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 p-10 text-white shadow-2xl"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <Badge className="bg-primary-500/20 text-primary-200 border-primary-500/30 mb-2">Platform Sentinel v2.0</Badge>
            <h1 className="text-4xl font-black tracking-tight lg:text-5xl">Executive <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">Intelligence</span></h1>
            <p className="mt-2 text-slate-400 max-w-lg font-medium leading-relaxed">
              Synthesizing real-time interactions into actionable insights for the Planora ecosystem.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="rounded-2xl bg-white/5 p-4 backdrop-blur-md border border-white/10 text-center min-w-[100px]">
              <p className="text-[10px] font-black uppercase text-slate-500">Live Nodes</p>
              <p className="text-2xl font-black text-emerald-400">{data.summary.totalEvents}</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4 backdrop-blur-md border border-white/10 text-center min-w-[100px]">
              <p className="text-[10px] font-black uppercase text-slate-500">Active Mesh</p>
              <p className="text-2xl font-black text-primary-400">{data.summary.totalUsers}</p>
            </div>
          </div>
        </div>
        {/* Animated Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary-500/20 blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-secondary-500/20 blur-[100px]"
        />
      </motion.div>

      {/* Dynamic Stat Mesh */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <motion.div
            key={s.label}
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative overflow-hidden rounded-[2rem] border border-white bg-white p-7 shadow-xl shadow-slate-200/50 transition-all dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{s.label}</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{s.value}</p>
                <div className="mt-4 flex items-center gap-2">
                  <div className={`flex items-center gap-0.5 rounded-full px-2.5 py-1 text-[10px] font-black ${s.positive ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/50" : "bg-rose-50 text-rose-600 ring-1 ring-rose-200/50"
                    }`}>
                    {s.positive ? <TrendingUp className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {s.change}
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Trend / 30D</span>
                </div>
              </div>
              <div className={`flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br ${s.color} text-white shadow-lg transition-all group-hover:rotate-12`}>
                <s.icon className="h-7 w-7" />
              </div>
            </div>
            {/* Background accent */}
            <div className={`absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-[0.03] transition-opacity`} />
          </motion.div>
        ))}
      </div>

      {/* Analytic Projections */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Growth Matrix */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="h-full overflow-hidden border-0 bg-white shadow-2xl shadow-slate-200/50 dark:bg-slate-900">
            <CardHeader className="flex flex-row items-center justify-between pb-8">
              <div className="space-y-1">
                <CardTitle className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Growth Velocity</CardTitle>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Monthly Event Projection</p>
              </div>
              <div className="flex gap-2">
                <div className="h-2 w-2 rounded-full bg-primary-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase text-slate-500">Live Stream</span>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={340}>
                <BarChart data={data.monthlyTrend}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#9333ea" stopOpacity={1} />
                      <stop offset="100%" stopColor="#f97316" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 800, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 800, fill: '#94a3b8' }} />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '15px' }}
                    itemStyle={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '12px' }}
                  />
                  <Bar dataKey="events" fill="url(#barGradient)" radius={[10, 10, 0, 0]} barSize={45} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sector Distribution */}
        <motion.div variants={itemVariants}>
          <Card className="h-full overflow-hidden border-0 bg-white shadow-2xl shadow-slate-200/50 dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-xl font-black text-slate-900 dark:text-white tracking-tight text-center">Taxonomy Mesh</CardTitle>
              <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Event Distribution</p>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={10} dataKey="value" stroke="none">
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-4 w-full">
                {pieData.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full shadow-sm" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}></div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase leading-none">{item.name}</p>
                      <p className="text-[9px] font-bold text-slate-400">{item.value} ENTRIES</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Real-time Activity Hub */}
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden border-0 bg-white shadow-2xl shadow-slate-200/50 dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 bg-slate-50/30 px-10 py-7 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-500/20">
                <ActivityIcon className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Active Pulse</CardTitle>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Real-time user engagement feed</p>
              </div>
            </div>
            <button className="group flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-xs font-black text-slate-900 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-slate-50 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
              Full Ledger
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-50 dark:border-slate-800">
                  <th className="px-10 py-6">Actor</th>
                  <th className="px-10 py-6">Interaction</th>
                  <th className="px-10 py-6">Operational Target</th>
                  <th className="px-10 py-6">Timestamp</th>
                  <th className="px-10 py-6 text-right">Integrity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                <AnimatePresence>
                  {data.recentActivities.map((act, idx) => (
                    <motion.tr
                      key={act.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group transition-all hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                    >
                      <td className="px-10 py-5">
                        <div className="flex items-center gap-4">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 font-black text-primary-600 shadow-inner dark:bg-slate-800 group-hover:scale-110 transition-transform">
                            {act.user?.name?.[0] || 'U'}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 dark:text-white">{act.user?.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{act.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-5">
                        <Badge variant="outline" className="rounded-lg border-blue-100 bg-blue-50/30 px-3 py-1 text-[9px] font-black text-blue-600 uppercase tracking-widest">
                          PARTICIPATION
                        </Badge>
                      </td>
                      <td className="px-10 py-5 font-black text-sm text-slate-700 dark:text-slate-200">
                        {act.event?.title}
                      </td>
                      <td className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase">
                        {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-10 py-5 text-right">
                        <div className="flex items-center justify-end gap-1.5 text-emerald-500 font-black text-[10px] uppercase">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          VERIFIED
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
