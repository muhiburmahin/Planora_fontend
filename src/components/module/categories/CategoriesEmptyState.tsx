import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface CategoriesEmptyStateProps {
    error?: { message?: string };
}

export default function CategoriesEmptyState({ error }: CategoriesEmptyStateProps) {
    const message = error?.message || 'No categories were returned from the backend at this time.';

    return (
        <section className="py-20 px-4">
            <div className="container mx-auto max-w-3xl rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-12 text-center shadow-sm">
                <p className="text-sm uppercase tracking-[0.24em] text-primary-600 dark:text-primary-400 mb-4">Backend status</p>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Categories are unavailable</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8">{message}</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button asChild variant="secondary" className="bg-primary-600 text-white hover:bg-primary-500">
                        <Link href="/events">Browse Events</Link>
                    </Button>
                    <Button asChild variant="outline" className="border-slate-300 text-slate-900 dark:border-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800">
                        <Link href="/dashboard">Create Event</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
