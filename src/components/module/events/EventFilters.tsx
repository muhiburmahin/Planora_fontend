"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon?: string;
  slug: string;
}

interface EventFiltersProps {
  categories: Category[];
}

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "UPCOMING", label: "Upcoming" },
  { value: "ONGOING", label: "Ongoing" },
  { value: "COMPLETED", label: "Completed" },
];

const TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "PUBLIC", label: "Public" },
  { value: "PRIVATE", label: "Private" },
];

const COST_OPTIONS = [
  { value: "", label: "All" },
  { value: "FREE", label: "Free" },
  { value: "PAID", label: "Paid" },
];

const SORT_OPTIONS = [
  { value: "createdAt_desc", label: "Newest First" },
  { value: "createdAt_asc", label: "Oldest First" },
  { value: "date_asc", label: "Date (Earliest)" },
  { value: "date_desc", label: "Date (Latest)" },
  { value: "registrationFee_asc", label: "Price (Low to High)" },
  { value: "registrationFee_desc", label: "Price (High to Low)" },
];

export default function EventFilters({ categories }: EventFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("searchTerm") || "");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    categoryId: searchParams.get("categoryId") || "",
    status: searchParams.get("status") || "",
    type: searchParams.get("type") || "",
    cost: searchParams.get("cost") || "",
    sort: searchParams.get("sort") || "createdAt_desc",
  });

  const updateURL = useCallback(
    (params: Record<string, string>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      Object.entries(params).forEach(([key, value]) => {
        if (value) current.set(key, value);
        else current.delete(key);
      });
      current.delete("page");
      router.push(`${pathname}?${current.toString()}`);
    },
    [searchParams, pathname, router]
  );

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      updateURL({ searchTerm });
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]); // eslint-disable-line

  const handleFilterChange = (key: string, value: string) => {
    const updated = { ...activeFilters, [key]: value };
    setActiveFilters(updated);
    const [sortBy, sortOrder] = updated.sort.split("_");
    updateURL({
      categoryId: updated.categoryId,
      status: updated.status,
      type: updated.type,
      cost: updated.cost,
      sortBy,
      sortOrder,
    });
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setActiveFilters({ categoryId: "", status: "", type: "", cost: "", sort: "createdAt_desc" });
    router.push(pathname);
  };

  const hasActiveFilters =
    searchTerm ||
    activeFilters.categoryId ||
    activeFilters.status ||
    activeFilters.type ||
    activeFilters.cost ||
    activeFilters.sort !== "createdAt_desc";

  return (
    <div className="space-y-4">
      {/* Search + Toggle */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search events by name, venue, description..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
            showFilters || hasActiveFilters
              ? "bg-primary-600 text-white border-primary-600"
              : "bg-white text-gray-700 border-gray-200 hover:border-primary-400"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="bg-white text-primary-600 text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">!</span>
          )}
        </button>

        {/* Sort */}
        <div className="relative hidden md:block">
          <select
            value={activeFilters.sort}
            onChange={(e) => handleFilterChange("sort", e.target.value)}
            className="appearance-none pl-3 pr-8 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Expandable Filters */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm animate-fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Category</label>
              <div className="relative">
                <select
                  value={activeFilters.categoryId}
                  onChange={(e) => handleFilterChange("categoryId", e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Status</label>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleFilterChange("status", opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      activeFilters.status === opt.value
                        ? "bg-primary-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Type</label>
              <div className="flex gap-2">
                {TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleFilterChange("type", opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      activeFilters.type === opt.value
                        ? "bg-primary-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cost */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Cost</label>
              <div className="flex gap-2">
                {COST_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleFilterChange("cost", opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      activeFilters.cost === opt.value
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
              >
                <X className="w-4 h-4" />
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Category Quick Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => handleFilterChange("categoryId", "")}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
            !activeFilters.categoryId
              ? "bg-primary-600 text-white border-primary-600"
              : "bg-white text-gray-600 border-gray-200 hover:border-primary-400"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleFilterChange("categoryId", activeFilters.categoryId === cat.id ? "" : cat.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              activeFilters.categoryId === cat.id
                ? "bg-primary-600 text-white border-primary-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-primary-400"
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}