// constants/events.ts
import { Event, EventStatus, EventType } from "@/types/event";

export const FEATURED_EVENTS: Event[] = [
    {
        id: "evt-1",
        title: "Next.js Masters Conference",
        slug: "nextjs-masters-conference",
        shortDescription: "Learn the latest about Next.js 15, Server Actions and Parallel Routing.",
        description: "Full day conference covering everything from basics to advanced patterns.",
        date: "2026-05-20T10:00:00Z",
        time: "10:00 AM",
        venue: "Dhaka Tower, Bangladesh",
        isOnline: false,
        type: EventType.PUBLIC,
        registrationFee: 500,
        status: EventStatus.UPCOMING,
        isPublished: true,
        isFeatured: true,
        images: [{ id: "img-1", url: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800", eventId: "evt-1" }],
        categoryId: "cat-1",
        category: { id: "cat-1", name: "Programming", slug: "programming" },
        _count: { participations: 120 },
        averageRating: 4.8,
        isDeleted: false,
        totalReviews: 25
    },
    {
        id: "evt-2",
        title: "AI & Future Summit",
        slug: "ai-future-summit",
        shortDescription: "Exploring the impact of Generative AI and LLMs in 2026 workflows.",
        description: "Join industry experts to talk about the future of AI.",
        date: "2026-06-12T14:00:00Z",
        time: "02:00 PM",
        venue: "Google Meet",
        isOnline: true,
        type: EventType.PUBLIC,
        registrationFee: 0,
        status: EventStatus.UPCOMING,
        isPublished: true,
        isFeatured: true,
        images: [{ id: "img-2", url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800", eventId: "evt-2" }],
        categoryId: "cat-2",
        category: { id: "cat-2", name: "AI & Data", slug: "ai-data" },
        _count: { participations: 350 },
        averageRating: 4.5,
        isDeleted: false,
        totalReviews: 80
    },
    {
        id: "evt-3",
        title: "UI/UX Design Masterclass",
        slug: "uiux-design-masterclass",
        shortDescription: "Master advanced prototyping and user research techniques in Figma.",
        description: "Hands-on workshop for professional designers.",
        date: "2026-04-30T11:00:00Z",
        time: "11:00 AM",
        venue: "Sylhet IT Park, Sylhet",
        isOnline: false,
        type: EventType.PUBLIC,
        registrationFee: 1200,
        status: EventStatus.UPCOMING,
        isPublished: true,
        isFeatured: true,
        images: [{ id: "img-3", url: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?w=800", eventId: "evt-3" }],
        categoryId: "cat-3",
        category: { id: "cat-3", name: "Design", slug: "design" },
        _count: { participations: 45 },
        averageRating: 4.9,
        isDeleted: false,
        totalReviews: 12
    },
    {
        id: "evt-4",
        title: "Cloud Computing Expo",
        slug: "cloud-computing-expo",
        shortDescription: "Modernizing infrastructures with AWS, Azure, and Google Cloud.",
        description: "Scale your business with the power of cloud computing.",
        date: "2026-07-05T09:00:00Z",
        time: "09:00 AM",
        venue: "Online Webinar",
        isOnline: true,
        type: EventType.PUBLIC,
        registrationFee: 250,
        status: EventStatus.UPCOMING,
        isPublished: true,
        isFeatured: true,
        images: [{ id: "img-4", url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800", eventId: "evt-4" }],
        categoryId: "cat-4",
        category: { id: "cat-4", name: "DevOps", slug: "devops" },
        _count: { participations: 210 },
        averageRating: 4.7,
        isDeleted: false,
        totalReviews: 45
    },
    {
        id: "evt-5",
        title: "Startup Founders Meetup",
        slug: "startup-founders-meetup",
        shortDescription: "Exclusive networking event for high-growth startup founders.",
        description: "Meet your next co-founder or investor in this casual meetup.",
        date: "2026-05-15T18:00:00Z",
        time: "06:00 PM",
        venue: "Banani Club, Dhaka",
        isOnline: false,
        type: EventType.PUBLIC,
        registrationFee: 0,
        status: EventStatus.UPCOMING,
        isPublished: true,
        isFeatured: true,
        images: [{ id: "img-5", url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800", eventId: "evt-5" }],
        categoryId: "cat-5",
        category: { id: "cat-5", name: "Business", slug: "business" },
        _count: { participations: 85 },
        averageRating: 4.6,
        isDeleted: false,
        totalReviews: 18
    }
];


// src/constants/event.ts

export const DATE_FILTER_OPTIONS = [
    { label: 'Today', value: 'today' },
    { label: 'Tomorrow', value: 'tomorrow' },
    { label: 'This Week', value: 'this-week' },
    { label: 'This Month', value: 'this-month' },
    { label: 'Next Month', value: 'next-month' }
];

export const PRICE_FILTER_OPTIONS = [
    { label: 'Free', value: 'free' },
    { label: 'Paid', value: 'paid' },
    { label: 'Under 1000', value: 'under-1000' },
    { label: '1000 - 5000', value: '1000-5000' },
    { label: 'Over 5000', value: 'over-5000' }
];

// আপনার যদি ইভেন্ট টাইপ (Online/Offline) এর জন্য অপশন লাগে
export const EVENT_TYPE_OPTIONS = [
    { label: 'Online', value: 'online' },
    { label: 'In-Person', value: 'in-person' }
];