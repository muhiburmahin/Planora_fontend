"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Search, Grid, List, Sparkles, SlidersHorizontal, ArrowLeft, ArrowRight } from "lucide-react";
import EventFilterSidebar from "./EventFilterSidebar";

import { eventService } from "@/services/eventService";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import EventCard from "../shared/EventCard";

const EventPage = () => {
  const [filters, setFilters] = useState<any>({});
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [meta, setMeta] = useState<any>(null);

  // পেজিনেশন স্টেট
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // প্রতি পেজে ৯টি ইভেন্ট (৩টি রো, প্রতি রো-তে ৩টি)

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      // API তে পেজ এবং লিমিট পাঠানো হচ্ছে
      const res = await eventService.client.list({
        ...filters,
        page: currentPage,
        limit: itemsPerPage
      });

      if (res.success) {
        setEvents(Array.isArray(res.data) ? res.data : res.data?.data || []);
        setMeta(res.data?.meta || null);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]); // ফিল্টার বা পেজ নম্বর পরিবর্তন হলে ডাটা ফেচ হবে

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // ফিল্টার পরিবর্তন হলে প্রথম পেজে ফেরত নিয়ে যাওয়া
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative pt-28 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-wider mb-4"
              >
                <Sparkles className="w-3 h-3" />
                <span>Discover Experiences</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-[1.1]"
              >
                Find Your Next <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500">
                  Great Event
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-lg text-gray-500 dark:text-gray-400 font-medium"
              >
                Browse through hundreds of public and private events.
              </motion.p>
            </div>

            <Button
              variant="outline"
              className="md:hidden rounded-2xl h-12 px-6 border-gray-200 dark:border-gray-800"
              onClick={() => setIsSidebarOpen(true)}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-10">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-72 flex-shrink-0">
              <div className="sticky top-24 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900">
                <EventFilterSidebar filters={filters} setFilters={handleFilterChange} />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                  <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
                  <p className="mt-4 text-gray-500 font-medium animate-pulse">Gathering amazing events...</p>
                </div>
              ) : events.length > 0 ? (
                <div className="space-y-12">
                  {/* Grid layout: Desktop-এ ৩টি করে কার্ড (৩ কলাম) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {meta && meta.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 pt-10 border-t border-gray-100 dark:border-gray-800">
                      <Button
                        variant="outline"
                        disabled={currentPage === 1}
                        onClick={() => {
                          setCurrentPage(prev => prev - 1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="rounded-xl"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Previous
                      </Button>

                      <span className="text-sm font-medium">
                        Page {currentPage} of {meta.totalPages}
                      </span>

                      <Button
                        variant="outline"
                        disabled={currentPage === meta.totalPages}
                        onClick={() => {
                          setCurrentPage(prev => prev + 1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="rounded-xl"
                      >
                        Next <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-10 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                  <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                    <Search className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">No events found</h3>
                  <Button
                    onClick={() => handleFilterChange({})}
                    variant="link"
                    className="mt-4 text-primary-600 font-bold"
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-[350px] bg-white dark:bg-gray-950 z-[101] md:hidden shadow-2xl"
            >
              <EventFilterSidebar
                filters={filters}
                setFilters={handleFilterChange}
                isMobile
                onClose={() => setIsSidebarOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventPage;