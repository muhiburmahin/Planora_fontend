import { Activity, CalendarCheck2, DollarSign, Users } from "lucide-react";
import { getAdminDashboardData } from "../dashboard.server";
import { StatCard } from "../shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function AdminDashboardModule() {
    const data = await getAdminDashboardData();
    const stats = data.stats?.summary ?? {};

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard title="Total Users" value={stats.totalUsers ?? 0} hint="Registered accounts" tone="primary" icon={<Users size={16} />} />
                <StatCard title="Total Events" value={stats.totalEvents ?? 0} hint="Published events" tone="success" icon={<CalendarCheck2 size={16} />} />
                <StatCard title="Total Reviews" value={stats.totalReviews ?? 0} hint="Community feedback" tone="dark" icon={<Activity size={16} />} />
                <StatCard title="Revenue" value={`$${stats.totalRevenue ?? 0}`} hint="Delivered earnings" tone="info" icon={<DollarSign size={16} />} />
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
                <Card className="border-primary-100/80 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                    <CardHeader>
                        <CardTitle>Recent Users</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {data.users.slice(0, 6).map((user: any) => (
                            <div key={user.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                                </div>
                                <span className="rounded-full bg-primary-50 px-2 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                                    {user.status}
                                </span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="border-primary-100/80 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                    <CardHeader>
                        <CardTitle>Latest Events</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {data.events.slice(0, 6).map((event: any) => (
                            <div key={event.id} className="rounded-xl border border-slate-100 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{event.title}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {new Date(event.date).toLocaleDateString()} - {event.venue}
                                </p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
