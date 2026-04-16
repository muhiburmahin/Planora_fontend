'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const CTAMiddleSection = () => {
    return (
        <section className="py-20 px-4 md:px-6 bg-white dark:bg-gray-900">
            <div className="container mx-auto">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-12 md:p-20 text-white">
                    {/* Background Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>

                    <div className="relative z-10 text-center max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Ready to Create Your First Event?
                        </h2>
                        <p className="text-lg text-white/90 mb-8">
                            Join thousands of event organizers who trust Planora. Start planning your amazing event today and reach your audience like never before.
                        </p>

                        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                            <Link
                                href="/register"
                                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                            >
                                Create Event Now
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTAMiddleSection;
