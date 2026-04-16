/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { LogOut, User, Settings, ChevronDown } from 'lucide-react';

interface UserDropdownProps {
    user: any;
    isScrolled: boolean;
    onLogout: () => void;
}

export function UserDropdown({ user, isScrolled, onLogout }: UserDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${isScrolled
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                    : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
            >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:inline max-w-[120px] truncate">
                    {user?.name?.[0]}
                </span>
                <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    className={`absolute right-0 mt-2 w-56 rounded-lg shadow-xl border transition-all animated-in fade-in zoom-in-95 ${isScrolled
                        ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                        : 'bg-slate-900 border-slate-700'
                        }`}
                >
                    {/* User Info */}
                    <div className={`px-4 py-3 border-b ${isScrolled
                        ? 'border-slate-200 dark:border-slate-700'
                        : 'border-slate-700'
                        }`}>
                        <p className={`text-sm font-semibold ${isScrolled
                            ? 'text-slate-900 dark:text-white'
                            : 'text-white'
                            }`}>
                            {user?.name}
                        </p>
                        <p className={`text-xs ${isScrolled
                            ? 'text-slate-500 dark:text-slate-400'
                            : 'text-slate-400'
                            }`}>
                            {user?.email}
                        </p>
                        {user?.role && (
                            <p className="text-xs font-medium text-primary mt-1 uppercase">
                                {user.role}
                            </p>
                        )}
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                        <Link
                            href={user?.role === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard'}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center space-x-3 px-4 py-2 text-sm transition-all ${isScrolled
                                ? 'text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary'
                                : 'text-slate-300 hover:bg-primary/20 hover:text-white'
                                }`}
                        >
                            <User size={18} />
                            <span>My Dashboard</span>
                        </Link>

                        <Link
                            href="/dashboard/profile"
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center space-x-3 px-4 py-2 text-sm transition-all ${isScrolled
                                ? 'text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary'
                                : 'text-slate-300 hover:bg-primary/20 hover:text-white'
                                }`}
                        >
                            <User size={18} />
                            <span>Profile</span>
                        </Link>

                        <Link
                            href="/dashboard/settings"
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center space-x-3 px-4 py-2 text-sm transition-all ${isScrolled
                                ? 'text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary'
                                : 'text-slate-300 hover:bg-primary/20 hover:text-white'
                                }`}
                        >
                            <Settings size={18} />
                            <span>Settings</span>
                        </Link>
                    </div>

                    {/* Logout */}
                    <div className={`border-t ${isScrolled
                        ? 'border-slate-200 dark:border-slate-700'
                        : 'border-slate-700'
                        } py-2`}>
                        <button
                            onClick={() => {
                                onLogout();
                                setIsOpen(false);
                            }}
                            className={`w-full flex items-center space-x-3 px-4 py-2 text-sm transition-all ${isScrolled
                                ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                                : 'text-red-400 hover:bg-red-900/20'
                                }`}
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
