'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Calendar,
    Users,
    Settings,
    FileText,
    BarChart3,
    ChevronLeft,
    LucideIcon,
} from 'lucide-react';

interface NavItem {
    name: string;
    href: string;
    icon: LucideIcon;
}

const adminNavItems: NavItem[] = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Reports', href: '/admin/reports', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

const userNavItems: NavItem[] = [
    { name: 'Dashboard', href: '/user/dashboard', icon: LayoutDashboard },
    { name: 'My Events', href: '/user/events', icon: Calendar },
    { name: 'Registrations', href: '/user/registrations', icon: Users },
    { name: 'Settings', href: '/user/settings', icon: Settings },
];

interface SidebarProps {
    isAdmin: boolean;
}

export function Sidebar({ isAdmin }: SidebarProps) {
    const [isOpen, setIsOpen] = useState(true);
    const pathname = usePathname();
    const navItems = isAdmin ? adminNavItems : userNavItems;

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={`hidden md:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'
                    }`}
            >
                {/* Toggle Button */}
                <div className="p-4 flex justify-end">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title={isOpen ? 'Collapse' : 'Expand'}
                    >
                        <ChevronLeft
                            size={20}
                            className={`text-slate-600 dark:text-slate-400 transition-transform ${isOpen ? '' : 'rotate-180'
                                }`}
                        />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive
                                        ? 'bg-gradient-to-r from-primary to-secondary text-white'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                title={!isOpen ? item.name : ''}
                            >
                                <Icon size={20} className="flex-shrink-0" />
                                {isOpen && <span className="font-medium">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className={`border-t border-slate-200 dark:border-slate-700 p-4 ${!isOpen ? 'text-center' : ''
                    }`}>
                    <p className={`text-xs font-medium text-slate-500 dark:text-slate-400 ${!isOpen ? 'hidden' : ''
                        }`}>
                        {isAdmin ? 'Admin Panel' : 'User Dashboard'}
                    </p>
                </div>
            </aside>

            {/* Mobile Sidebar Toggle */}
            <div className="md:hidden fixed bottom-6 right-6 z-40">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
                >
                    <LayoutDashboard size={24} />
                </button>
            </div>

            {/* Mobile Sidebar Modal */}
            {isOpen && (
                <>
                    <div
                        className="md:hidden fixed inset-0 bg-black/50 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <aside className="md:hidden fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-900 shadow-xl z-50 overflow-y-auto">
                        <div className="p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
                            <h2 className="font-bold text-lg">{isAdmin ? 'Admin' : 'Dashboard'}</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                            >
                                ✕
                            </button>
                        </div>

                        <nav className="p-4 space-y-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href || pathname.startsWith(item.href);

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive
                                                ? 'bg-gradient-to-r from-primary to-secondary text-white'
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                            }`}
                                    >
                                        <Icon size={20} />
                                        <span className="font-medium">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </aside>
                </>
            )}
        </>
    );
}
