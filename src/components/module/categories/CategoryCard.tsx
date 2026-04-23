import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Category } from '@/types/category';

interface CategoryCardProps {
    category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
    const icon = category.icon || category.name?.charAt(0) || '#';
    const color = category.color || '#0f172a';

    return (
        <Card className="group border-slate-200 dark:border-slate-800 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300 shadow-sm">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-4">
                    <div
                        className="flex h-14 w-14 items-center justify-center rounded-3xl text-xl font-black text-white"
                        style={{ backgroundColor: color }}
                    >
                        {icon}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        {category._count?.events ?? 0} events
                    </Badge>
                </div>
                <CardTitle className="mt-5 text-2xl font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">
                    {category.name}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed min-h-[70px]">
                    {category.description || 'No description available for this category.'}
                </p>
                <Link href={`/categories/${category.slug}`} className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-semibold">
                    View category events
                </Link>
            </CardContent>
        </Card>
    );
}
