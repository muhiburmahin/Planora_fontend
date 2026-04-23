import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Category } from '@/types/category';

interface CategoriesHighlightProps {
    category: Category;
}

export default function CategoriesHighlight({ category }: CategoriesHighlightProps) {
    return (
        <section className="bg-gradient-to-r from-primary-600 to-indigo-600 text-white py-16 px-4">
            <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div>
                    <Badge className="bg-white/10 text-white mb-4" variant="secondary">
                        Most active category
                    </Badge>
                    <h2 className="text-4xl font-black leading-tight mb-4">{category.name}</h2>
                    <p className="text-lg text-white/80 mb-6">{category.description || 'This category has the highest number of events in the backend.'}</p>
                    <div className="flex flex-wrap gap-3 items-center">
                        <div className="rounded-3xl bg-white/10 px-4 py-3">Events: {category._count?.events ?? 0}</div>
                        <div className="rounded-3xl bg-white/10 px-4 py-3">Status: {category.isActive ? 'Active' : 'Inactive'}</div>
                    </div>
                </div>
                <div className="rounded-[2rem] bg-white/10 p-8 border border-white/10 shadow-2xl">
                    <div className="text-sm uppercase tracking-[0.28em] text-white/70 mb-4">Category Overview</div>
                    <p className="text-white/90 leading-relaxed">{category.description || 'A detailed backend-powered category with live event counts and real data from the API.'}</p>
                    <div className="mt-8">
                        <Link href={`/categories/${category.slug}`} className="inline-flex items-center rounded-full bg-white text-primary-700 px-6 py-3 font-semibold hover:bg-slate-100 transition">
                            View category events
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
