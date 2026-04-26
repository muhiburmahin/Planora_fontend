import { CalendarClock, ListTodo, MessageSquare, Ticket } from "lucide-react";
import { getUserDashboardData } from "../dashboard.server";
import { StatCard } from "../shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function UserDashboardModule() {
    const data = await getUserDashboardData();
    const stats = data.stats?.stats ?? {};

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard title="Organized Events" value={stats.myOrganizedEvents ?? 0} hint="Events you created" tone="primary" icon={<CalendarClock size={16} />} />
                <StatCard title="Joined Events" value={stats.myJoinedEvents ?? 0} hint="Registered participations" tone="secondary" icon={<Ticket size={16} />} />
                <StatCard title="Reviews Given" value={stats.totalReviewsGiven ?? 0} hint="Feedback submitted" tone="tertiary" icon={<MessageSquare size={16} />} />
                <StatCard title="Pending Invitations" value={stats.pendingInvitations ?? 0} hint="Awaiting response" tone="accent" icon={<ListTodo size={16} />} />
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
                <Card className="border-primary-100/80 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                    <CardHeader>
                        <CardTitle>My Latest Events</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {data.myEvents.slice(0, 6).map((event: any) => (
                            <div key={event.id} className="rounded-xl border border-slate-100 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{event.title}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {new Date(event.date).toLocaleDateString()} - {event.venue}
                                </p>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="border-primary-100/80 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                    <CardHeader>
                        <CardTitle>Recent Notifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {data.notifications.slice(0, 6).map((item: any) => (
                            <div key={item.id} className="rounded-xl border border-slate-100 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                                <p className="text-sm text-slate-900 dark:text-slate-100">{item.message}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(item.createdAt).toLocaleString()}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
