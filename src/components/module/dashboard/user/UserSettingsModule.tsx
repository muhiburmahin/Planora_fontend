import { userService } from "@/services/userService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function UserSettingsModule() {
    const response = await userService.server.getMyProfile();
    const user = response.data;

    return (
        <div className="grid gap-5 lg:grid-cols-2">
            <Card className="border-primary-100/80">
                <CardHeader>
                    <CardTitle>Account Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-700">
                    <p><span className="font-semibold">Name:</span> {user?.name}</p>
                    <p><span className="font-semibold">Email:</span> {user?.email}</p>
                    <p><span className="font-semibold">Role:</span> {user?.role}</p>
                    <p><span className="font-semibold">Status:</span> {user?.status}</p>
                </CardContent>
            </Card>

            <Card className="border-primary-100/80">
                <CardHeader>
                    <CardTitle>Profile Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-700">
                    <p><span className="font-semibold">Bio:</span> {user?.profile?.bio ?? "Not set"}</p>
                    <p><span className="font-semibold">Contact:</span> {user?.profile?.contactNumber ?? "Not set"}</p>
                    <p><span className="font-semibold">Address:</span> {user?.profile?.address ?? "Not set"}</p>
                </CardContent>
            </Card>
        </div>
    );
}
