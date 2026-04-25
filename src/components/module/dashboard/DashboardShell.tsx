import { ReactNode } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import type { DashboardUser } from "./dashboard.server";

interface DashboardShellProps {
    user: DashboardUser;
    children: ReactNode;
}

export function DashboardShell({ user, children }: DashboardShellProps) {
    return (
        <div className="min-h-screen bg-gradient-primary-subtle">
            <div className="mx-auto max-w-7xl px-4 pb-10 pt-24 sm:px-6 lg:px-8">
                <div className="mb-6 rounded-2xl border border-primary-100 bg-white/90 p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">
                        Planora Workspace
                    </p>
                    <h1 className="mt-1 text-2xl font-bold text-slate-900">Welcome back, {user.name}</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Manage your events, participation, invitations, and account from one place.
                    </p>
                </div>

                <div className="flex items-start gap-6">
                    <DashboardSidebar role={user.role} />
                    <div className="min-w-0 flex-1">{children}</div>
                </div>
            </div>
        </div>
    );
}
