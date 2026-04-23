import EventModule from '@/components/module/common/event/event';
import React from 'react';
import eventService from '@/services/eventService';
import categoryService from '@/services/categoryService';

export default async function EventsPage({ searchParams }: { searchParams?: Promise<Record<string, any>> }) {
    const params = await searchParams;
    const pageNum = Number(params?.page) || 1;
    const limit = Number(params?.limit) || 8;
    const queryParams: Record<string, any> = {
        searchTerm: params?.searchTerm || undefined,
        categoryId: params?.categoryId || undefined,
        page: pageNum,
        limit,
    };

    const [eventsRes, categoriesRes] = await Promise.all([
        eventService.server.list(queryParams),
        categoryService.server.getAllCategories(),
    ]);

    const events = eventsRes?.data || [];
    const categories = categoriesRes?.data || [];

    return (
        <EventModule
            events={events}
            categories={categories}
            currentPage={pageNum}
            totalPages={eventsRes?.meta?.totalPages || 1}
            searchParams={params}
        />
    );
}
