'use client';

import React from 'react';
import { Calendar, TrendingUp, Shield } from 'lucide-react';

interface Feature {
    id: number;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
}

export const FeaturesSection = () => {
    const features: Feature[] = [
        {
            id: 1,
            title: 'Easy Planning',
            description: 'Create and organize events in minutes with our intuitive interface. No technical knowledge required.',
            icon: <Calendar className="w-8 h-8" />,
            color: 'text-secondary-500',
        },
        {
            id: 2,
            title: 'Real-time Analytics',
            description: 'Track event metrics, attendee engagement, and revenue in real-time with detailed dashboards.',
            icon: <TrendingUp className="w-8 h-8" />,
            color: 'text-primary-500',
        },
        {
            id: 3,
            title: 'Secure Payments',
            description: 'Process payments safely with Stripe integration. Support multiple payment methods and currencies.',
            icon: <Shield className="w-8 h-8" />,
            color: 'text-secondary-500',
        },
    ];

    return (
        <section className="py-20 px-4 md:px-6 bg-white dark:bg-gray-900">
            <div className="container mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Powerful Features
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Everything you need to manage successful events
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <div
                            key={feature.id}
                            className="group p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-300 hover:shadow-lg"
                        >
                            {/* Icon */}
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/30 dark:to-secondary-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${feature.color}`}>
                                {feature.icon}
                            </div>

                            {/* Content */}
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
