import { participationService } from "@/services/participationService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function AdminParticipantsModule() {
    const response = await participationService.server.getAllParticipations(undefined, {
        limit: 25,
        sortBy: "createdAt",
        sortOrder: "desc",
    });
    const participations = response.data?.data ?? response.data ?? [];

    return (
        <Card className="border-primary-100/80">
            <CardHeader>
                <CardTitle>Participant Requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {participations.map((item: any) => (
                    <div key={item.id} className="rounded-lg border border-slate-100 p-3">
                        <div className="flex items-center justify-between gap-2">
                            <div>
                                <p className="text-sm font-semibold">{item.user?.name ?? "User"}</p>
                                <p className="text-xs text-slate-500">{item.event?.title ?? "Event"}</p>
                            </div>
                            <span className="rounded-full bg-secondary-100 px-2 py-1 text-xs font-semibold text-secondary-700">
                                {item.status}
                            </span>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
