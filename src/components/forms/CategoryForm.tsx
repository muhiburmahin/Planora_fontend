'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import categoryService from '@/services/categoryService';

export default function CategoryForm({ defaultValues }: { defaultValues?: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            const res = await categoryService.client.create(formData);
            if (res.error) throw res.error;
            alert('Category created');
            router.push('/categories');
        } catch (err) {
            console.error(err);
            alert('Failed to create category');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium">Name</label>
                <input name="name" defaultValue={defaultValues?.name} required className="mt-1 w-full" />
            </div>

            <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea name="description" defaultValue={defaultValues?.description} className="mt-1 w-full" />
            </div>

            <div>
                <label className="block text-sm font-medium">Icon (file)</label>
                <input type="file" name="icon" className="mt-1 w-full" />
            </div>

            <div>
                <label className="block text-sm font-medium">Color (tailwind class)</label>
                <input name="color" defaultValue={defaultValues?.color} className="mt-1 w-full" />
            </div>

            <div>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-primary-600 text-white rounded">
                    {loading ? 'Creating...' : 'Create Category'}
                </button>
            </div>
        </form>
    );
}
