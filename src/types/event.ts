// types/event.ts

export enum EventStatus {
    UPCOMING = "UPCOMING",
    ONGOING = "ONGOING",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

export enum EventType {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
}

export interface EventImage {
    id: string;
    url: string;
    eventId: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
}

export interface Event {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isDeleted: any;
    id: string;
    title: string;
    slug: string;
    shortDescription?: string | null;
    description: string;
    date: Date | string;
    time: string;
    venue: string;
    isOnline: boolean;
    type: EventType;
    registrationFee: number;
    maxParticipants?: number | null;
    status: EventStatus;
    isPublished: boolean;
    isFeatured: boolean;
    images: EventImage[];
    categoryId: string;
    category: Category;
    _count?: {
        participations: number;
    };
    averageRating: number;
    totalReviews: number;
}