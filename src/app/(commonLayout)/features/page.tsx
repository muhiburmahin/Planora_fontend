'use client';

import React from 'react';
import Link from 'next/link';
import {
    Calendar,
    Users,
    Zap,
    BarChart3,
    Lock,
    Globe,
    Smartphone,
    CreditCard,
    Bell,
    Share2,
    FileText,
    CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/module/common/Button';
import { Container } from '@/components/module/common/Container';
import { Card } from '@/components/module/common/Card';

export default function FeaturesPage() {
    return (
        <div className="w-full">
            {/* ===== SECTION 1: HERO SECTION ===== */}
            <section className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-20 md:py-32">
                <Container>
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                            Powerful Features for
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"> Modern Events</span>
                        </h1>
                        <p className="text-xl text-slate-300">
                            Everything you need to create, manage, and grow your events. Designed for simplicity, built for scale.
                        </p>
                    </div>
                </Container>
            </section>

            {/* ===== SECTION 2: CORE FEATURES ===== */}
            <section className="py-20 md:py-32 bg-slate-50 dark:bg-slate-900">
                <Container>
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                            Core Features
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">
                            The essential tools for successful event management
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Feature 1 */}
                        <Card className="p-8 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4">
                                <Calendar className="text-white" size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                Event Creation
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Create events with custom fields, date/time settings, and rich descriptions
                            </p>
                        </Card>

                        {/* Feature 2 */}
                        <Card className="p-8 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4">
                                <Users className="text-white" size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                Registration Management
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Handle attendee registrations, approvals, and waitlist management
                            </p>
                        </Card>

                        {/* Feature 3 */}
                        <Card className="p-8 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4">
                                <BarChart3 className="text-white" size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                Real-time Analytics
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Track registrations, attendance, and engagement metrics in real-time
                            </p>
                        </Card>

                        {/* Feature 4 */}
                        <Card className="p-8 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4">
                                <CreditCard className="text-white" size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                Payment Processing
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Secure ticket sales with multiple payment methods and instant payouts
                            </p>
                        </Card>

                        {/* Feature 5 */}
                        <Card className="p-8 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4">
                                <Bell className="text-white" size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                Notifications
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Send automated emails and SMS to keep attendees informed about your event
                            </p>
                        </Card>

                        {/* Feature 6 */}
                        <Card className="p-8 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4">
                                <Share2 className="text-white" size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                Social Sharing
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Built-in social sharing to help promote events and reach more audience
                            </p>
                        </Card>

                        {/* Feature 7 */}
                        <Card className="p-8 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4">
                                <Smartphone className="text-white" size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                Mobile App
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Manage events on the go with our powerful mobile application
                            </p>
                        </Card>

                        {/* Feature 8 */}
                        <Card className="p-8 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4">
                                <Lock className="text-white" size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                Security
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Enterprise-grade security with SSL encryption and data protection
                            </p>
                        </Card>
                    </div>
                </Container>
            </section>

            {/* ===== SECTION 3: ADVANCED FEATURES ===== */}
            <section className="py-20 md:py-32 bg-white dark:bg-slate-800">
                <Container>
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                            Advanced Features
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">
                            Take your events to the next level with premium features
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Advanced Features List 1 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                                Event Management
                            </h3>
                            {[
                                'Custom registration forms',
                                'Multiple ticket tiers',
                                'Early bird discounts',
                                'Referral tracking',
                                'Custom email templates',
                                'Event category organization',
                            ].map((feature, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="text-white" size={16} />
                                    </div>
                                    <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                                </div>
                            ))}
                        </div>

                        {/* Advanced Features List 2 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                                Analytics & Reporting
                            </h3>
                            {[
                                'Attendance tracking',
                                'Revenue reports',
                                'Demographic insights',
                                'Export data to CSV',
                                'Custom dashboards',
                                'Forecasting tools',
                            ].map((feature, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="text-white" size={16} />
                                    </div>
                                    <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Container>
            </section>

            {/* ===== SECTION 4: START USING FEATURES ===== */}
            <section className="py-20 md:py-32 bg-gradient-to-r from-primary via-purple-500 to-secondary text-white">
                <Container>
                    <div className="max-w-3xl mx-auto text-center space-y-8">
                        <h2 className="text-4xl md:text-5xl font-bold">
                            Unlock All Features Today
                        </h2>
                        <p className="text-xl opacity-90">
                            Start creating amazing events with Planoras complete feature set. No credit card required.
                        </p>
                        <div className="bg-white/10 backdrop-blur rounded-lg p-8 border border-white/20">
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <div>
                                    <p className="text-3xl font-bold">0%</p>
                                    <p className="opacity-75">Fees on free plan</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold">∞</p>
                                    <p className="opacity-75">Events allowed</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold">24/7</p>
                                    <p className="opacity-75">Email support</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register">
                                <Button variant="secondary" size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-slate-100">
                                    Get Started Free
                                </Button>
                            </Link>
                            <Link href="/pricing">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                                    View Pricing
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Container>
            </section>
        </div>
    );
}
