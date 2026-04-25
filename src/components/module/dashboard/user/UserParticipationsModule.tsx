import { participationService } from "@/services/participationService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function UserParticipationsModule() {
    const response = await participationService.server.getMyParticipations({ limit: 25, sortBy: "createdAt", sortOrder: "desc" });
    const participations = response.data?.data ?? response.data ?? [];

    return (
        <Card className="border-primary-100/80">
            <CardHeader>
                <CardTitle>My Participations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {participations.map((item: any) => (
                    <div key={item.id} className="rounded-lg border border-slate-100 p-3">
                        <p className="text-sm font-semibold">{item.event?.title ?? "Event"}</p>
                        <p className="text-xs text-slate-500">Ticket: {item.ticketNumber ?? "N/A"}</p>
                        <span className="mt-2 inline-flex rounded-full bg-primary-50 px-2 py-1 text-xs font-semibold text-primary-700">
                            {item.status}
                        </span>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
