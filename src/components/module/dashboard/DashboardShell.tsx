import { ReactNode } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import type { DashboardUser } from "./dashboard.server";
import Link from "next/link";

interface DashboardShellProps {
    user: DashboardUser;
    children: ReactNode;
}

export function DashboardShell({ user, children }: DashboardShellProps) {
    const mobileItems = user.role === "ADMIN"
        ? [
            { label: "Overview", href: "/dashboard" },
            { label: "Events", href: "/dashboard/events" },
            { label: "Users", href: "/dashboard/users" },
            { label: "Participants", href: "/dashboard/participants" },
        ]
        : [
            { label: "Overview", href: "/dashboard" },
            { label: "Events", href: "/dashboard/events" },
            { label: "Participations", href: "/dashboard/participations" },
            { label: "Invitations", href: "/dashboard/invitations" },
            { label: "Notifications", href: "/dashboard/notifications" },
            { label: "Settings", href: "/dashboard/settings" },
        ];

    return (
        <div className="min-h-screen bg-gradient-primary-subtle dark:from-slate-950 dark:to-slate-900">
            <div className="mx-auto max-w-7xl px-4 pb-10 pt-24 sm:px-6 lg:px-8">
                <div className="mb-6 rounded-2xl border border-primary-100 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">
                        Planora Workspace
                    </p>
                    <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">Welcome back, {user.name}</h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
                        Manage your events, participation, invitations, and account from one place.
                    </p>
                </div>

                <div className="mb-4 flex gap-2 overflow-x-auto lg:hidden">
                    {mobileItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="whitespace-nowrap rounded-full border border-primary-200 bg-white px-3 py-1.5 text-xs font-semibold text-primary-700 dark:border-slate-700 dark:bg-slate-900 dark:text-primary-300"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-start gap-6">
                    <DashboardSidebar role={user.role} />
                    <div className="min-w-0 flex-1">{children}</div>
                </div>
            </div>
        </div>
    );
}
