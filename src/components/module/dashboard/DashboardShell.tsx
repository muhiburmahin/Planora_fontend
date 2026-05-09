import { ReactNode } from "react";
import type { DashboardUser } from "./dashboard.server";

interface DashboardShellProps {
    user: DashboardUser;
    children: ReactNode;
}

export function DashboardShell({ user, children }: DashboardShellProps) {
    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Welcome section - Premium Branding */}
            <div className="relative mb-10 overflow-hidden rounded-[2.5rem] border border-primary-100/40 bg-white/80 p-8 shadow-2xl shadow-primary-500/5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
                {/* Decorative background elements */}
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-500/10 blur-[100px]" />
                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-secondary-500/10 blur-[100px]" />
                
                <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 dark:bg-primary-900/30">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-500"></span>
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-700 dark:text-primary-300">
                                Planora Ecosystem
                            </span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl dark:text-white">
                            Welcome back, <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">{user.name.split(' ')[0]}</span>
                        </h1>
                        <p className="max-w-xl text-base font-medium text-slate-500 dark:text-slate-400">
                            Your centralized command center for managing high-impact experiences and community engagement.
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-primary-600 to-secondary-500 p-[1px] shadow-lg shadow-primary-500/20">
                            <div className="flex h-full w-full items-center justify-center rounded-[calc(1.5rem-1px)] bg-white dark:bg-slate-900">
                                <span className="text-xl font-black text-slate-900 dark:text-white">{user.name[0]}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Page content */}
            <div className="min-w-0 flex-1 transition-all duration-500">
                {children}
            </div>
        </div>
    );
}