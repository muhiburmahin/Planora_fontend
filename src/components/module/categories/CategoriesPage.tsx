import { Category } from '@/types/category';
import categoryService from '@/services/categoryService';
import CategoriesHero from './CategoriesHero';
import CategoriesStats from './CategoriesStats';
import CategoriesHighlight from './CategoriesHighlight';
import CategoriesGrid from './CategoriesGrid';
import CategoriesCTA from './CategoriesCTA';
import CategoriesEmptyState from './CategoriesEmptyState';

export default async function CategoriesPage() {
    const categoriesRes = await categoryService.server.getAllCategories();
    const categories = categoriesRes?.data ?? [];
    const error = categoriesRes?.error;
    const sortedCategories = [...categories].sort((a, b) => (b._count?.events ?? 0) - (a._count?.events ?? 0));
    const featuredCategory = sortedCategories[0] ?? null;

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <CategoriesHero totalCategories={categories.length} />
            <CategoriesStats categories={categories} />
            {error ? (
                <CategoriesEmptyState error={error} />
            ) : categories.length === 0 ? (
                <CategoriesEmptyState />
            ) : (
                <>
                    {featuredCategory && <CategoriesHighlight category={featuredCategory} />}
                    <CategoriesGrid categories={categories} />
                </>
            )}
            <CategoriesCTA />
        </main>
    );
}
