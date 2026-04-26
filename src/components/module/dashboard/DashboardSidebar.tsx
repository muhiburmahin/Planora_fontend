"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    ArrowUpRight,
    CalendarPlus2,
    LayoutDashboard,
    CalendarDays,
    Users,
    UserCog,
    Bell,
    Settings,
    Ticket,
    MessageSquare,
    Tags,
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { ReactNode } from "react";
import type { DashboardUser } from "./dashboard.server";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface NavItem {
    label: string;
    href: string;
    icon: ReactNode;
}

interface DashboardSidebarProps {
    user: DashboardUser;
    children: ReactNode;
}

const userItems: NavItem[] = [
    { label: "Overview", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: "My Events", href: "/dashboard/events", icon: <CalendarDays className="h-4 w-4" /> },
    { label: "Participations", href: "/dashboard/participations", icon: <Ticket className="h-4 w-4" /> },
    { label: "Invitations", href: "/dashboard/invitations", icon: <Users className="h-4 w-4" /> },
    { label: "Reviews", href: "/dashboard/reviews", icon: <MessageSquare className="h-4 w-4" /> },
    { label: "Notifications", href: "/dashboard/notifications", icon: <Bell className="h-4 w-4" /> },
    { label: "Settings", href: "/dashboard/settings", icon: <Settings className="h-4 w-4" /> },
];

const adminItems: NavItem[] = [
    { label: "Overview", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: "All Events", href: "/dashboard/events", icon: <CalendarDays className="h-4 w-4" /> },
    { label: "Categories", href: "/dashboard/categories", icon: <Tags className="h-4 w-4" /> },
    { label: "Users", href: "/dashboard/users", icon: <UserCog className="h-4 w-4" /> },
    { label: "Participants", href: "/dashboard/participants", icon: <Users className="h-4 w-4" /> },
];

const pageTitleMap: Record<string, string> = {
    "/dashboard": "Overview",
    "/dashboard/events": "Events",
    "/dashboard/categories": "Categories",
    "/dashboard/users": "Users",
    "/dashboard/participants": "Participants",
    "/dashboard/participations": "Participations",
    "/dashboard/invitations": "Invitations",
    "/dashboard/reviews": "Reviews",
    "/dashboard/notifications": "Notifications",
    "/dashboard/settings": "Settings",
};

function getPageTitle(pathname: string) {
    const matched = Object.keys(pageTitleMap)
        .sort((a, b) => b.length - a.length)
        .find((key) => pathname === key || pathname.startsWith(`${key}/`));

    return matched ? pageTitleMap[matched] : "Dashboard";
}

export function DashboardSidebar({ user, children }: DashboardSidebarProps) {
    const pathname = usePathname();
    const role = user.role;
    const items = role === "ADMIN" ? adminItems : userItems;
    const roleTitle = role === "ADMIN" ? "Admin Management" : "User Workspace";
    const pageTitle = getPageTitle(pathname);
    const userInitials = user.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((chunk) => chunk[0]?.toUpperCase())
        .join("");

    return (
        <SidebarProvider defaultOpen className="min-h-screen">
            <Sidebar
                variant="inset"
                collapsible="icon"
                className="border-primary-100/70 bg-gradient-to-b from-primary-50 via-white to-secondary-50 dark:border-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
            >
                <SidebarHeader className="border-b border-primary-100/70 p-3 dark:border-slate-800">
                    <div className="rounded-xl bg-gradient-to-r from-primary-600 to-secondary-500 p-[1px]">
                        <div className="flex items-center justify-between rounded-[11px] bg-white px-3 py-2 dark:bg-slate-900">
                            <div className="flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-primary-600 to-secondary-500 text-white shadow-sm">
                                    <LayoutDashboard className="h-4 w-4" />
                                </div>
                                <div className="group-data-[collapsible=icon]:hidden">
                                    <p className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Planora</p>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-primary-700 dark:text-primary-300">{roleTitle}</p>
                                </div>
                            </div>
                            <SidebarTrigger className="hidden text-slate-600 hover:bg-primary-50 hover:text-primary-700 md:flex dark:text-slate-300 dark:hover:bg-slate-800" />
                        </div>
                    </div>
                </SidebarHeader>
                <SidebarContent className="px-2 py-3">
                    <SidebarGroup>
                        <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Navigation
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu className="space-y-1">
                                {items.map((item) => {
                                    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                                    return (
                                        <SidebarMenuItem key={item.href}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={active}
                                                tooltip={item.label}
                                                className={cn(
                                                    active
                                                        ? "bg-gradient-to-r from-primary-600 to-secondary-500 text-white shadow-md hover:text-white"
                                                        : "text-slate-600 hover:bg-primary-50 hover:text-primary-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-primary-300"
                                                )}
                                            >
                                                <Link href={item.href}>
                                                    {item.icon}
                                                    <span>{item.label}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter className="border-t border-primary-100/70 p-3 dark:border-slate-800">
                    <div className="group-data-[collapsible=icon]:hidden">
                        <Separator className="mb-3 bg-primary-100/80 dark:bg-slate-700" />
                        <Button
                            asChild
                            variant="outline"
                            className="mb-3 w-full justify-between border-primary-200 bg-primary-50/80 text-primary-700 hover:bg-primary-100 dark:border-slate-700 dark:bg-slate-800 dark:text-primary-300"
                        >
                            <Link href="/dashboard/events">
                                <span className="inline-flex items-center gap-2">
                                    <CalendarPlus2 className="h-4 w-4" />
                                    Create Event
                                </span>
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </Button>

                        <div className="flex items-center gap-3 rounded-xl border border-primary-100 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-900">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-secondary-500 text-sm font-bold text-white">
                                {userInitials || "U"}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{user.name}</p>
                                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                            </div>
                            <Badge className="border-0 bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                                {role}
                            </Badge>
                        </div>
                    </div>

                    <SidebarMenu className="hidden group-data-[collapsible=icon]:flex">
                        <SidebarMenuItem>
                            <SidebarMenuButton tooltip={user.name} className="justify-center">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-secondary-500 text-xs font-bold text-white">
                                    {userInitials || "U"}
                                </div>
                                <span className="sr-only">{user.name}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>

            <SidebarInset className="min-w-0 flex flex-col">
                <div className="mt-4 min-w-0 flex-1">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    );
}
