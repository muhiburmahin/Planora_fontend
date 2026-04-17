'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Clock,
    MapPin,
    Users,
    Heart,
    Zap,
    Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    formatEventDate,
    formatEventTime,
    getCountdownText,
    getAvailabilityText,
    isSoldOut
} from '@/utils/event';
import { Event } from '@/types/event';
import { EventWithDetails, EventCardProps } from '@/types/eventDitels';

export function EventCard({
    event,
    onWishlistToggle,
    isWishlisted = false,
    viewMode = 'grid',
}: EventCardProps) {
    const [imageError, setImageError] = useState(false);

    // Safety checks for variables
    const eventImage = event.images?.[0]?.url || null;
    const participantCount = event._count?.participations || 0;
    const sold = isSoldOut(participantCount, event.maxParticipants || 0);
    const countdown = getCountdownText(new Date(event.date));
    const availability = getAvailabilityText(participantCount, event.maxParticipants || 0);

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onWishlistToggle?.(event.id);
    };

    // --- Shared Content Components ---
    const BadgeOverlay = () => (
        <div className="absolute top-3 right-3 flex flex-col items-end gap-2 z-10">
            {countdown && (
                <div className="bg-red-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-[10px] font-bold animate-pulse flex items-center gap-1">
                    <Clock size={10} /> {countdown}
                </div>
            )}
            <div className="bg-gradient-primary text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg">
                {event.category?.name || 'General'}
            </div>
        </div>
    );

    const WishlistButton = () => (
        <button
            onClick={handleWishlist}
            className="absolute top-3 left-3 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur hover:scale-110 transition-all z-10 shadow-sm"
        >
            <Heart
                className={cn(
                    "w-4 h-4 transition-colors",
                    isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"
                )}
            />
        </button>
    );

    // --- View Modes ---

    // 1. GRID VIEW
    if (viewMode === 'grid') {
        return (
            <Link href={`/events/${event.slug}`} className="block group">
                <div className="relative flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 border border-gray-100 dark:border-gray-700">

                    {/* Image Section */}
                    <div className="relative h-52 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                        <WishlistButton />
                        <BadgeOverlay />

                        {eventImage && !imageError ? (
                            <Image
                                src={eventImage}
                                alt={event.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                                <Calendar className="w-10 h-10 text-slate-300" />
                            </div>
                        )}

                        {sold && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-20">
                                <span className="px-4 py-2 border-2 border-white text-white font-black uppercase tracking-widest rounded-md transform -rotate-12">
                                    Sold Out
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex flex-col flex-grow">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary-500 transition-colors">
                            {event.title}
                        </h3>

                        <div className="space-y-2.5 mb-4">
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-2 font-medium">
                                <Clock className="w-3.5 h-3.5 text-secondary-500" />
                                {formatEventDate(event.date)} • {event.time}
                            </div>
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-2">
                                {event.isOnline ? (
                                    <><Zap className="w-3.5 h-3.5 text-emerald-500" /> <span>Online Experience</span></>
                                ) : (
                                    <><MapPin className="w-3.5 h-3.5 text-secondary-500" /> <span className="truncate">{event.venue}</span></>
                                )}
                            </div>
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-2">
                                <Users className="w-3.5 h-3.5 text-primary-500" />
                                <span>{participantCount} Joined</span>
                            </div>
                        </div>

                        {availability && (
                            <div className="mb-4 text-[10px] font-bold text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-md inline-block">
                                {availability}
                            </div>
                        )}

                        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Price</p>
                                <p className="text-xl font-black text-transparent bg-clip-text bg-gradient-primary">
                                    {event.registrationFee === 0 ? "FREE" : `$${event.registrationFee.toFixed(2)}`}
                                </p>
                            </div>
                            <button
                                disabled={sold}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md",
                                    sold
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-gradient-primary text-white hover:shadow-lg-primary active:scale-95"
                                )}
                            >
                                {sold ? 'Closed' : 'Book Now'}
                            </button>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    // 2. LIST VIEW
    return (
        <Link href={`/events/${event.slug}`} className="block group">
            <div className="flex flex-col sm:flex-row gap-5 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700">
                {/* Fixed aspect ratio image for list */}
                <div className="relative w-full sm:w-48 h-40 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <WishlistButton />
                    {eventImage && !imageError ? (
                        <Image src={eventImage} alt={event.title} fill className="object-cover" onError={() => setImageError(true)} />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center"><Calendar className="text-gray-300" /></div>
                    )}
                    {sold && <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold text-xs uppercase">Sold Out</div>}
                </div>

                <div className="flex-grow flex flex-col justify-between py-1">
                    <div>
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">{event.category?.name}</span>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500">
                                <Clock size={12} className="text-secondary-500" /> {formatEventDate(event.date)}
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors line-clamp-1">{event.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                            {event.shortDescription || event.description}
                        </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-4">
                            <p className="text-lg font-black text-slate-900 dark:text-white">
                                {event.registrationFee === 0 ? "Free" : `$${event.registrationFee.toFixed(2)}`}
                            </p>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded">
                                {event.isOnline ? 'Online' : 'In-Person'}
                            </span>
                        </div>
                        <button disabled={sold} className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                            Details <span>→</span>
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}