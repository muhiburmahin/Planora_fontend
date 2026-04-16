'use client';

import React from 'react';
import HeroSection from './HeroSection';
import CategoriesSection from './CategoriesSection';
import FeaturedEventsSection from './FeaturedEventsSection';
import FeaturesSection from './FeaturesSection';
import CTAMiddleSection from './CTAMiddleSection';
import TestimonialsSection from './TestimonialsSection';
import { Footer } from '@/components/layout';

export default function HeroPage() {
    return (
        <main className="min-h-screen">
            <HeroSection />
            <CategoriesSection />
            <FeaturedEventsSection />
            <FeaturesSection />
            <CTAMiddleSection />
            <TestimonialsSection />
            <Footer />
        </main>
    );
}
