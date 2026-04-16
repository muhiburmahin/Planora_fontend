'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface Testimonial {
    id: number;
    name: string;
    role: string;
    company: string;
    message: string;
    rating: number;
    initials: string;
    color: string;
}

export const TestimonialsSection = () => {
    const testimonials: Testimonial[] = [
        {
            id: 1,
            name: 'Sarah Johnson',
            role: 'Event Organizer',
            company: 'Tech Innovations Inc.',
            message:
                'Planora transformed how we manage events. The analytics dashboard helped us increase attendee engagement by 40%.',
            rating: 5,
            initials: 'SJ',
            color: 'bg-gradient-primary',
        },
        {
            id: 2,
            name: 'Michael Chen',
            role: 'Marketing Manager',
            company: 'Global Solutions',
            message:
                'The payment processing is seamless, and the real-time updates keep everyone on the same page. Highly recommended!',
            rating: 5,
            initials: 'MC',
            color: 'bg-gradient-to-br from-secondary-400 to-secondary-600',
        },
        {
            id: 3,
            name: 'Emily Rodriguez',
            role: 'Community Lead',
            company: 'Creative Collective',
            message:
                'We managed 5 events in a single month without breaking a sweat. Planora made it incredibly easy for our team.',
            rating: 5,
            initials: 'ER',
            color: 'bg-gradient-to-br from-primary-400 to-secondary-500',
        },
    ];

    return (
        <section className="py-20 px-4 md:px-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        What Our Users Say
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Hear from event organizers who've transformed their business with Planora
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="group p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                        >
                            {/* Rating */}
                            <div className="flex gap-1 mb-4">
                                {Array.from({ length: testimonial.rating }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-5 h-5 fill-secondary-500 text-secondary-500"
                                    />
                                ))}
                            </div>

                            {/* Message */}
                            <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed italic">
                                "{testimonial.message}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <div className={`w-12 h-12 rounded-full ${testimonial.color} text-white font-bold flex items-center justify-center`}>
                                    {testimonial.initials}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white">
                                        {testimonial.name}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {testimonial.role} @ {testimonial.company}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
