import { notificationService } from "@/services/notificationService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function UserNotificationsModule() {
    const response = await notificationService.server.getMyNotifications(undefined, {
        limit: 25,
        sortBy: "createdAt",
        sortOrder: "desc",
    });
    const notifications = response.data?.data ?? response.data ?? [];

    return (
        <Card className="border-primary-100/80">
            <CardHeader>
                <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {notifications.map((item: any) => (
                    <div key={item.id} className="rounded-lg border border-slate-100 p-3">
                        <p className="text-sm">{item.message}</p>
                        <p className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
                        <span className="mt-2 inline-flex rounded-full bg-primary-50 px-2 py-1 text-xs font-semibold text-primary-700">
                            {item.isRead ? "Read" : "Unread"}
                        </span>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
