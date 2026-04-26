import React from 'react';
import HeroSection from './HeroSection';
import CategoriesSection, { CategoriesSectionProps } from './CategoriesSection';
import FeaturedEventsSection, { FeaturedEventsSectionProps } from './FeaturedEventsSection';
import FeaturesSection from './FeaturesSection';
import CTAMiddleSection from './CTAMiddleSection';
import TestimonialsSection from './TestimonialsSection';
import { Footer } from '@/components/layout';


interface HeroPageProps {
    initialFeaturedEvents?: any[];
    initialCategories?: CategoriesSectionProps['initialCategories'];
}

export default function HeroPage({ initialFeaturedEvents, initialCategories }: HeroPageProps) {
    return (
        <main className="min-h-screen">
            <HeroSection />
            <CategoriesSection initialCategories={initialCategories} />
            <FeaturedEventsSection initialEvents={initialFeaturedEvents} />
            <FeaturesSection />
            <CTAMiddleSection />
            <TestimonialsSection />
            <Footer />
        </main>
    );
}
