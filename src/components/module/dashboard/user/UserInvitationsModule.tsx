import { invitationService } from "@/services/invitationService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function UserInvitationsModule() {
    const response = await invitationService.server.getMyInvitations();
    const invitations = response.data ?? [];

    return (
        <Card className="border-primary-100/80">
            <CardHeader>
                <CardTitle>My Invitations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {invitations.map((item: any) => (
                    <div key={item.id} className="rounded-lg border border-slate-100 p-3">
                        <p className="text-sm font-semibold">{item.event?.title ?? "Event Invitation"}</p>
                        <p className="text-xs text-slate-500">From: {item.sender?.name ?? "Unknown"}</p>
                        <span className="mt-2 inline-flex rounded-full bg-secondary-100 px-2 py-1 text-xs font-semibold text-secondary-700">
                            {item.status}
                        </span>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
