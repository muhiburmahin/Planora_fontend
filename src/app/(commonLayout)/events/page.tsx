import EventModule from "@/components/module/common/event/event";
import { Footer } from "@/components/layout";
import React from 'react';
import eventService from '@/services/eventService';
import categoryService from '@/services/categoryService';

export default async function EventsPage({ searchParams }: { searchParams?: Record<string, any> }) {
    const pageNum = Number(searchParams?.page) || 1;
    const limit = Number(searchParams?.limit) || 8;
    const params: Record<string, any> = {
        searchTerm: searchParams?.searchTerm || undefined,
        categoryId: searchParams?.categoryId || undefined,
        page: pageNum,
        limit,
    };

    const [eventsRes, categoriesRes] = await Promise.all([
        eventService.server.list(params),
        categoryService.server.getAllCategories(),
    ]);

    const initialEvents = eventsRes?.data ?? [];
    const initialMeta = eventsRes?.meta ?? null;
    const initialCategories = categoriesRes?.data ?? [];

    return (
        <main className="min-h-screen">
            <EventModule
                initialEvents={initialEvents}
                initialMeta={initialMeta}
                initialFilters={{ searchTerm: params.searchTerm ?? '', categoryId: params.categoryId ?? '' }}
                initialCategories={initialCategories}
            />
            <Footer />
        </main>
    );
}