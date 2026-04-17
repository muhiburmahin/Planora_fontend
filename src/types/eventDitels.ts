// src/types/eventDitels.ts

import { CategoryUI } from "./category";

export interface EventWithDetails {
    id: string;
    title: string;
    slug: string;
    shortDescription?: string | null;
    description: string;
    date: Date | string;
    time: string;
    venue: string;
    isOnline: boolean;
    registrationFee: number;
    maxParticipants?: number | null;
    categoryId?: string;
    category?: { name: string };
    images: { url: string }[];
    _count?: {
        participations: number;
    };
}

export interface EventCardProps {
    event: EventWithDetails;
    onWishlistToggle?: (eventId: string) => void;
    isWishlisted?: boolean;
    viewMode?: 'grid' | 'list';
}

export interface EventFilters {
    searchTerm: string;
    category: string;
    categoryId: string;
    isOnline: boolean;
    priceRange: string;
    dateRange: string;
}

export interface SearchHeroProps {
    searchTerm: string;
    onSearch: (val: string) => void;

    onClearFilters: () => void;
    filters: Partial<EventFilters>;
    totalEvents?: number;
    isSearching?: boolean;
}

export interface FilterSidebarProps {
    filters: Partial<EventFilters>;
    categories: CategoryUI[];
    onFilterChange: (key: keyof EventFilters, value: any) => void;
    onClearAll: () => void;
}

export type { CategoryUI };

