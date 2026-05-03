"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // কারেন্ট পাথ চেক করার জন্য
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
import { Routes } from "@/types/route.type";
import { LayoutDashboard } from "lucide-react";
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

  let routes: Routes[] = [];

  const role = user?.role?.toUpperCase();

  if (role === Roles.ADMIN) {
    routes = adminRoutes;
  } else if (role === Roles.USER) {
    routes = userRoutes;
  }

  return (
    <Sidebar {...props} className="dark:bg-[#0f172a] border-r dark:border-slate-800 transition-colors">
      <SidebarContent>
        {routes.length === 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-red-500 font-bold">
              No routes found for {user.role}
            </SidebarGroupLabel>
          </SidebarGroup>
        )}

        {routes.map((group) => (
          <SidebarGroup key={group.title} className="px-4">
            <SidebarGroupLabel className="h-auto px-2 mt-8 mb-6">
              <span className="text-[28px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-500 to-green-600 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(96,165,250,0.3)]">
                {group.title}
              </span>
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu className="gap-5">
                {group.items?.map((item) => {
                  const isOverview =
                    item.url === "/admin-dashboard" || item.url === "/dashboard";
                  const isActive = isOverview
                    ? pathname === item.url
                    : pathname === item.url || pathname.startsWith(`${item.url}/`);

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild className="h-auto w-full p-0 hover:bg-transparent">
                        <Link
                          href={item.url}
                          onClick={() => setOpenMobile(false)} 
                          className="w-full block"
                        >
                          {/* Active State Container */}
                          <div className={`flex items-center p-[2px] rounded-full transition-all duration-300 ${isActive
                            ? "bg-gradient-to-r from-blue-500 to-green-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] scale-[1.02]"
                            : "bg-slate-200 dark:bg-slate-800 hover:bg-gradient-to-r hover:from-blue-400 hover:to-green-400"
                            }`}>

                            <div className={`flex items-center gap-4 w-full h-[52px] px-6 rounded-full transition-colors ${isActive
                              ? "bg-blue-50 dark:bg-[#0f172a] border-transparent"
                              : "bg-white dark:bg-[#1e293b]"
                              }`}>

                              <div className={`flex shrink-0 items-center justify-center transition-colors ${isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"
                                }`}>
                                {item.icon || <LayoutDashboard size={22} strokeWidth={isActive ? 3 : 2} />}
                              </div>

                              <span className={`font-black text-[15px] tracking-tight uppercase truncate transition-all ${isActive
                                ? "bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent"
                                : "text-slate-600 dark:text-slate-300"
                                }`}>
                                {item.title}
                              </span>

                              {/* Active Indicator Dot */}
                              {isActive && (
                                <div className="ml-auto w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse" />
                              )}
                            </div>
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
      <SidebarFooter className="border-t dark:border-slate-800 p-4">
        <UserDropdown user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}