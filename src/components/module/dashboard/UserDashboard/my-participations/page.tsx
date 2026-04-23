'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Users, Eye, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGetMyParticipations } from '@/hooks/participation.hooks';

export default function MyParticipationsPage() {
    const { data: participations, isLoading, error } = useGetMyParticipations();

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
                            My Participations
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
                            Error Loading Participations
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            {error.message || 'Something went wrong while loading your participations.'}
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
                                My Participations
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400">
                                Events you've joined and participated in
                            </p>
                        </div>
                    </div>
                    <Badge variant="outline" className="px-3 py-1">
                        {participations?.length || 0} events
                    </Badge>
                </div>

                {/* Participations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {participations && participations.length > 0 ? (
                        participations.map((participation) => (
                            <Card key={participation.id} className="hover:shadow-lg transition-all duration-300">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                                {participation.event.title}
                                            </CardTitle>
                                            <CardDescription className="text-slate-600 dark:text-slate-400">
                                                {participation.event.description}
                                            </CardDescription>
                                        </div>
                                        <Badge variant={participation.status === 'CONFIRMED' ? 'default' : 'secondary'}>
                                            {participation.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(participation.event.date).toLocaleDateString()} at {participation.event.time}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                            <MapPin className="w-4 h-4" />
                                            {participation.event.location}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                            <Users className="w-4 h-4" />
                                            Organized by {participation.event.organizer?.name || 'Unknown'}
                                        </div>
                                        {participation.event.rating && (
                                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                {participation.event.rating} rating
                                            </div>
                                        )}
                                    </div>

                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href={`/event/${participation.event.id}`}>
                                            <Eye className="w-4 h-4 mr-2" />
                                            View Event Details
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
                                No participations yet
                            </h3>
                            <p className="text-slate-500 dark:text-slate-500 mb-6">
                                You haven't joined any events yet. Browse events and join some to get started.
                            </p>
                            <Button asChild>
                                <Link href="/events">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Browse Events
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}