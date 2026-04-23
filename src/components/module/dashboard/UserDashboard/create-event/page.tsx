'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import EventForm from '@/components/forms/EventForm';

export default function CreateEventPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/dashboard">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                                Create New Event
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400">
                                Fill in the details to organize your event
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
                        <EventForm />
                    </div>
                </div>
            </div>
        </div>
    );
}