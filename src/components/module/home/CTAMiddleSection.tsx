'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const CTAMiddleSection = () => {
    return (
        <section className="py-20 px-4 md:px-6 bg-white dark:bg-slate-950">
            <div className="container mx-auto">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-12 md:p-20 text-white">
                    {/* Background Elements with Brand Colors */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-400 opacity-10 rounded-full transform translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-white opacity-5 rounded-full transform -translate-x-1/2 translate-y-1/2 blur-3xl"></div>

                    <div className="relative z-10 text-center max-w-3xl mx-auto space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
                                Ready to Create Your <br className="hidden sm:block" />
                                <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl mt-3">
                                    First Event?
                                </span>
                            </h2>
                            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-medium">
                                Join thousands of event organizers who trust Planora. Start planning your amazing event today and reach your audience like never before.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                            <Link href="/register" className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-bold rounded-xl hover:shadow-2xl hover:shadow-white/30 transition-all duration-300 hover:-translate-y-1 group text-lg">
                                Create Event Now
                                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                            <Link href="/login" className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 backdrop-blur-sm transition-all duration-300 text-lg">
                                Sign In
                            </Link>
                        </div>

                        {/* Trust Badge */}
                        <div className="pt-8 border-t border-white/20">
                            <p className="text-white/80 text-sm font-semibold mb-4">Trusted by organizers worldwide</p>
                            <div className="flex justify-center items-center gap-6 flex-wrap">
                                <span className="text-white/70 font-bold">50K+ Events</span>
                                <span className="text-white/70">•</span>
                                <span className="text-white/70 font-bold">100K+ Users</span>
                                <span className="text-white/70">•</span>
                                <span className="text-white/70 font-bold">99.9% Uptime</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTAMiddleSection;
