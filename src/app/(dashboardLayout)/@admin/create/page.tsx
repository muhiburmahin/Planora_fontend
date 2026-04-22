import React from 'react';
import EventForm from '@/components/forms/EventForm';

export default function CreateEventPage() {
    return (
        <div className="max-w-3xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-4">Create Event</h1>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-100 dark:border-slate-800">
                <EventForm />
            </div>
        </div>
    );
}
