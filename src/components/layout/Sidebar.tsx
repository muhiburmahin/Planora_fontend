"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Bell,
  CalendarDays,
  Home,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Tags,
  Ticket,
  UserCog,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type AppRole = "ADMIN" | "USER";

type RouteItem = {
  title: string;
  url: string;
  icon: React.ReactNode;
};

const adminRoutes: RouteItem[] = [
  { title: "Overview", url: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { title: "All Events", url: "/dashboard/events", icon: <CalendarDays className="h-4 w-4" /> },
  { title: "Categories", url: "/dashboard/categories", icon: <Tags className="h-4 w-4" /> },
  { title: "Users", url: "/dashboard/users", icon: <UserCog className="h-4 w-4" /> },
  { title: "Participants", url: "/dashboard/participants", icon: <Users className="h-4 w-4" /> },
];

const userRoutes: RouteItem[] = [
  { title: "Overview", url: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { title: "My Events", url: "/dashboard/events", icon: <CalendarDays className="h-4 w-4" /> },
  { title: "Participations", url: "/dashboard/participations", icon: <Ticket className="h-4 w-4" /> },
  { title: "Invitations", url: "/dashboard/invitations", icon: <Users className="h-4 w-4" /> },
  { title: "Reviews", url: "/dashboard/reviews", icon: <MessageSquare className="h-4 w-4" /> },
  { title: "Notifications", url: "/dashboard/notifications", icon: <Bell className="h-4 w-4" /> },
  { title: "Settings", url: "/dashboard/settings", icon: <Settings className="h-4 w-4" /> },
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    role: string;
    name?: string;
    email?: string;
    image?: string;
  };
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const role = user?.role?.toUpperCase() === "ADMIN" ? "ADMIN" : "USER";
  const routes = role === "ADMIN" ? adminRoutes : userRoutes;
  const initials = (user.name || "User")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase())
    .join("");

  return (
    <Sidebar
      {...props}
      collapsible="icon"
      className="border-r border-primary-200/70 bg-gradient-to-b from-primary-50 via-white to-secondary-50 dark:border-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
    >
      <div className="border-b border-primary-100/80 px-3 py-3 dark:border-slate-800">
        <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-500 p-[1px]">
          <div className="flex w-full items-center gap-2 rounded-[11px] bg-white px-3 py-2 dark:bg-slate-900">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-primary-600 to-secondary-500 text-white">
              <LayoutDashboard className="h-4 w-4" />
            </div>
            <div className="group-data-[collapsible=icon]:hidden">
              <p className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Planora</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary-700 dark:text-primary-300">
                {role === "ADMIN" ? "Admin Management" : "User Workspace"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <SidebarContent>
        <SidebarGroup className="px-2 py-3">
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {routes.map((item) => {
                const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={
                        isActive
                          ? "bg-gradient-to-r from-primary-600 to-secondary-500 text-white shadow-md hover:text-white"
                          : "text-slate-600 hover:bg-primary-50 hover:text-primary-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-primary-300"
                      }
                    >
                      <Link href={item.url} onClick={() => setOpenMobile(false)}>
                        {item.icon}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="px-2 py-3 mt-auto">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Back to Home"
                  className="text-slate-600 hover:bg-primary-50 hover:text-primary-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-primary-300"
                >
                  <Link href="/" onClick={() => setOpenMobile(false)}>
                    <Home className="h-4 w-4" />
                    <span>Back to Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
      <SidebarFooter className="border-t border-primary-100/80 p-3 dark:border-slate-800">
        <div className="group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-3 rounded-xl border border-primary-100 bg-white/80 p-2.5 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-secondary-500 text-sm font-bold text-white">
              {initials || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{user.name || "User"}</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email || "No email"}</p>
            </div>
            <Badge className="border-0 bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
              {role}
            </Badge>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}