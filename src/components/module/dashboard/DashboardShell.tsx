import { ReactNode } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import type { DashboardUser } from "./dashboard.server";

interface DashboardShellProps {
    user: DashboardUser;
    children: ReactNode;
}

export function DashboardShell({ user, children }: DashboardShellProps) {
    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 pb-8 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(147,51,234,0.18),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.12),transparent_40%)]" />
            <div className="relative mx-auto max-w-[1600px] px-4 pb-8 pt-24 sm:px-6 lg:px-8">
                <div className="mb-6 rounded-2xl border border-primary-100/70 bg-white/95 p-5 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/85">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-700 dark:text-primary-300">
                        Planora Workspace
                    </p>
                    <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
                        Welcome back, {user.name}
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
                        Manage your events, participation, invitations, and account from one place.
                    </p>
                </div>
                <DashboardSidebar user={user}>{children}</DashboardSidebar>
            </div>
        </div>
    );
}
