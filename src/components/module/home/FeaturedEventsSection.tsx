'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

import { Event } from '@/types/event';
import EventCard from '../shared/EventCard';

export interface FeaturedEventsSectionProps {
    initialEvents?: any[];
}

export const FeaturedEventsSection = ({ initialEvents }: FeaturedEventsSectionProps) => {
    // ৬টি ইভেন্ট লিমিট (ডেস্কটপে ২ রো x ৩ কলাম)
    const events = (initialEvents ?? []).slice(0, 6);

    return (
        <section className="py-16 md:py-32 px-4 bg-white dark:bg-slate-950">
            <div className="container mx-auto max-w-7xl">

                {/* Header Section */}
                <div className="flex flex-col items-center justify-center mb-12 md:mb-16 text-center px-4">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="px-4 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary-600 bg-primary-50 dark:bg-primary-900/20 mb-4"
                    >
                        Trending Now
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 md:mb-6"
                    >
                        Explore <span className="text-transparent bg-clip-text bg-gradient-primary">Featured</span> Events
                    </motion.h2>
                    <p className="max-w-xl text-slate-500 dark:text-slate-400 text-base md:text-lg leading-relaxed">
                        Don't miss out on the most anticipated events. Book your spot today and be part of the community.
                    </p>
                </div>

                {/* Grid - Mobile: 1 col | Tablet: 2 cols | Desktop: 3 cols */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {events.map((event: Event, index: number) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="w-full"
                        >
                            <EventCard event={event} index={index} />
                        </motion.div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="mt-12 md:mt-16 flex justify-center">
                    <Link
                        href="/events"
                        className="flex items-center gap-2 text-slate-900 dark:text-white font-bold hover:text-primary-600 transition-all group px-6 py-3 rounded-2xl border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
                    >
                        <span className="text-sm md:text-base">View all events</span>
                        <span className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-all">
                            <ArrowUpRight size={16} />
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedEventsSection;