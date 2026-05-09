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
import { Roles } from "@/constants/role";
import { adminRoutes } from "@/routes/adminRoute";
import { userRoutes } from "@/routes/userRoutes";
import { LayoutDashboard, Home } from "lucide-react"; // Home icon import
import { UserDropdown } from "./UserDropdown";

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

  const routes = React.useMemo(() => {
    const role = user?.role?.toUpperCase();
    if (role === Roles.ADMIN) return adminRoutes;
    if (role === Roles.USER) return userRoutes;
    return [];
  }, [user?.role]);

  return (
    <Sidebar {...props} className="border-r border-slate-200 dark:border-slate-800 transition-colors">
      <SidebarContent className="bg-white dark:bg-[#0f172a]">

        {/* Brand Logo Section */}
        <div className="px-6 py-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-xl">P</span>
            </div>
            <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
              PLANORA
            </span>
          </Link>
        </div>

        {/* Navigation Groups */}
        <SidebarGroup className="px-4">
          <SidebarGroupLabel className="px-3 mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {/* Home Option Add Kora Hoyeche */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-auto p-0 hover:bg-transparent">
                  <Link href="/" className="w-full group">
                    <div className="flex items-center gap-4 w-full h-[50px] px-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                      <div className="text-slate-400 group-hover:text-primary-500 transition-colors">
                        <Home size={20} strokeWidth={2} />
                      </div>
                      <span className="text-sm font-bold tracking-tight uppercase text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">
                        Back to Home
                      </span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {routes.map((group) => (
          <SidebarGroup key={group.title} className="px-4">
            <SidebarGroupLabel className="px-3 mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              {group.title}
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu className="gap-2">
                {group.items?.map((item) => {
                  const isDashboard = item.url === "/dashboard" || item.url === "/admin-dashboard";
                  const isActive = isDashboard
                    ? pathname === item.url
                    : pathname.startsWith(item.url);

                  // TS Error Fix: Casting icon as any to avoid call signature error
                  const Icon = item.icon as any;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild className="h-auto p-0 hover:bg-transparent">
                        <Link
                          href={item.url}
                          onClick={() => setOpenMobile(false)}
                          className="w-full group"
                        >
                          <div className={`flex items-center gap-4 w-full h-[50px] px-4 rounded-xl transition-all duration-300 ${isActive
                              ? "bg-primary-50 dark:bg-primary-900/10 border-l-4 border-primary-600 shadow-sm"
                              : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                            }`}>

                            <div className={`flex shrink-0 transition-colors ${isActive ? "text-primary-600" : "text-slate-400 group-hover:text-primary-400"
                              }`}>
                              {Icon ? (
                                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                              ) : (
                                <LayoutDashboard size={20} />
                              )}
                            </div>

                            <span className={`text-sm font-bold tracking-tight uppercase transition-colors ${isActive
                                ? "text-primary-700 dark:text-primary-400"
                                : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"
                              }`}>
                              {item.title}
                            </span>

                            {isActive && (
                              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-secondary-500 animate-pulse" />
                            )}
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarRail />

      <SidebarFooter className="p-4 border-t dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
        <UserDropdown user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}