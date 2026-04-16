'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Users, MapPin, Globe, Star, ArrowUpRight } from 'lucide-react';

import { Event } from '@/types/event';
import { FEATURED_EVENTS } from '@/constants/event';
import Card, { CardBody } from '../shared/Card';

export const FeaturedEventsSection = () => {
    const events = FEATURED_EVENTS
        .filter(e => e.isFeatured && e.isPublished && !e.isDeleted)
        .slice(0, 3);

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
                        Dont miss out on the most anticipated events. Book your spot today and be part of the community.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event: Event, index: number) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="group h-full flex flex-col border-none hover:shadow-lg-primary transition-all duration-500 overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800">
                                <CardBody className="p-0 flex flex-col h-full">

                                    {/* Image Wrapper (Prisma Schema: images Relation) */}
                                    <div className="relative h-60 w-full overflow-hidden">
                                        <Image
                                            src={event.images[0]?.url || '/placeholder.jpg'}
                                            alt={event.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />

                                        {/* Status Badge (Schema: isOnline) */}
                                        <div className="absolute top-4 left-4 flex gap-2">
                                            <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-primary-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase shadow-sm">
                                                {event.category.name}
                                            </span>
                                            {event.isOnline && (
                                                <span className="bg-emerald-500 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-1">
                                                    <Globe size={10} /> Live
                                                </span>
                                            )}
                                        </div>

                                        {/* Price Tag (Schema: registrationFee) */}
                                        <div className="absolute bottom-4 left-4">
                                            <div className="bg-slate-900/80 backdrop-blur-md text-white px-3 py-1.5 rounded-xl font-bold text-sm">
                                                {event.registrationFee === 0 ? (
                                                    <span className="text-orange-400">FREE</span>
                                                ) : (
                                                    `$${event.registrationFee}`
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content (Schema: title, shortDescription, etc.) */}
                                    <div className="p-6 flex flex-col flex-grow bg-white dark:bg-slate-900">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-1 text-orange-500">
                                                <Star size={14} className="fill-current" />
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                    {event.averageRating} <span className="text-slate-400 font-normal">({event.totalReviews})</span>
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                                {event.type}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary-500 transition-colors">
                                            {event.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6">
                                            {event.shortDescription}
                                        </p>

                                        {/* Meta Info (Schema: date, venue, participations) */}
                                        <div className="mt-auto space-y-3">
                                            <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} className="text-primary-500" />
                                                    {new Date(event.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Users size={14} className="text-primary-500" />
                                                    {event._count?.participations || 0} Joined
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                                                <MapPin size={14} className="text-orange-500 shrink-0" />
                                                <span className="truncate font-semibold">{event.venue}</span>
                                            </div>
                                        </div>

                                        {/* CTA - Brand Colored Join Button */}
                                        <div className="mt-6">
                                            <Link href={`/events/${event.slug}`}>
                                                <button className="w-full py-3 px-4 bg-gradient-primary hover:opacity-90 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg-primary active:scale-[0.98]">
                                                    Join Now <ArrowUpRight size={16} />
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </motion.div>
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