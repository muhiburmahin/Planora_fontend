"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { LayoutGrid, LayoutList, Loader2, Frown, Sparkles } from "lucide-react";
import EventCard from "./EventCard";
import EventFilters from "./EventFilters";
import eventService from "@/services/eventService";
import categoryService from "@/services/categoryService";

interface Event {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  date: string;
  time: string;
  venue: string;
  isOnline: boolean;
  type: "PUBLIC" | "PRIVATE";
  registrationFee: number;
  status: string;
  isFeatured: boolean;
  averageRating: number;
  totalReviews: number;
  images: { url: string }[];
  category: { name: string; icon?: string };
  organizer: { name: string; image?: string };
  _count?: { participations: number };
}

interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

interface Category {
  id: string;
  name: string;
  icon?: string;
  slug: string;
}

export default function EventsPage() {
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const query: Record<string, string | number> = {
        page: currentPage,
        limit: 12,
      };
      searchParams.forEach((value, key) => {
        query[key] = value;
      });

      const response = await eventService.client.list(query);
      if (!response.error && response.data) {
        setEvents(response.data?.data ?? []);
        setMeta(response.data?.meta ?? null);
      }
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  }, [searchParams, currentPage]);

  const fetchFeatured = useCallback(async () => {
    try {
      const response = await eventService.client.list({ isFeatured: true, limit: 4, status: "UPCOMING" });
      if (!response.error && response.data) {
        setFeaturedEvents(response.data?.data ?? []);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoryService.getAllCategories({ isActive: true }, { limit: 50 });
      if (response?.success) {
        setCategories(response.data?.data ?? response.data ?? []);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    fetchFeatured();
    fetchCategories();
  }, [fetchFeatured, fetchCategories]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchParams]);

  const hasFilters =
    searchParams.get("searchTerm") ||
    searchParams.get("categoryId") ||
    searchParams.get("status") ||
    searchParams.get("type") ||
    searchParams.get("cost");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      {!hasFilters && (
        <div className="bg-gradient-primary text-white py-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-sm font-semibold text-yellow-200 uppercase tracking-widest">Discover Events</span>
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              Find Your Next<br />
              <span className="text-yellow-300">Unforgettable</span> Experience
            </h1>
            <p className="text-lg text-white/80 max-w-xl mx-auto">
              Browse thousands of events — concerts, workshops, conferences, meetups, and more.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Featured Events */}
        {!hasFilters && featuredEvents.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-amber-500 text-lg">⭐</span>
              <h2 className="text-xl font-bold text-gray-900">Featured Events</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            <div className="border-b border-gray-200 mt-8" />
          </div>
        )}

        {/* Filters */}
        <div className="mb-6">
          <EventFilters categories={categories} />
        </div>

        {/* Header Row */}
        <div className="flex items-center justify-between mb-5">
          <div>
            {loading ? (
              <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
            ) : (
              <p className="text-sm text-gray-600">
                <span className="font-bold text-gray-900">{meta?.total ?? 0}</span> events found
                {hasFilters && <span className="text-primary-600"> · Filtered</span>}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-primary-100 text-primary-600" : "text-gray-400 hover:bg-gray-100"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-primary-100 text-primary-600" : "text-gray-400 hover:bg-gray-100"}`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Events Grid/List */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                <div className="h-52 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="py-24 text-center">
            <Frown className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No events found</h3>
            <p className="text-gray-400 text-sm max-w-sm mx-auto">
              Try adjusting your search filters or check back later for new events.
            </p>
          </div>
        ) : (
          <>
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "flex flex-col gap-4"
              }
            >
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  variant={viewMode === "list" ? "compact" : "default"}
                />
              ))}
            </div>

            {/* Pagination */}
            {meta && meta.totalPage > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ← Prev
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(meta.totalPage, 7) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? "bg-primary-600 text-white"
                            : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  {meta.totalPage > 7 && (
                    <>
                      <span className="flex items-center px-1 text-gray-400">...</span>
                      <button
                        onClick={() => setCurrentPage(meta.totalPage)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors`}
                      >
                        {meta.totalPage}
                      </button>
                    </>
                  )}
                </div>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(meta.totalPage, p + 1))}
                  disabled={currentPage === meta.totalPage}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}