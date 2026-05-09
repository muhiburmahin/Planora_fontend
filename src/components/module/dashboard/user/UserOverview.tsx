"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Mail, Activity } from "lucide-react";
import { format } from "date-fns";
import { UserOverviewStats } from "@/types/user";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/userService";

interface UserOverviewProps {
  stats: UserOverviewStats;
}

const UserOverview: React.FC<UserOverviewProps> = ({ stats: initialStats }) => {
  const { data: statsResponse } = useQuery({
    queryKey: ["user-dashboard-stats"],
    queryFn: () => userService.getUserDashboardStats(),
    initialData: { data: initialStats, success: true } as any,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const stats = statsResponse?.data || initialStats;
  const statCards = [
    {
      title: "Events Organized",
      value: stats.totalEventsOrganized,
      icon: <Calendar className="w-6 h-6" />,
      color: "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400",
      description: "Total events you have created",
    },
    {
      title: "Joined Events",
      value: stats.totalJoinedEvents,
      icon: <Users className="w-6 h-6" />,
      color: "bg-secondary-50 text-secondary-600 dark:bg-secondary-900/20 dark:text-secondary-400",
      description: "Events you are participating in",
    },
    {
      title: "Pending Invitations",
      value: stats.pendingInvitations,
      icon: <Mail className="w-6 h-6" />,
      color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
      description: "Invitations awaiting response",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "UPCOMING":
        return <Badge className="bg-primary-500/10 text-primary-600 border-0 rounded-full font-black">Upcoming</Badge>;
      case "ONGOING":
        return <Badge className="bg-green-500/10 text-green-600 border-0 rounded-full font-black">Ongoing</Badge>;
      case "COMPLETED":
        return <Badge variant="outline" className="border-slate-200 text-slate-500 rounded-full font-black">Completed</Badge>;
      default:
        return <Badge variant="outline" className="rounded-full">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto px-4 pb-20">
      {/* Header with High-End Branding */}
      <header className="relative p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-slate-900 via-slate-900 to-primary-900 text-white overflow-hidden shadow-2xl shadow-primary-500/10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <Badge className="bg-white/10 backdrop-blur-xl text-primary-200 border-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
              Performance Summary
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
              Dashboard <span className="text-primary-400">Overview</span>
            </h1>
            <p className="text-slate-400 font-medium text-lg md:text-xl max-w-xl leading-relaxed">
              Welcome back to your event hub. Here's a quick look at your current activities and achievements.
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="w-32 h-32 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 flex items-center justify-center shadow-inner group transition-transform hover:scale-110 duration-500">
              <Activity className="w-12 h-12 text-primary-400 group-hover:animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards - Premium Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {statCards.map((stat: any, index: number) => (
          <Card key={index} className="group border-0 shadow-xl shadow-slate-200/50 bg-white dark:bg-slate-900 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className={`p-4 rounded-2xl ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                <div className="h-1.5 w-12 bg-slate-100 dark:bg-slate-800 rounded-full" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{stat.title}</p>
                <div className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</div>
              </div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                {stat.description}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity Section */}
      <Card className="border-0 shadow-2xl shadow-slate-200/40 bg-white dark:bg-slate-900 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden">
        <CardHeader className="p-8 md:p-10 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl md:text-3xl font-black tracking-tight">Recent Activity</CardTitle>
            <p className="text-slate-400 font-medium text-sm">Latest updates from your events</p>
          </div>
          <Button variant="outline" className="w-full md:w-auto rounded-2xl border-slate-200 font-black px-6 h-12">
            View All Events
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-slate-50 dark:border-slate-800">
                  <TableHead className="px-10 h-16 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Event Details</TableHead>
                  <TableHead className="px-10 h-16 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Schedule</TableHead>
                  <TableHead className="px-10 h-16 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Category</TableHead>
                  <TableHead className="px-10 h-16 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentEvents.length > 0 ? (
                  stats.recentEvents.map((event: any) => (
                    <TableRow key={event.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors border-slate-50 dark:border-slate-800">
                      <TableCell className="px-10 py-6 font-black text-slate-900 dark:text-white">
                        <div className="flex flex-col">
                          <span className="truncate max-w-[200px]">{event.title}</span>
                          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">ID: {event.id.slice(0, 8)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-10 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold">{format(new Date(event.date), "MMM dd, yyyy")}</span>
                          <span className="text-xs text-slate-400 font-medium">{event.time}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-10 py-6">
                        <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-0 rounded-xl font-bold py-1 px-3">
                          {event.category.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-10 py-6">{getStatusBadge(event.status)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-40 text-center text-slate-400 font-medium italic">
                      No recent activity recorded yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="block md:hidden divide-y divide-slate-50 dark:divide-slate-800">
            {stats.recentEvents.length > 0 ? (
              stats.recentEvents.map((event: any) => (
                <div key={event.id} className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 min-w-0">
                      <h4 className="text-base font-black text-slate-900 dark:text-white truncate">{event.title}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase">{event.category.name}</p>
                    </div>
                    {getStatusBadge(event.status)}
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-primary-500" />
                      {format(new Date(event.date), "MMM dd")}
                    </div>
                    <span>{event.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-slate-400 font-medium italic">
                No recent activity recorded yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserOverview;
