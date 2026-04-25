'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

import { Event } from '@/types/event';
import EventCard from './EventCard';

export interface FeaturedEventsSectionProps {
    initialEvents?: any[];
}

export const FeaturedEventsSection = ({ initialEvents }: FeaturedEventsSectionProps) => {
    // Limit to 6 events max (2 rows x 3 columns)
    const events = (initialEvents ?? []).slice(0, 6);

    return (
        <section className="py-20 md:py-32 px-4 bg-white dark:bg-slate-950">
            <div className="container mx-auto max-w-7xl">

                {/* Header - Centered with Gradient Support */}
                <div className="flex flex-col items-center justify-center mb-16 text-center">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-primary-600 bg-primary-50 dark:bg-primary-900/20 mb-4"
                    >
                        Trending Now
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6"
                    >
                        Explore <span className="text-transparent bg-clip-text bg-gradient-primary">Featured</span> Events
                    </motion.h2>
                    <p className="max-w-xl text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
                        Don't miss out on the most anticipated events. Book your spot today and be part of the community.
                    </p>
                </div>

                {/* Grid - 2x3 layout for 6 events */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event: Event, index: number) => (
                        <EventCard key={event.id} event={event} index={index} />
                    ))}
                </div>

                {/* View All */}
                <div className="mt-16 flex justify-center">
                    <Link href="/events" className="flex items-center gap-2 text-slate-900 dark:text-white font-bold hover:text-primary-600 transition-colors group">
                        View all events
                        <span className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-all">
                            <ArrowUpRight size={16} />
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedEventsSection;