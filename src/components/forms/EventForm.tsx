'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import eventService from '@/services/eventService';

export default function EventForm({ defaultValues }: { defaultValues?: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const form = e.currentTarget;
        const formData = new FormData();
        const data = new FormData(form);

        // copy fields
        for (const [key, value] of data.entries()) {
            if (key === 'images') {
                // append files
                const files = form.querySelector<HTMLInputElement>('input[name="images"]')?.files;
                if (files) {
                    for (let i = 0; i < files.length; i++) formData.append('images', files[i]);
                }
            } else {
                formData.append(key, String(value));
            }
        }

        try {
            const res = await eventService.client.create(formData);
            if (res.error) throw res.error;
            alert('Event created');
            router.push('/events');
        } catch (err) {
            console.error(err);
            alert('Failed to create event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium">Title</label>
                <input name="title" defaultValue={defaultValues?.title} required className="mt-1 w-full" />
            </div>

            <div>
                <label className="block text-sm font-medium">Short Description</label>
                <input name="shortDescription" defaultValue={defaultValues?.shortDescription} required className="mt-1 w-full" />
            </div>

            <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea name="description" defaultValue={defaultValues?.description} className="mt-1 w-full" />
            </div>

            <div>
                <label className="block text-sm font-medium">Date</label>
                <input type="datetime-local" name="date" defaultValue={defaultValues?.date} required className="mt-1 w-full" />
            </div>

            <div>
                <label className="block text-sm font-medium">Venue</label>
                <input name="venue" defaultValue={defaultValues?.venue} className="mt-1 w-full" />
            </div>

            <div>
                <label className="block text-sm font-medium">Registration Fee</label>
                <input type="number" name="registrationFee" defaultValue={defaultValues?.registrationFee ?? 0} className="mt-1 w-full" />
            </div>

            <div>
                <label className="inline-flex items-center">
                    <input type="checkbox" name="isOnline" defaultChecked={defaultValues?.isOnline} />
                    <span className="ml-2">Online Event</span>
                </label>
            </div>

            <div>
                <label className="block text-sm font-medium">Category ID</label>
                <input name="categoryId" defaultValue={defaultValues?.categoryId} className="mt-1 w-full" />
            </div>

            <div>
                <label className="block text-sm font-medium">Images</label>
                <input type="file" name="images" multiple className="mt-1 w-full" />
            </div>

            <div>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-primary-600 text-white rounded">
                    {loading ? 'Creating...' : 'Create Event'}
                </button>
            </div>
        </form>
    );
}
