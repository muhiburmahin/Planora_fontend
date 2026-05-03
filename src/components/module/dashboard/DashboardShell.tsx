import { ReactNode } from "react";
import type { DashboardUser } from "./dashboard.server";

interface DashboardShellProps {
    user: DashboardUser;
    children: ReactNode;
}

export function DashboardShell({ user, children }: DashboardShellProps) {
    return (
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {/* Welcome section */}
            <div className="mb-8 rounded-2xl border border-primary-100/60 bg-white/95 p-6 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90">
                <p className="text-xs font-bold uppercase tracking-widest text-primary-700 dark:text-primary-400">
                    Planora Workspace
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Welcome back, <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">{user.name}</span>
                </h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Manage your events, participations, invitations, and account seamlessly.
                </p>
            </div>

            {/* Page content */}
            <div className="space-y-6">
                {children}
            </div>
        </div>
    );
}