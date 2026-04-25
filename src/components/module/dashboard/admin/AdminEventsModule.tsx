import Link from "next/link";
import { eventService } from "@/services/eventService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export async function AdminEventsModule() {
    const response = await eventService.server.list({ limit: 25, sortBy: "createdAt", sortOrder: "desc" });
    const events = response.data?.data ?? response.data ?? [];

    return (
        <Card className="border-primary-100/80">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>All Events</CardTitle>
                <Button asChild className="bg-primary-600 hover:bg-primary-700">
                    <Link href="/events">Browse Public Page</Link>
                </Button>
            </CardHeader>
            <CardContent className="space-y-3">
                {events.map((event: any) => (
                    <div key={event.id} className="rounded-lg border border-slate-100 p-3">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="font-semibold">{event.title}</p>
                                <p className="text-xs text-slate-500">
                                    Organizer: {event.organizer?.name ?? "Unknown"}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {new Date(event.date).toLocaleDateString()} - {event.venue}
                                </p>
                            </div>
                            <span className="rounded-full bg-secondary-100 px-2 py-1 text-xs font-semibold text-secondary-700">
                                {event.type}
                            </span>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
