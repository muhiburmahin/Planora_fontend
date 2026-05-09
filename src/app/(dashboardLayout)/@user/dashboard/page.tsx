import React, { Suspense } from "react";
import UserOverview from "@/components/module/dashboard/user/UserOverview";
import UserOverviewSkeleton from "@/components/module/dashboard/user/UserOverviewSkeleton";
import { getDashboardStatsAction } from "@/actions/dashboard.actions";

async function DashboardData() {
  const result = await getDashboardStatsAction();

  if (!result.success || !result.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-destructive/5 rounded-2xl border border-destructive/20 p-8 text-center">
        <h2 className="text-2xl font-bold text-destructive mb-2">Error Loading Dashboard</h2>
        <p className="text-muted-foreground max-w-md">
          {result.message || "Something went wrong while fetching your dashboard data. Please try again later."}
        </p>
      </div>
    );
  }

  return <UserOverview stats={result.data} />;
}

export default function UserDashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Suspense fallback={<UserOverviewSkeleton />}>
        <DashboardData />
      </Suspense>
    </div>
  );
}
