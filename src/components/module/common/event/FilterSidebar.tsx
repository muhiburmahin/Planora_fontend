'use client';

import React, { useEffect, useState } from 'react';
import { ChevronDown, X, Filter, RotateCcw, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { EventFilters } from '@/types/eventDitels';
import { DATE_FILTER_OPTIONS, PRICE_FILTER_OPTIONS } from '@/constants/event';

interface FilterSidebarProps {
    filters: Partial<EventFilters>;
    categories?: Array<{ id: string; name: string }>;
    onFilterChange: (key: keyof EventFilters, value: any) => void;
    onClearAll: () => void;
    onClose?: () => void;
    isOpen?: boolean;
    isLoading?: boolean;
}

export function FilterSidebar({
    filters,
    categories = [],
    onFilterChange,
    onClearAll,
    onClose,
    isOpen = true,
    isLoading = false
}: FilterSidebarProps) {
    const [isMobile, setIsMobile] = useState(false);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        category: true, date: true, price: true,
    });

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const filterContent = (
        <div className="space-y-8 pb-28 md:pb-0">
            {/* Header Section */}
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
                    <Filter size={18} className="animate-pulse" />
                    <span className="font-black uppercase tracking-widest text-[11px]">Refine Search</span>
                </div>
                <button
                    onClick={onClearAll}
                    className="group text-[10px] font-bold text-gray-400 hover:text-secondary-500 flex items-center gap-1 transition-all"
                >
                    <RotateCcw size={12} className="group-hover:rotate-[-180deg] transition-transform duration-500" />
                    RESET
                </button>
            </div>

            {/* Category Section */}
            <div className="bg-gray-50 dark:bg-primary-900/10 p-5 rounded-[2rem] border border-gray-100 dark:border-primary-900/20">
                <button onClick={() => toggleSection('category')} className="w-full flex items-center justify-between group">
                    <h3 className="font-black text-gray-800 dark:text-primary-100 uppercase text-[11px] tracking-widest">Category</h3>
                    <ChevronDown size={16} className={`text-primary-600 transition-transform duration-300 ${expandedSections.category ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                    {expandedSections.category && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-5 grid grid-cols-1 gap-2">
                                {isLoading ? (
                                    [1, 2, 3].map(i => <div key={i} className="h-10 w-full bg-primary-50 dark:bg-primary-900/20 animate-pulse rounded-xl" />)
                                ) : (
                                    categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => onFilterChange('categoryId', filters.categoryId === cat.id ? '' : cat.id)}
                                            className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-sm font-bold ${filters.categoryId === cat.id
                                                ? 'bg-primary-600 border-primary-600 text-white shadow-lg'
                                                : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-600'
                                                }`}
                                        >
                                            {cat.name}
                                            {filters.categoryId === cat.id && <Check size={14} />}
                                        </button>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* When Section */}
            <div className="px-1">
                <h3 className="font-black text-[11px] tracking-widest text-gray-400 uppercase mb-4">When</h3>
                <div className="grid grid-cols-2 gap-2">
                    {DATE_FILTER_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => onFilterChange('dateRange', option.value)}
                            className={`px-3 py-3 rounded-2xl text-[10px] font-black transition-all ${filters.dateRange === option.value
                                ? 'bg-primary-600 text-white shadow-lg'
                                : 'bg-white dark:bg-gray-800 text-gray-500 border border-gray-100'
                                }`}
                        >
                            {option.label.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800">
                <button onClick={() => toggleSection('price')} className="w-full flex items-center justify-between">
                    <h3 className="font-black text-gray-800 dark:text-gray-200 uppercase text-[11px] tracking-widest">Price</h3>
                    <ChevronDown size={16} className={`transition-transform ${expandedSections.price ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                    {expandedSections.price && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="overflow-hidden">
                            <div className="pt-5 space-y-2">
                                {PRICE_FILTER_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => onFilterChange('priceRange', option.value)}
                                        className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold border transition-all ${filters.priceRange === option.value
                                            ? 'bg-secondary-500 border-secondary-500 text-white'
                                            : 'bg-white dark:bg-gray-800 border-gray-100 text-gray-500'
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );

    if (isMobile) {
        return (
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="fixed inset-0 bg-primary-950/40 backdrop-blur-sm z-[100]"
                        />
                        {/* Drawer Content */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 bottom-0 w-[85%] bg-white dark:bg-gray-950 z-[101] p-6 overflow-y-auto rounded-r-[2.5rem] shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-black tracking-tighter text-primary-600">FILTERS</h2>
                                {/* Close Button */}
                                <button
                                    onClick={onClose}
                                    className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full active:scale-90 transition-transform"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {filterContent}

                            {/* Mobile Sticky Apply Button */}
                            <div className="fixed bottom-6 left-6 right-[15%] z-[102]">
                                <button
                                    onClick={onClose}
                                    className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black shadow-xl shadow-primary-500/30 active:scale-95 transition-all"
                                >
                                    APPLY FILTERS
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        );
    }

    return (
        <aside className="hidden md:block w-72 bg-white dark:bg-gray-900/50 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide">
            {filterContent}
        </aside>
    );
}