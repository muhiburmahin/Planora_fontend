'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, PlusCircle, Calendar, MapPin, Users, Edit, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGetMyEvents } from '@/hooks/event.hooks';

export default function MyEventsPage() {
    const { data: events, isLoading, error } = useGetMyEvents();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-4 mb-8">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/dashboard">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                        </Button>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            My Events
                        </h1>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <Card key={i} className="animate-pulse">
                                <CardContent className="p-6">
                                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4"></div>
                                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                            Error Loading Events
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            {error.message || 'Something went wrong while loading your events.'}
                        </p>
                        <Button onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/dashboard">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                                My Events
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400">
                                Manage the events you've organized
                            </p>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href="/dashboard/create-event">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Create Event
                        </Link>
                    </Button>
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events && events.length > 0 ? (
                        events.map((event) => (
                            <Card key={event.id} className="hover:shadow-lg transition-all duration-300">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                                {event.title}
                                            </CardTitle>
                                            <CardDescription className="text-slate-600 dark:text-slate-400">
                                                {event.description}
                                            </CardDescription>
                                        </div>
                                        <Badge variant={event.status === 'ACTIVE' ? 'default' : 'secondary'}>
                                            {event.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(event.date).toLocaleDateString()} at {event.time}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                            <MapPin className="w-4 h-4" />
                                            {event.location}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                            <Users className="w-4 h-4" />
                                            {event.attendees || 0} / {event.maxAttendees} attendees
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1" asChild>
                                            <Link href={`/event/${event.id}`}>
                                                <Eye className="w-4 h-4 mr-1" />
                                                View
                                            </Link>
                                        </Button>
                                        <Button variant="outline" size="sm" className="flex-1" asChild>
                                            <Link href={`/dashboard/edit-event/${event.id}`}>
                                                <Edit className="w-4 h-4 mr-1" />
                                                Edit
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
                                No events yet
                            </h3>
                            <p className="text-slate-500 dark:text-slate-500 mb-6">
                                You haven't organized any events yet. Create your first event to get started.
                            </p>
                            <Button asChild>
                                <Link href="/dashboard/create-event">
                                    <PlusCircle className="w-4 h-4 mr-2" />
                                    Create Your First Event
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}