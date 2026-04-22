'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, Mic, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { countActiveFilters } from '@/utils/event';
import { SearchHeroProps } from '@/types/eventDitels';

export function SearchHero({
    searchTerm,
    onSearch,
    onClearFilters,
    filters,
    totalEvents,
    isSearching = false
}: SearchHeroProps) {
    const [searchInput, setSearchInput] = useState(searchTerm || '');

    useEffect(() => {
        setSearchInput(searchTerm || '');
    }, [searchTerm]);

    const activeFiltersCount = countActiveFilters(filters);
    const router = useRouter();

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchInput);

        const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
        if (searchInput) params.set('searchTerm', searchInput);
        else params.delete('searchTerm');
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="relative py-24 px-4 overflow-hidden bg-white dark:bg-gray-950">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-500/10 blur-[120px] rounded-full" />
            </div>

            <div className="container mx-auto relative z-10">
                <div className="max-w-3xl mx-auto">
                    <form onSubmit={handleSearchSubmit} className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500" />

                        <div className="relative flex items-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-2 shadow-2xl">
                            <div className="pl-4 text-gray-400">
                                {isSearching ? (
                                    <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
                                ) : (
                                    <Search className="w-6 h-6" />
                                )}
                            </div>

                            <input
                                type="text"
                                placeholder="Search by name, venue, or category..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full px-4 py-4 bg-transparent text-lg focus:outline-none dark:text-white"
                            />

                            <div className="flex items-center gap-2 pr-2">
                                <button
                                    type="button"
                                    className="p-3 text-gray-400 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                                >
                                    <Mic size={22} />
                                </button>

                                <button
                                    type="submit"
                                    className="hidden md:block px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-bold shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Popular Tags */}
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                        <span className="text-sm text-gray-500 font-medium">Popular:</span>
                        {['Music', 'Tech', 'Art', 'Business'].map((tag) => (
                            <button
                                key={tag}
                                onClick={() => { setSearchInput(tag); onSearch(tag); }}
                                className="px-4 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-primary-500 hover:text-white transition-all"
                            >
                                #{tag}
                            </button>
                        ))}
                    </div>

                    {/* Active Filters Bar */}
                    {activeFiltersCount > 0 && (
                        <div className="mt-8 flex items-center justify-between p-4 bg-primary-50/50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/30 rounded-2xl">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                                <span className="text-sm font-bold text-primary-900 dark:text-primary-100">
                                    {activeFiltersCount} Filters Active
                                </span>
                            </div>
                            <button
                                onClick={() => { setSearchInput(''); onClearFilters(); }}
                                className="text-sm font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                            >
                                <X size={14} /> Clear Results
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 