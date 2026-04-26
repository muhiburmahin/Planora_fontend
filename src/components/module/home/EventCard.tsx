'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Users, MapPin, Globe, Star, ArrowUpRight, Loader2 } from 'lucide-react';
import { joinEventAction } from '@/actions/participation.actions';
import { useRouter } from 'next/navigation';
import { Event } from '@/types/event';
import Card, { CardBody } from '../shared/Card';

interface EventCardProps {
    event: Event;
    index?: number;
}

export const EventCard = ({ event, index = 0 }: EventCardProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleJoinEvent = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        setIsLoading(true);
        setError(null);
        
        try {
            const formData = new FormData();
            formData.append('eventId', event.id);
            
            const response = await joinEventAction(null, formData);
            
            if (response.success) {
                router.push(`/dashboard`);
                router.refresh();
            } else {
                setError(response.message || 'Failed to join event');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
            console.error('Join error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (index || 0) * 0.1 }}
        >
            <Card className="group h-full flex flex-col border-none hover:shadow-lg-primary transition-all duration-500 overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800">
                <CardBody className="p-0 flex flex-col h-full">

                    {/* Image Wrapper */}
                    <div className="relative h-60 w-full overflow-hidden">
                        <Image
                            src={event.images?.[0]?.url || '/placeholder.svg'}
                            alt={event.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex gap-2">
                            <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-primary-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase shadow-sm">
                                {event.category?.name || 'Category'}
                            </span>
                            {event.isOnline && (
                                <span className="bg-emerald-500 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-1">
                                    <Globe size={10} /> Live
                                </span>
                            )}
                        </div>

                        {/* Price Badge */}
                        <div className="absolute bottom-4 left-4">
                            <div className="bg-slate-900/80 backdrop-blur-md text-white px-3 py-1.5 rounded-xl font-bold text-sm">
                                {event.registrationFee === 0 ? (
                                    <span className="text-secondary-400">FREE</span>
                                ) : (
                                    <span>${event.registrationFee}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow bg-white dark:bg-slate-900">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-1 text-secondary-500">
                                <Star size={14} className="fill-current" />
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                    {event.averageRating?.toFixed(1) || 0} <span className="text-slate-400 font-normal">({event.totalReviews || 0})</span>
                                </span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                {event.type || 'PUBLIC'}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary-500 transition-colors">
                            {event.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6">
                            {event.shortDescription || 'Amazing event'}
                        </p>

                        {/* Meta Info */}
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
                                <MapPin size={14} className="text-secondary-500 shrink-0" />
                                <span className="truncate font-semibold">{event.venue}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 space-y-2">
                            {/* Join Button */}
                            <button
                                onClick={handleJoinEvent}
                                disabled={isLoading}
                                className="w-full py-3 px-4 bg-gradient-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg-primary active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Joining...
                                    </>
                                ) : (
                                    <>
                                        Join Now <ArrowUpRight size={16} />
                                    </>
                                )}
                            </button>
                            
                            {/* View Details Link */}
                            <Link href={`/events/${event.slug}`} className="block w-full">
                                <button className="w-full py-2.5 px-4 border-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950 rounded-xl font-semibold text-sm transition-all">
                                    View Details
                                </button>
                            </Link>

                            {/* Error Message */}
                            {error && (
                                <div className="text-xs text-red-500 bg-red-50 dark:bg-red-950/20 p-2 rounded-lg text-center">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                </CardBody>
            </Card>
        </motion.div>
    );
};

export default EventCard;
