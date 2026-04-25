'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { ChevronRight, ArrowUpRight } from 'lucide-react';
import { CategoryUI } from '@/types/category';

const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Icon = (LucideIcons as any)[name] || LucideIcons.HelpCircle;
    return <Icon className={className} />;
};

export interface CategoriesSectionProps {
    initialCategories?: Array<{ id: string; name: string; description?: string; iconName?: string; color?: string; _count?: any }>
}

export const CategoriesSection = ({ initialCategories }: CategoriesSectionProps) => {
    const displayCategories = initialCategories ?? [];

    return (
        <section className="py-20 md:py-28 px-4 bg-white dark:bg-slate-950 transition-colors duration-500 border-b border-slate-100 dark:border-slate-900">
            <div className="container mx-auto max-w-7xl">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20 space-y-5">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800"
                    >
                        <span className="text-[11px] font-bold text-primary-700 dark:text-primary-400 uppercase tracking-[0.2em]">
                            Explore Our Ecosystem
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]"
                    >
                        Browse by <span className="bg-gradient-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent">Category</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed"
                    >
                        Find your next big opportunity or learning experience across our most popular industries.
                    </motion.p>
                </div>

                {/* Category Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {displayCategories.map((category: any, index: number) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -12 }}
                            className="group relative flex flex-col items-center text-center p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 backdrop-blur-sm hover:border-primary-500/50 hover:ring-4 hover:ring-primary-500/5 transition-all duration-500 shadow-sm cursor-pointer"
                        >
                            {/* Icon Box */}
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-8 shadow-xl group-hover:rotate-[10deg] transition-transform duration-500`}>
                                <DynamicIcon name={category.iconName} className="w-8 h-8 text-white" />
                            </div>

                            {/* Text Content */}
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">
                                    {category.name}
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed min-h-[40px]">
                                    {category.description || "No description available"}
                                </p>
                            </div>

                            {/* Stats & Action */}
                            <div className="mt-10 flex flex-col items-center gap-4">
                                <span className="text-[10px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-[0.2em] bg-primary-50 dark:bg-primary-900/30 px-3 py-1.5 rounded-lg">
                                    {category._count?.events || 0} Events
                                </span>
                                <div className="p-3 rounded-full bg-slate-50 dark:bg-slate-800 group-hover:bg-primary-600 group-hover:text-white group-hover:scale-110 transition-all shadow-md">
                                    <ChevronRight size={20} />
                                </div>
                            </div>

                            {/* Hover Glow */}
                            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]" />
                        </motion.div>
                    ))}
                </div>

                {/* Centered Footer Button with Navigation */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-20 flex justify-center"
                >
                    <Link href="/categories">
                        <button className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:shadow-2xl hover:shadow-primary-500/20 transition-all active:scale-95 group">
                            View All Categories
                            <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default CategoriesSection;