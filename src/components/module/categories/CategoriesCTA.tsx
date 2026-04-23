import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CategoriesCTA() {
    return (
        <section className="py-16 px-4 bg-slate-900 text-white">
            <div className="container mx-auto max-w-6xl text-center">
                <h2 className="text-3xl md:text-4xl font-black mb-4">Want to explore more events?</h2>
                <p className="text-lg text-slate-300 max-w-3xl mx-auto mb-8">
                    Our categories page is backed by the backend API, so every selection leads to real event results. Jump to event discovery or create your own event in one click.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button asChild size="lg" variant="secondary" className="bg-white text-slate-900 hover:bg-slate-100">
                        <Link href="/events">Browse All Events</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900">
                        <Link href="/dashboard">Create Event</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
