'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import CategoryPage from '@/components/module/categories/CategoryPage';

export default function CategorySlugPage() {
    const params = useParams();
    const slug = params.slug as string;

    return <CategoryPage slug={slug} />;
}