"use client";

import { Calendar, Ticket, MessageSquare, Bell } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const userStats = [
  { label: "My Events",     value: "7",  icon: Calendar,      color: "from-primary-600 to-secondary-500" },
  { label: "Participations",value: "23", icon: Ticket,         color: "from-secondary-500 to-primary-400" },
  { label: "Reviews",       value: "11", icon: MessageSquare,  color: "from-primary-500 to-secondary-600" },
  { label: "Notifications", value: "4",  icon: Bell,           color: "from-secondary-600 to-primary-600" },
];

const activityData = [
  { week: "W1", events: 1 },
  { week: "W2", events: 3 },
  { week: "W3", events: 2 },
  { week: "W4", events: 4 },
  { week: "W5", events: 2 },
];

const upcomingEvents = [
  { name: "Dhaka Music Fest", date: "Jun 10", role: "Organizer" },
  { name: "Tech Summit BD",   date: "Jun 14", role: "Participant" },
  { name: "Food Carnival",    date: "Jun 20", role: "Participant" },
];

export function UserOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Here's your activity overview.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {userStats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-primary-100/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{s.label}</p>
                <p className="mt-1 text-3xl font-extrabold text-slate-900 dark:text-slate-100">{s.value}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-white shadow`}>
                <s.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Line Chart + Upcoming */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-primary-100/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Weekly Event Activity</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="events" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-primary-100/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Upcoming Events</h2>
          <div className="space-y-3">
            {upcomingEvents.map((e) => (
              <div key={e.name} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{e.name}</p>
                  <p className="text-xs text-slate-500">{e.date}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  e.role === "Organizer"
                    ? "bg-primary-100 text-primary-700"
                    : "bg-secondary-100 text-secondary-700"
                }`}>
                  {e.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
