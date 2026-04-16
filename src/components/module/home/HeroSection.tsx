'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Play, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";

// Constants for easy maintenance
const STATS = [
    { label: 'Active Creators', value: '10k+' },
    { label: 'Events Hosted', value: '50k+' },
    { label: 'Success Rate', value: '99.9%' },
];

export const HeroSection = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-12 lg:pt-36 lg:pb-24 bg-white dark:bg-slate-950 transition-colors duration-500">

            {/* --- Advanced Ambient Background --- */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                {/* Dynamic Glow Blobs */}
                <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-primary-500/10 dark:bg-primary-600/15 rounded-full blur-[130px] animate-pulse-slow" />
                <div className="absolute bottom-[5%] right-[-5%] w-[40%] h-[40%] bg-secondary-500/10 dark:bg-secondary-600/10 rounded-full blur-[110px]" />

                {/* Grid Pattern Overlay for Tech Feel */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 dark:opacity-10" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center text-center lg:text-left">

                    {/* --- Content Column --- */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="flex flex-col items-center lg:items-start space-y-8 md:space-y-10"
                    >
                        {/* Status Badge */}
                        <motion.div
                            whileHover={{ y: -2 }}
                            className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all cursor-default"
                        >
                            <Sparkles size={14} className="text-primary-500 group-hover:rotate-12 transition-transform" />
                            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                                Premium Event Management Experience
                            </span>
                        </motion.div>

                        <div className="space-y-5 md:space-y-7">
                            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[92px] font-black text-slate-900 dark:text-white leading-[0.95] tracking-tight">
                                Design Your <br className="hidden sm:block" />
                                <span className="bg-gradient-primary bg-clip-text text-transparent italic">
                                    Grand Events
                                </span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                                Elevate your planning with Planora. Seamlessly coordinate, manage tickets,
                                and analyze performance with our industry-leading dashboard.
                            </p>
                        </div>

                        {/* Interactive CTAs */}
                        <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto bg-gradient-primary hover:brightness-110 text-white px-12 h-16 rounded-2xl shadow-2xl shadow-primary-500/25 group text-lg font-bold transition-all" asChild>
                                <Link href="/register">
                                    Get Started Free
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                                </Link>
                            </Button>

                            <Button variant="ghost" size="lg" className="w-full sm:w-auto h-16 px-10 rounded-2xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all font-bold group border border-slate-200 dark:border-slate-800">
                                <Play size={20} className="mr-3 fill-primary-500 text-primary-500 group-hover:scale-110 transition-transform" />
                                Watch Demo
                            </Button>
                        </div>

                        {/* Social Proof & Metrics */}
                        <div className="grid grid-cols-3 gap-8 pt-10 border-t border-slate-100 dark:border-slate-900 w-full lg:max-w-md">
                            {STATS.map((stat, idx) => (
                                <div key={idx} className="flex flex-col items-center lg:items-start">
                                    <span className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</span>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* --- Visual Column --- */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative hidden lg:block"
                    >
                        {/* Decorative Background Glow */}
                        <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-[100px] animate-pulse" />

                        {/* Main Glass Mockup */}
                        <div className="relative z-10 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl rounded-[3rem] p-6 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] dark:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] border border-white/20 dark:border-slate-800 transform hover:scale-[1.01] transition-transform duration-500">

                            {/* Browser Bar */}
                            <div className="flex items-center justify-between mb-10 px-4">
                                <div className="flex gap-2.5">
                                    <div className="w-3.5 h-3.5 rounded-full bg-red-400 shadow-inner" />
                                    <div className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-inner" />
                                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-inner" />
                                </div>
                                <div className="h-2 w-32 bg-slate-200 dark:bg-slate-800 rounded-full" />
                            </div>

                            {/* Dashboard Shell */}
                            <div className="grid grid-cols-2 gap-6 p-2">
                                <div className="space-y-6">
                                    <div className="h-40 bg-gradient-to-br from-primary-50 to-primary-100/50 dark:from-primary-900/20 dark:to-primary-900/5 rounded-[2rem] border border-primary-100 dark:border-primary-800/50 flex items-center justify-center">
                                        <TrendingUp size={48} className="text-primary-500 drop-shadow-lg" />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-full" />
                                        <div className="h-4 w-1/2 bg-slate-100 dark:bg-slate-900 rounded-full" />
                                    </div>
                                </div>
                                <div className="space-y-6 pt-10">
                                    <div className="h-48 bg-slate-50 dark:bg-slate-800/40 rounded-[2rem] border border-slate-100 dark:border-slate-800/50" />
                                    <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-full" />
                                </div>
                            </div>
                        </div>

                        {/* Floating Interaction Card */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                            className="absolute -top-12 -right-12 z-20 bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-700"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center">
                                    <CheckCircle2 size={28} className="text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Efficiency</p>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white">+98.2%</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default HeroSection;