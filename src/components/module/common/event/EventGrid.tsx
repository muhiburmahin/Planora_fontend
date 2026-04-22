'use client';

import React from 'react';
import { EventCard } from '../../shared/EventCard';
import { LayoutGrid, List, RotateCcw, SearchX } from 'lucide-react';
import { EventWithDetails } from '@/types/eventDitels';
import { motion, AnimatePresence } from 'framer-motion';

interface EventGridProps {
    events: EventWithDetails[];
    viewMode: 'grid' | 'list';
    setViewMode: (mode: 'grid' | 'list') => void;
    totalCount?: number;
    isLoading?: boolean;
    onClearFilters?: () => void; //
}

export function EventGrid({
    events,
    viewMode,
    setViewMode,
    totalCount,
    isLoading,
    onClearFilters
}: EventGridProps) {

    if (!isLoading && events.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 px-6 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 text-center">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-full mb-4">
                    <SearchX className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No events found</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto mb-6">
                    We couldn't find any events matching your current filters. Try adjusting your search.
                </p>
                {onClearFilters && (
                    <button
                        onClick={onClearFilters}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-all shadow-md active:scale-95"
                    >
                        <RotateCcw size={18} />
                        Clear All Filters
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Showing <span className="text-gray-900 dark:text-white font-bold">{events.length}</span> {events.length === 1 ? 'event' : 'events'}
                    {totalCount && ` of ${totalCount}`}
                </div>

                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        title="Grid View"
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        title="List View"
                    >
                        <List size={18} />
                    </button>
                </div>
            </div>

            <motion.div
                layout
                className={
                    viewMode === 'grid'
                        ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                        : "flex flex-col gap-4"
                }
            >
                <AnimatePresence mode='popLayout'>
                    {events.map((event) => (
                        <motion.div
                            key={event.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                        >
                            <EventCard
                                event={event}
                                viewMode={viewMode}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {totalCount && totalCount > events.length && (
                <div className="flex justify-center pt-8">
                    <button className="px-8 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm active:scale-95">
                        Load More Events
                    </button>
                </div>
            )}
        </div>
    );
}