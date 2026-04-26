import { UserEventsModule } from "@/components/module/dashboard/user/UserEventsModule";
import { requireDashboardUser } from "@/components/module/dashboard/dashboard.server";

export default async function Page() {
    const currentUser = await requireDashboardUser();
    return <UserEventsModule userId={currentUser.id} />;
}
