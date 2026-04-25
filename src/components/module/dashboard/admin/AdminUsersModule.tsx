import { userService } from "@/services/userService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function AdminUsersModule() {
    const response = await userService.server.getAllUsers();
    const users = response.data ?? [];

    return (
        <Card className="border-primary-100/80">
            <CardHeader>
                <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {users.map((user: any) => (
                    <div key={user.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
                        <div>
                            <p className="text-sm font-semibold">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <span className="rounded-full bg-primary-50 px-2 py-1 font-semibold text-primary-700">
                                {user.role}
                            </span>
                            <span className="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">
                                {user.status}
                            </span>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
