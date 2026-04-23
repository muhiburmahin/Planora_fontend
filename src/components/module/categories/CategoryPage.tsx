'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CalendarDays, MapPin, Users, Star, Search, Filter,
    ArrowRight, Home, ChevronRight, Clock, DollarSign,
    Wifi, WifiOff, Eye, EyeOff, SortAsc, SortDesc
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

import { useGetCategoryById } from '@/hooks/category.hooks';
import { useGetEventsByCategory } from '@/hooks/event.hooks';
import { EventStatus, EventType } from '@/types/event';

interface CategoryPageProps {
    slug: string;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ slug }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<EventStatus | 'ALL'>('UPCOMING');
    const [priceFilter, setPriceFilter] = useState<'ALL' | 'FREE' | 'PAID'>('ALL');
    const [typeFilter, setTypeFilter] = useState<EventType | 'ALL'>('ALL');
    const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

    // Get category details
    const { data: category, isLoading: categoryLoading, error: categoryError } = useGetCategoryById(slug);

    // Get events for this category
    const { data: allEvents = [], isLoading: eventsLoading, error: eventsError } = useGetEventsByCategory(slug, {
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        isFree: priceFilter === 'FREE' ? true : priceFilter === 'PAID' ? false : undefined,
        type: typeFilter !== 'ALL' ? typeFilter : undefined,
    });

    // Filter and sort events
    const filteredEvents = useMemo(() => {
        let filtered = allEvents.filter(event =>
            event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.description.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Sort
        filtered.sort((a, b) => {
            if (sortBy === 'date') {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
            } else {
                const ratingA = a.averageRating || 0;
                const ratingB = b.averageRating || 0;
                return sortOrder === 'desc' ? ratingB - ratingA : ratingA - ratingB;
            }
        });

        return filtered;
    }, [allEvents, searchQuery, sortBy, sortOrder]);

    // Separate upcoming and past events
    const upcomingEvents = filteredEvents.filter(event => event.status === EventStatus.UPCOMING);
    const pastEvents = filteredEvents.filter(event => event.status === EventStatus.COMPLETED);

    if (categoryLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-16">
                <div className="container mx-auto px-4">
                    <Skeleton className="h-12 w-64 mx-auto mb-8" />
                    <Skeleton className="h-6 w-96 mx-auto mb-12" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="h-64" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (categoryError || !category) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                        Category Not Found
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        The category you're looking for doesn't exist.
                    </p>
                    <Button asChild>
                        <Link href="/categories">Back to Categories</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* Breadcrumbs */}
            <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4 py-4">
                    <nav className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                        <Link href="/" className="hover:text-primary-600 flex items-center gap-1">
                            <Home size={16} />
                            Home
                        </Link>
                        <ChevronRight size={16} />
                        <Link href="/categories" className="hover:text-primary-600">
                            Categories
                        </Link>
                        <ChevronRight size={16} />
                        <span className="text-slate-900 dark:text-white font-medium">
                            {category.name}
                        </span>
                    </nav>
                </div>
            </div>

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-4xl mx-auto">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6"
                        >
                            <span className="text-4xl">{category.icon || '🎯'}</span>
                        </motion.div>

                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-4xl md:text-5xl font-black mb-4"
                        >
                            {category.name}
                        </motion.h1>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-primary-100 mb-6 max-w-2xl mx-auto"
                        >
                            {category.description}
                        </motion.p>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center justify-center gap-4 text-primary-100"
                        >
                            <div className="flex items-center gap-2">
                                <CalendarDays size={20} />
                                <span>{filteredEvents.length} Events</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Filters and Search */}
            <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-6">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="relative w-full lg:w-80">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                            <Input
                                placeholder="Search events..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-3 items-center">
                            <Select value={statusFilter} onValueChange={(value: EventStatus | 'ALL') => setStatusFilter(value)}>
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Status</SelectItem>
                                    <SelectItem value={EventStatus.UPCOMING}>Upcoming</SelectItem>
                                    <SelectItem value={EventStatus.ONGOING}>Ongoing</SelectItem>
                                    <SelectItem value={EventStatus.COMPLETED}>Completed</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={priceFilter} onValueChange={(value: 'ALL' | 'FREE' | 'PAID') => setPriceFilter(value)}>
                                <SelectTrigger className="w-24">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All</SelectItem>
                                    <SelectItem value="FREE">Free</SelectItem>
                                    <SelectItem value="PAID">Paid</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={typeFilter} onValueChange={(value: EventType | 'ALL') => setTypeFilter(value)}>
                                <SelectTrigger className="w-28">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Types</SelectItem>
                                    <SelectItem value={EventType.PUBLIC}>Public</SelectItem>
                                    <SelectItem value={EventType.PRIVATE}>Private</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                                const [sort, order] = value.split('-');
                                setSortBy(sort as 'date' | 'rating');
                                setSortOrder(order as 'asc' | 'desc');
                            }}>
                                <SelectTrigger className="w-36">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="date-desc">Newest First</SelectItem>
                                    <SelectItem value="date-asc">Oldest First</SelectItem>
                                    <SelectItem value="rating-desc">Top Rated</SelectItem>
                                    <SelectItem value="rating-asc">Lowest Rated</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Events Section */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    {/* Custom Tabs */}
                    <div className="flex justify-center mb-8">
                        <div className="inline-flex h-12 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
                            <button
                                onClick={() => setActiveTab('upcoming')}
                                className={cn(
                                    "inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2 text-sm font-medium transition-all",
                                    activeTab === 'upcoming'
                                        ? "bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm"
                                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                )}
                            >
                                Upcoming Events ({upcomingEvents.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('past')}
                                className={cn(
                                    "inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2 text-sm font-medium transition-all",
                                    activeTab === 'past'
                                        ? "bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm"
                                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                )}
                            >
                                Past Events ({pastEvents.length})
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <AnimatePresence mode="wait">
                        {activeTab === 'upcoming' ? (
                            <motion.div
                                key="upcoming"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {upcomingEvents.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {upcomingEvents.map((event) => (
                                            <EventCard key={event.id} event={event} />
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState message="No upcoming events in this category yet. Check back later!" />
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="past"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {pastEvents.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {pastEvents.map((event) => (
                                            <EventCard key={event.id} event={event} />
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState message="No past events in this category." />
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>
        </div>
    );
};

// Event Card Component
const EventCard: React.FC<{ event: any }> = ({ event }) => {
    const formatDate = (date: string | Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (time: string) => {
        return new Date(`2000-01-01 ${time}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="group hover:shadow-2xl transition-all duration-300 border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="relative">
                    <div className="aspect-video relative overflow-hidden">
                        {event.images && event.images.length > 0 ? (
                            <Image
                                src={event.images[0].url}
                                alt={event.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 flex items-center justify-center">
                                <CalendarDays className="h-12 w-12 text-primary-600" />
                            </div>
                        )}
                    </div>

                    {/* Featured Badge */}
                    {event.isFeatured && (
                        <Badge className="absolute top-3 left-3 bg-yellow-500 text-yellow-900 hover:bg-yellow-600">
                            Featured
                        </Badge>
                    )}

                    {/* Status Badge */}
                    <Badge
                        variant={event.status === EventStatus.UPCOMING ? "default" : "secondary"}
                        className="absolute top-3 right-3"
                    >
                        {event.status}
                    </Badge>
                </div>

                <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 line-clamp-2">
                                {event.title}
                            </h3>
                            {event.averageRating && (
                                <div className="flex items-center gap-1 mb-2">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm text-slate-600 dark:text-slate-400">
                                        {event.averageRating.toFixed(1)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <CalendarDays className="h-4 w-4" />
                            <span>{formatDate(event.date)}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <Clock className="h-4 w-4" />
                            <span>{formatTime(event.time)}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">
                                {event.isOnline ? 'Online Event' : event.venue}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            {event.isOnline ? (
                                <Wifi className="h-4 w-4" />
                            ) : (
                                <MapPin className="h-4 w-4" />
                            )}
                            <span>{event.isOnline ? 'Online' : 'Offline'}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-slate-400" />
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                {event._count?.participations || 0} attending
                            </span>
                        </div>

                        <div className="text-right">
                            {event.registrationFee === 0 ? (
                                <Badge variant="outline" className="text-green-600 border-green-600">
                                    Free
                                </Badge>
                            ) : (
                                <div className="flex items-center gap-1">
                                    <DollarSign className="h-4 w-4 text-slate-400" />
                                    <span className="font-bold text-primary-600">
                                        ${event.registrationFee}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <Button asChild className="w-full mt-4 group-hover:bg-primary-600">
                        <Link href={`/events/${event.slug}`}>
                            View Details
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );
};

// Empty State Component
const EmptyState: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center py-16">
        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <CalendarDays className="h-12 w-12 text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            No Events Found
        </h3>
        <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            {message}
        </p>
    </div>
);

export default CategoryPage;