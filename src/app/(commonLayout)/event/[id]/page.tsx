import React from 'react'
import eventService from '@/services/eventService';

type Props = { params: { id: string } }

export default async function EventPage({ params }: Props) {
    const id = params.id;
    const res = await eventService.server.getById(id);
    const event = res?.data ?? null;

    if (!event) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold">Event not found</h1>
                <p className="mt-4 text-slate-600">The event may have been removed or does not exist.</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-8">
            <h1 className="text-4xl font-extrabold mb-4">{event.title}</h1>
            <p className="text-sm text-slate-500 mb-6">{event.shortDescription}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <div className="mb-6">
                        <img src={event.images?.[0]?.url || '/placeholder.jpg'} alt={event.title} className="w-full h-80 object-cover rounded-lg" />
                    </div>

                    <div className="prose max-w-none">
                        <p>{event.description}</p>
                    </div>
                </div>

                <aside className="p-6 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-bold text-slate-500 uppercase">When</h4>
                            <p className="text-lg font-semibold">{new Date(event.date).toLocaleString()}</p>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-slate-500 uppercase">Where</h4>
                            <p className="text-lg font-semibold">{event.venue}{event.isOnline ? ' (Online)' : ''}</p>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-slate-500 uppercase">Price</h4>
                            <p className="text-lg font-semibold">{event.registrationFee === 0 ? 'Free' : `$${event.registrationFee}`}</p>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-slate-500 uppercase">Category</h4>
                            <p className="text-lg font-semibold">{event.category?.name}</p>
                        </div>

                        <div className="mt-4">
                            <button className="w-full py-3 bg-primary-600 text-white rounded-lg font-bold">Join Event</button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

