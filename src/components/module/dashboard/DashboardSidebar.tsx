"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItem {
    label: string;
    href: string;
}

interface DashboardSidebarProps {
    role: "ADMIN" | "USER";
}

const userItems: NavItem[] = [
    { label: "Overview", href: "/dashboard" },
    { label: "My Events", href: "/dashboard/events" },
    { label: "Participations", href: "/dashboard/participations" },
    { label: "Invitations", href: "/dashboard/invitations" },
    { label: "Reviews", href: "/dashboard/reviews" },
    { label: "Notifications", href: "/dashboard/notifications" },
    { label: "Settings", href: "/dashboard/settings" },
];

const adminItems: NavItem[] = [
    { label: "Overview", href: "/dashboard" },
    { label: "All Events", href: "/dashboard/events" },
    { label: "Users", href: "/dashboard/users" },
    { label: "Participants", href: "/dashboard/participants" },
];

export function DashboardSidebar({ role }: DashboardSidebarProps) {
    const pathname = usePathname();
    const items = role === "ADMIN" ? adminItems : userItems;

    return (
        <aside className="sticky top-24 hidden h-[calc(100vh-7rem)] w-64 shrink-0 rounded-2xl border border-primary-100 bg-white/90 p-3 shadow-sm lg:block">
            <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-primary-700">
                {role === "ADMIN" ? "Admin Console" : "User Dashboard"}
            </p>
            <nav className="mt-2 space-y-1">
                {items.map((item) => {
                    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                active
                                    ? "bg-gradient-to-r from-primary-600 to-secondary-500 text-white"
                                    : "text-slate-600 hover:bg-primary-50 hover:text-primary-700"
                            )}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
