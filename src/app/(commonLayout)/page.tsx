import HeroPage from "@/components/module/home/hiro";
import eventService from '@/services/eventService';
import categoryService from '@/services/categoryService';

export default async function Home() {
    // Prefetch featured events and categories for initial render
    const [eventsRes, categoriesRes] = await Promise.all([
        eventService.server.list({ isFeatured: true, page: 1, limit: 3 }),
        categoryService.server.getAllCategories(),
    ]);

    const initialFeaturedEvents = eventsRes?.data ?? [];
    const initialCategories = categoriesRes?.data ?? [];

    return <HeroPage initialFeaturedEvents={initialFeaturedEvents} initialCategories={initialCategories} />;
}