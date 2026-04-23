import { Category } from '@/types/category';

interface CategoriesStatsProps {
    categories: Category[];
}

const stats = [
    { label: 'Total categories', field: 'categories' },
    { label: 'Total events', field: 'events' },
    { label: 'Active categories', field: 'active' },
    { label: 'Top category events', field: 'topEvents' },
];

export default function CategoriesStats({ categories }: CategoriesStatsProps) {
    const totalCategories = categories.length;
    const totalEvents = categories.reduce((sum, category) => sum + (category._count?.events ?? 0), 0);
    const activeCategories = categories.filter((category) => category.isActive).length;
    const topEvents = categories.reduce((max, category) => Math.max(max, category._count?.events ?? 0), 0);

    const summary = {
        categories: totalCategories,
        events: totalEvents,
        active: activeCategories,
        topEvents,
    };

    return (
        <section className="py-16 px-4">
            <div className="container mx-auto max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {stats.map((item) => (
                        <div key={item.field} className="rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 shadow-sm">
                            <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400 mb-3">
                                {item.label}
                            </p>
                            <p className="text-4xl font-black text-slate-900 dark:text-white">{summary[item.field as keyof typeof summary]}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
