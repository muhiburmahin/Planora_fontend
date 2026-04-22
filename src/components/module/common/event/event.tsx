'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SearchHero } from './SearchHero';
import { EventGrid } from './EventGrid';
import { Pagination } from './Pagination';
import { FilterSidebar } from './FilterSidebar';
import { EventFilters } from '@/types/eventDitels';
import eventService from '@/services/eventService';
import categoryService from '@/services/categoryService';

interface EventModuleProps {
    initialEvents?: any[];
    initialMeta?: any;
    initialFilters?: Partial<EventFilters>;
    initialCategories?: Array<{ id: string; name: string }>;
}

export default function EventModule({ initialEvents = [], initialMeta = null, initialFilters, initialCategories = [] }: EventModuleProps) {
    const [filters, setFilters] = useState<Partial<EventFilters>>({
        searchTerm: initialFilters?.searchTerm ?? '',
        categoryId: initialFilters?.categoryId ?? '',
        dateRange: initialFilters?.dateRange ?? '',
        priceRange: initialFilters?.priceRange ?? ''
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const itemsPerPage = 8;

    // Debounced search term to reduce queries
    const [debouncedSearch, setDebouncedSearch] = useState(filters.searchTerm || '');
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(filters.searchTerm || ''), 350);
        return () => clearTimeout(t);
    }, [filters.searchTerm]);

    const handleFilterChange = (key: keyof EventFilters, value: any) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters({ searchTerm: '', categoryId: '', dateRange: '', priceRange: '' });
        setCurrentPage(1);
    };

    // Categories (use initial categories if provided)
    const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery(
        ['categories'],
        async () => {
            const res = await categoryService.client.list();
            if (res.error) throw res.error;
            return res.data;
        },
        { staleTime: 60_000, initialData: initialCategories?.length ? initialCategories : undefined }
    );

    // Events (with filters & pagination)
    const { data: eventsData, isLoading: isEventsLoading, isFetching } = useQuery(
        ['events', debouncedSearch, filters.categoryId, currentPage],
        async () => {
            const params: Record<string, any> = {
                searchTerm: debouncedSearch || undefined,
                categoryId: filters.categoryId || undefined,
                page: currentPage,
                limit: itemsPerPage,
            };
            const res = await eventService.client.list(params);
            if (res.error) throw res.error;
            return res.data;
        },
        {
            keepPreviousData: true,
            staleTime: 30_000,
            initialData: initialEvents?.length ? { data: initialEvents, meta: initialMeta } : undefined,
        }
    );

    // Normalize events & meta
    const eventsList = useMemo(() => {
        if (!eventsData) return [];
        return eventsData.data ?? eventsData ?? [];
    }, [eventsData]);

    const totalResults = eventsData?.meta?.total ?? (Array.isArray(eventsList) ? eventsList.length : 0);
    const totalPages = Math.max(1, Math.ceil(totalResults / itemsPerPage));

    return (
        <main className="min-h-screen bg-[#FAFAFA] dark:bg-black/5">
            <SearchHero
                searchTerm={filters.searchTerm || ''}
                onSearch={(val) => handleFilterChange('searchTerm', val)}
                onClearFilters={clearFilters}
                filters={filters}
                totalEvents={totalResults}
                isSearching={isFetching}
            />

            <div className="max-w-7xl mx-auto px-4 md:px-6 pb-24">
                <div className="flex flex-col md:flex-row gap-8 lg:gap-12">

                    <aside className="w-full md:w-72 shrink-0">
                        <FilterSidebar
                            filters={filters}
                            categories={(categoriesData ?? []) as Array<{ id: string; name: string }>}
                            onFilterChange={handleFilterChange}
                            onClearAll={clearFilters}
                            isLoading={isCategoriesLoading}
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
                            events={eventsList}
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