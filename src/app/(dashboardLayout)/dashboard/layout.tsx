import { DashboardShell } from "@/components/module/dashboard/DashboardShell";
import { requireDashboardUser } from "@/components/module/dashboard/dashboard.server";

export default async function DashboardRoleLayout({
    admin,
    user,
}: {
    admin: React.ReactNode;
    user: React.ReactNode;
}) {
    const currentUser = await requireDashboardUser();

    return (
        <DashboardShell user={currentUser}>
            {currentUser.role === "ADMIN" ? admin : user}
        </DashboardShell>
    );
}
