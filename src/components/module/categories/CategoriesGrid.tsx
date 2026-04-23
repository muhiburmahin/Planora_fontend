import { Category } from '@/types/category';
import CategoryCard from './CategoryCard';

interface CategoriesGridProps {
    categories: Category[];
}

export default function CategoriesGrid({ categories }: CategoriesGridProps) {
    return (
        <section className="py-16 px-4">
            <div className="container mx-auto max-w-7xl">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <p className="text-sm uppercase tracking-[0.24em] text-primary-600 dark:text-primary-400 mb-2">
                            All categories
                        </p>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
                            Choose a category and discover its events
                        </h2>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <CategoryCard key={category.id} category={category} />
                    ))}
                </div>
            </div>
        </section>
    );
}
