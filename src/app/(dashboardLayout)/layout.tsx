import { AppSidebar } from "@/components/layout/app-sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { userService } from "@/services/userService";
import React from "react";

type Role = "ADMIN" | "USER";

export default async function DashboardLayout({
    admin,
    user: userSlot,
}: Readonly<{
    admin: React.ReactNode;
    user: React.ReactNode;
}>) {
    const response = await userService.server.getSession();
    const userData = response?.data;
    const role = userData?.role as Role | undefined;

    const roleView: Record<Role, React.ReactNode> = {
        ADMIN: admin,
        USER: userSlot,
    };

    if (!role || !roleView[role]) {
        return (
            <div className="h-screen flex items-center justify-center">
                <p className="text-slate-500 font-medium">Access Denied or Session Expired</p>
            </div>
        );
    }

    return (
        <SidebarProvider>
            <AppSidebar
                user={userData}
                className="border-r border-blue-50 dark:border-slate-800 transition-colors"
            />

            {/* Main Content Area */}
            <SidebarInset className="bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-300">

                {/* Header - Glassmorphism style */}
                <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 px-6 transition-all">
                    <div className="flex items-center gap-2 flex-1">
                        {/* Sidebar Trigger */}
                        <div className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 shadow-sm shadow-blue-200/50">
                            <SidebarTrigger className="-ml-1" />
                        </div>

                        <Separator orientation="vertical" className="mx-2 h-5 bg-blue-200/50 dark:bg-slate-700" />

                        {/* Dynamic Breadcrumb */}
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink
                                        href="/"
                                        className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        Planora Platform
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block text-slate-300 dark:text-slate-700" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="text-[13px] font-black text-blue-600 dark:text-blue-400 flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-lg border border-blue-100/50 dark:border-blue-800/50">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        Dashboard Overview
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>

                    {/* User Profile Info in Header */}
                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex flex-col items-end">
                            <p className="text-[12px] font-black text-slate-900 dark:text-slate-100 transition-colors">
                                {userData?.name}
                            </p>
                            <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tighter">
                                {role} Account
                            </p>
                        </div>
                    </div>
                </header>

                {/* Main Content Render */}
                <main className="flex-1 p-6 md:p-8 max-w-[1600px] mx-auto w-full overflow-y-auto bg-transparent transition-colors">
                    <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {roleView[role]}
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}