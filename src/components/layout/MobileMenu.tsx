'use client';

import React from 'react';
import Link from 'next/link';
import { LucideIcon, LogOut, User, Settings } from 'lucide-react';

interface MobileMenuProps {
    navItems: { name: string; href: string; icon: LucideIcon }[];
    isAuthenticated: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: any;
    onLogout: () => void;
    onClose: () => void;
}

export function MobileMenu({
    navItems,
    isAuthenticated,
    user,
    onLogout,
    onClose,
}: MobileMenuProps) {
    return (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 animated-in fade-in">
            <div className="px-4 py-4 space-y-2">
                {/* Navigation Items */}
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-all"
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}

                <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                    {isAuthenticated ? (
                        <>
                            {/* User Profile Section */}
                            <div className="px-4 py-3 flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
                                    {user?.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                        {user?.name}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                        {user?.email}
                                    </p>
                                </div>
                            </div>

                            {/* User Actions */}
                            <Link
                                href="/dashboard/profile"
                                onClick={onClose}
                                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-all"
                            >
                                <User size={20} />
                                <span>Profile</span>
                            </Link>
                            <Link
                                href="/dashboard/settings"
                                onClick={onClose}
                                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-all"
                            >
                                <Settings size={20} />
                                <span>Settings</span>
                            </Link>
                            <button
                                onClick={() => {
                                    onLogout();
                                    onClose();
                                }}
                                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                            >
                                <LogOut size={20} />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                onClick={onClose}
                                className="block w-full text-center px-4 py-2 rounded-lg font-medium text-primary hover:bg-primary/10 transition-all mb-2"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                onClick={onClose}
                                className="block w-full text-center px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-all"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
