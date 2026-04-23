interface CategoriesHeroProps {
    totalCategories: number;
}

export default function CategoriesHero({ totalCategories }: CategoriesHeroProps) {
    return (
        <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-20">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm font-semibold tracking-[0.24em] uppercase text-primary-600 dark:text-primary-400 mb-4">
                    Discover real category data from backend
                </p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight">
                    Browse Every Event Category
                </h1>
                <p className="mt-6 text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                    Our category page is fully wired to the backend. No demo data. No mock content. Every category is loaded from the live API and ready to drive event discovery.
                </p>
                <div className="mt-10 inline-flex items-center justify-center gap-4 rounded-full bg-slate-100 dark:bg-slate-900 px-6 py-4 shadow-sm">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Total categories available:</span>
                    <span className="text-3xl font-black text-slate-900 dark:text-white">{totalCategories}</span>
                </div>
            </div>
        </section>
    );
}
