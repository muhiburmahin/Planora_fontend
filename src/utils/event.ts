import { EventFilters } from "@/types/eventDitels";

export const formatEventDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(date));
};
export const countActiveFilters = (filters: Partial<EventFilters>): number => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.categoryId) count++;
    if (filters.dateRange) count++;
    if (filters.priceRange) count++;
    if (filters.isOnline) count++;
    return count;
};

export const formatEventTime = (time: string) => {
    return time;
};


export const getCountdownText = (eventDate: Date) => {
    const now = new Date().getTime();
    const distance = new Date(eventDate).getTime() - now;

    if (distance < 0) return null;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d left`;
    if (hours > 0) return `${hours}h left`;
    return "Starting soon";
};


export const getAvailabilityText = (participations: number, maxParticipants: number | null) => {
    if (!maxParticipants || maxParticipants === 0) return null;
    const remaining = maxParticipants - participations;

    if (remaining <= 0) return "Sold Out";
    if (remaining <= 5) return `Only ${remaining} seats left!`;
    return null;
};


export const isSoldOut = (participations: number, maxParticipants: number | null) => {
    if (!maxParticipants || maxParticipants === 0) return false;
    return participations >= maxParticipants;
};
