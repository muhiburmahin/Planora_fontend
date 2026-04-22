'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/module/common/Button';
import { Container } from '@/components/module/common/Container';
import { Card } from '@/components/module/common/Card';
import { Badge } from '@/components/module/common/Badge';

export default function PricingPage() {
    const plans = [
        {
            name: 'Starter',
            price: 0,
            description: 'Perfect for getting started',
            features: [
                'Up to 5 events',
                '100 attendees per event',
                'Basic analytics',
                'Email support',
                'Event templates',
                'Community access',
            ],
            cta: 'Get Started',
            highlighted: false,
        },
        {
            name: 'Professional',
            price: 29,
            description: 'For growing organizers',
            features: [
                'Unlimited events',
                'Unlimited attendees',
                'Advanced analytics',
                'Priority email & chat support',
                'Custom branding',
                'Integrations',
                'Mobile app access',
                'API access',
            ],
            cta: 'Start Free Trial',
            highlighted: true,
        },
        {
            name: 'Enterprise',
            price: null,
            description: 'For large organizations',
            features: [
                'Everything in Professional',
                'Dedicated account manager',
                'Custom integrations',
                'Phone support',
                'White-label solution',
                'Advanced security',
                'SLA guarantee',
                'Training & onboarding',
            ],
            cta: 'Contact Sales',
            highlighted: false,
        },
    ];

    return (
        <div className="w-full">
            {/* ===== SECTION 1: HERO SECTION ===== */}
            <section className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-20 md:py-32">
                <Container>
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                            Simple, Transparent
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"> Pricing</span>
                        </h1>
                        <p className="text-xl text-slate-300">
                            Choose the perfect plan for your needs. No hidden fees. Cancel anytime.
                        </p>
                    </div>
                </Container>
            </section>

            {/* ===== SECTION 2: PRICING CARDS ===== */}
            <section className="py-20 md:py-32 bg-slate-50 dark:bg-slate-900">
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan, index) => (
                            <Card
                                key={index}
                                className={`p-8 flex flex-col transition-all ${plan.highlighted
                                    ? 'ring-2 ring-primary scale-105 md:scale-100'
                                    : ''
                                    }`}
                            >
                                {/* Badge */}
                                {plan.highlighted && (
                                    <div className="mb-4">
                                        <Badge variant="info">Most Popular</Badge>
                                    </div>
                                )}

                                {/* Plan Name */}
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                    {plan.name}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-6">
                                    {plan.description}
                                </p>

                                {/* Price */}
                                <div className="mb-8">
                                    {plan.price !== null ? (
                                        <>
                                            <span className="text-5xl font-bold text-slate-900 dark:text-white">
                                                ${plan.price}
                                            </span>
                                            <span className="text-slate-600 dark:text-slate-400 ml-2">
                                                /month
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                            Custom pricing
                                        </span>
                                    )}
                                </div>

                                {/* CTA Button */}
                                <Button
                                    variant={plan.highlighted ? 'primary' : 'outline'}
                                    size="lg"
                                    className="w-full mb-8"
                                >
                                    {plan.cta}
                                    <ArrowRight size={20} className="ml-2" />
                                </Button>

                                {/* Features List */}
                                <div className="space-y-4 flex-1">
                                    {plan.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <CheckCircle
                                                size={20}
                                                className="text-primary flex-shrink-0 mt-0.5"
                                            />
                                            <span className="text-slate-700 dark:text-slate-300">
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        ))}
                    </div>
                </Container>
            </section>

            {/* ===== SECTION 3: COMPARISON TABLE ===== */}
            <section className="py-20 md:py-32 bg-white dark:bg-slate-800">
                <Container>
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                            Detailed Comparison
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">
                            See which plan works best for your needs
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                                    <th className="text-left py-4 px-6 font-bold text-slate-900 dark:text-white">
                                        Feature
                                    </th>
                                    <th className="text-center py-4 px-6 font-bold text-slate-900 dark:text-white">
                                        Starter
                                    </th>
                                    <th className="text-center py-4 px-6 font-bold text-slate-900 dark:text-white">
                                        Professional
                                    </th>
                                    <th className="text-center py-4 px-6 font-bold text-slate-900 dark:text-white">
                                        Enterprise
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { name: 'Events', starter: '5', pro: 'Unlimited', ent: 'Unlimited' },
                                    { name: 'Attendees', starter: '100', pro: 'Unlimited', ent: 'Unlimited' },
                                    { name: 'Analytics', starter: 'Basic', pro: 'Advanced', ent: 'Advanced' },
                                    { name: 'Email Support', starter: '✓', pro: '✓', ent: '✓' },
                                    { name: 'Chat Support', starter: '−', pro: '✓', ent: '✓' },
                                    { name: 'Phone Support', starter: '−', pro: '−', ent: '✓' },
                                    { name: 'Custom Branding', starter: '−', pro: '✓', ent: '✓' },
                                    { name: 'API Access', starter: '−', pro: '✓', ent: '✓' },
                                    { name: 'Integrations', starter: '−', pro: '✓', ent: '✓' },
                                    { name: 'White-label', starter: '−', pro: '−', ent: '✓' },
                                ].map((row, idx) => (
                                    <tr
                                        key={idx}
                                        className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900"
                                    >
                                        <td className="py-4 px-6 font-medium text-slate-900 dark:text-white">
                                            {row.name}
                                        </td>
                                        <td className="py-4 px-6 text-center text-slate-600 dark:text-slate-400">
                                            {row.starter}
                                        </td>
                                        <td className="py-4 px-6 text-center text-slate-600 dark:text-slate-400">
                                            {row.pro}
                                        </td>
                                        <td className="py-4 px-6 text-center text-slate-600 dark:text-slate-400">
                                            {row.ent}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Container>
            </section>

            {/* ===== SECTION 4: FAQ & CTA ===== */}
            <section className="py-20 md:py-32 bg-gradient-to-r from-primary via-purple-500 to-secondary text-white">
                <Container>
                    <div className="max-w-3xl mx-auto space-y-8">
                        <div className="text-center">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">
                                Still have questions?
                            </h2>
                            <p className="text-xl opacity-90">
                                Our team is here to help. Get in touch with us anytime.
                            </p>
                        </div>

                        {/* FAQ */}
                        <div className="space-y-4">
                            {[
                                {
                                    q: 'Can I change my plan anytime?',
                                    a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.',
                                },
                                {
                                    q: 'Do you offer refunds?',
                                    a: 'We offer a 7-day free trial. If you\'re not satisfied, you can cancel anytime with no questions asked.',
                                },
                                {
                                    q: 'What payment methods do you accept?',
                                    a: 'We accept all major credit and debit cards, PayPal, and bank transfers for annual plans.',
                                },
                                {
                                    q: 'Is there a free plan?',
                                    a: 'Yes! Our Starter plan is completely free and includes everything you need to get started with events.',
                                },
                            ].map((faq, idx) => (
                                <details
                                    key={idx}
                                    className="bg-white/10 backdrop-blur rounded-lg p-6 border border-white/20 cursor-pointer group"
                                >
                                    <summary className="font-bold text-lg flex items-center justify-between">
                                        {faq.q}
                                        <span className="group-open:rotate-180 transition-transform">
                                            ▼
                                        </span>
                                    </summary>
                                    <p className="mt-4 opacity-90">{faq.a}</p>
                                </details>
                            ))}
                        </div>

                        {/* Contact CTA */}
                        <div className="text-center pt-8">
                            <p className="mb-4 text-lg">
                                Need something custom? Let's talk!
                            </p>
                            <Link href="/contact">
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    className="bg-white text-primary hover:bg-slate-100"
                                >
                                    Contact Sales Team
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Container>
            </section>
        </div>
    );
}
