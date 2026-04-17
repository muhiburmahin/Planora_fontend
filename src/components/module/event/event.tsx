'use client';

import React, { useState, useMemo } from 'react';
import { SearchHero } from './SearchHero';
import { EventGrid } from './EventGrid';
import { Pagination } from './Pagination';

import { FEATURED_EVENTS } from '@/constants/event';
import { CATEGORIES_DATA } from '@/constants/categories';
import { EventFilters, CategoryUI } from '@/types/eventDitels';
import { FilterSidebar } from './FilterSidebar';


export default function EventModule() {
    const [filters, setFilters] = useState<Partial<EventFilters>>({
        searchTerm: '',
        categoryId: '',
        dateRange: '',
        priceRange: ''
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const itemsPerPage = 6;

    const handleFilterChange = (key: keyof EventFilters, value: any) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters({ searchTerm: '', categoryId: '', dateRange: '', priceRange: '' });
        setCurrentPage(1);
    };

    const filteredEvents = useMemo(() => {
        return (FEATURED_EVENTS as any[]).filter((event) => {
            const matchesSearch = event.title
                .toLowerCase()
                .includes(filters.searchTerm?.toLowerCase() || '');

            const matchesCategory = filters.categoryId
                ? event.categoryId === filters.categoryId
                : true;

            return matchesSearch && matchesCategory;
        });
    }, [filters]);

    const totalResults = filteredEvents.length;
    const totalPages = Math.ceil(totalResults / itemsPerPage);
    const currentEvents = filteredEvents.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <main className="min-h-screen bg-[#FAFAFA] dark:bg-black/5">
            <SearchHero
                searchTerm={filters.searchTerm || ''}
                onSearch={(val) => handleFilterChange('searchTerm', val)}
                onClearFilters={clearFilters}
                filters={filters}
            />

            <div className="max-w-7xl mx-auto px-4 md:px-6 pb-24">
                <div className="flex flex-col md:flex-row gap-8 lg:gap-12">

                    <aside className="w-full md:w-72 shrink-0">
                        <FilterSidebar
                            filters={filters}
                            categories={CATEGORIES_DATA as CategoryUI[]}
                            onFilterChange={handleFilterChange}
                            onClearAll={clearFilters}
                        />
                    </aside>

                    <div className="flex-1">
                        <div className="mb-8 flex items-center justify-between">
                            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                                {totalResults} Events Found
                            </h2>

                            <div className="flex gap-2 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg">
                                {(['grid', 'list'] as const).map((mode) => (
                                    <button
                                        key={mode}
                                        onClick={() => setViewMode(mode)}
                                        className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${viewMode === mode
                                            ? 'bg-white shadow-sm text-primary-600'
                                            : 'text-gray-400 hover:text-gray-600'
                                            }`}
                                    >
                                        {mode}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <EventGrid
                            events={currentEvents}
                            viewMode={viewMode}
                            setViewMode={setViewMode}
                        />

                        {totalResults > itemsPerPage && (
                            <div className="mt-16 flex justify-center">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                    totalResults={totalResults}
                                    resultsPerPage={itemsPerPage}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}