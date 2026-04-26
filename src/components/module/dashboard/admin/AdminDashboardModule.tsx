import { Activity, CalendarCheck2, DollarSign, Users } from "lucide-react";
import { getAdminDashboardData } from "../dashboard.server";
import { StatCard } from "../shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function AdminDashboardModule() {
    const data = await getAdminDashboardData();
    const stats = data.stats?.summary ?? {};

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard 
                    title="Total Users" 
                    value={stats.totalUsers ?? 0} 
                    hint="Registered accounts" 
                    tone="primary" 
                    icon={<Users size={16} />} 
                />
                <StatCard 
                    title="Total Events" 
                    value={stats.totalEvents ?? 0} 
                    hint="Published events" 
                    tone="secondary" 
                    icon={<CalendarCheck2 size={16} />} 
                />
                <StatCard 
                    title="Total Reviews" 
                    value={stats.totalReviews ?? 0} 
                    hint="Community feedback" 
                    tone="tertiary" 
                    icon={<Activity size={16} />} 
                />
                <StatCard 
                    title="Total Revenue" 
                    value={`$${stats.totalRevenue ?? 0}`} 
                    hint="Earned this period" 
                    tone="accent" 
                    icon={<DollarSign size={16} />} 
                />
            </div>

            {/* Recent items grid */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Users */}
                <Card className="border-primary-100/70 bg-white/90 shadow-md dark:border-slate-800 dark:bg-slate-900/80">
                    <CardHeader className="border-b border-primary-100/50 dark:border-slate-700">
                        <CardTitle className="text-primary-900 dark:text-primary-100">
                            Recent Users
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-5">
                        {data.users.slice(0, 6).map((user: any) => (
                            <div 
                                key={user.id} 
                                className="group flex items-center justify-between rounded-lg border border-primary-100/60 bg-gradient-to-r from-primary-50/40 to-secondary-50/40 p-3 transition-all hover:border-primary-200 hover:shadow-sm dark:border-slate-700 dark:from-slate-800/30 dark:to-slate-800/20"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                                        {user.name}
                                    </p>
                                    <p className="truncate text-xs text-slate-600 dark:text-slate-400">
                                        {user.email}
                                    </p>
                                </div>
                                <span className="ml-2 inline-block rounded-full bg-gradient-to-r from-primary-100 to-secondary-100 px-3 py-1 text-xs font-semibold text-primary-700 dark:from-primary-900/40 dark:to-secondary-900/40 dark:text-primary-300">
                                    {user.status}
                                </span>
                            </div>
                        ))}
                        {data.users.length === 0 && (
                            <div className="flex items-center justify-center rounded-lg border border-dashed border-slate-300 py-8 text-slate-500 dark:border-slate-600">
                                <p className="text-sm">No users yet</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Latest Events */}
                <Card className="border-primary-100/70 bg-white/90 shadow-md dark:border-slate-800 dark:bg-slate-900/80">
                    <CardHeader className="border-b border-primary-100/50 dark:border-slate-700">
                        <CardTitle className="text-primary-900 dark:text-primary-100">
                            Latest Events
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-5">
                        {data.events.slice(0, 6).map((event: any) => (
                            <div 
                                key={event.id} 
                                className="group rounded-lg border border-secondary-100/60 bg-gradient-to-r from-secondary-50/40 to-primary-50/40 p-3 transition-all hover:border-secondary-200 hover:shadow-sm dark:border-slate-700 dark:from-slate-800/30 dark:to-slate-800/20"
                            >
                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    {event.title}
                                </p>
                                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                                    <span className="font-medium">
                                        {new Date(event.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                    {event.venue && (
                                        <span className="ml-2">• {event.venue}</span>
                                    )}
                                </p>
                            </div>
                        ))}
                        {data.events.length === 0 && (
                            <div className="flex items-center justify-center rounded-lg border border-dashed border-slate-300 py-8 text-slate-500 dark:border-slate-600">
                                <p className="text-sm">No events yet</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}