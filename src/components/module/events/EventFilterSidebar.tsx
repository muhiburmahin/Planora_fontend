"use client";

import React, { useEffect, useState } from "react";
import { Search, X, Filter, ChevronDown, Check, CircleDot, Monitor, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { categoryService } from "@/services/categoryService";

interface FilterSidebarProps {
  filters: any;
  setFilters: (filters: any) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

const EventFilterSidebar: React.FC<FilterSidebarProps> = ({ filters, setFilters, onClose, isMobile }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [tempSearch, setTempSearch] = useState(filters.searchTerm || "");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    Categories: true,
    "Access Type": true,
    "Fee Type": true,
    "Event Status": true,
    Modality: true,
    "Price Range": true,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await categoryService.getAllCategories();
      if (res.success) {
        setCategories(Array.isArray(res.data) ? res.data : res.data?.data || []);
      }
    };
    fetchCategories();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempSearch(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, searchTerm: tempSearch });
  };

  const toggleCategory = (id: string) => {
    const newCategoryId = filters.categoryId === id ? undefined : id;
    setFilters({ ...filters, categoryId: newCategoryId });
  };

  const setFilterKey = (key: string, value: any) => {
    const newValue = filters[key] === value ? undefined : value;
    setFilters({ ...filters, [key]: newValue });
  };

  const clearFilters = () => {
    setFilters({});
    setTempSearch("");
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
    const isOpen = expandedSections[title];
    return (
      <div className="mb-6 bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
        <button
          onClick={() => toggleSection(title)}
          className="w-full flex items-center justify-between text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider focus:outline-none"
        >
          <span>{title}</span>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </motion.div>
        </button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: "auto", opacity: 1, marginTop: 16 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-2 pb-1">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className={`flex flex-col h-full bg-slate-50 dark:bg-gray-950 ${!isMobile ? "border-r border-gray-100 dark:border-gray-800" : ""}`}>
      {/* Header */}
      <div className="p-6 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-xl">
            <Filter className="w-5 h-5 text-primary-600" />
          </div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Filters</h2>
        </div>
        {isMobile && (
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide space-y-6">
        {/* Search */}
        <form onSubmit={handleSearchSubmit}>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="text"
              placeholder="Search events..."
              value={tempSearch}
              onChange={handleSearchChange}
              className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all text-sm font-medium shadow-sm placeholder:font-normal"
            />
          </div>
        </form>

        {/* Categories */}
        {categories.length > 0 && (
          <FilterSection title="Categories">
            <div className="flex flex-col gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all border ${filters.categoryId === cat.id
                      ? "bg-primary-50 border-primary-200 text-primary-700 font-bold dark:bg-primary-900/30 dark:border-primary-800 dark:text-primary-400"
                      : "border-transparent text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                    }`}
                >
                  <span>{cat.name}</span>
                  {filters.categoryId === cat.id && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <Check className="w-4 h-4" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Event Status */}
        <FilterSection title="Event Status">
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "UPCOMING", label: "Upcoming", activeClass: "bg-blue-50 border-blue-200 text-blue-700 shadow-sm dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400" },
              { id: "ONGOING", label: "Ongoing", activeClass: "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400" },
            ].map((status) => {
              const isSelected = filters.status === status.id;
              return (
                <button
                  key={status.id}
                  onClick={() => setFilterKey("status", status.id)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${isSelected
                      ? status.activeClass
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-400"
                    }`}
                >
                  {isSelected && <CircleDot className="w-3 h-3" />}
                  {status.label}
                </button>
              );
            })}
          </div>
        </FilterSection>

        {/* Event Type (Access) */}
        <FilterSection title="Access Type">
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "PUBLIC", label: "Public", activeClass: "bg-sky-50 border-sky-200 text-sky-700 shadow-sm dark:bg-sky-900/20 dark:border-sky-800 dark:text-sky-400" },
              { id: "PRIVATE", label: "Private", activeClass: "bg-orange-50 border-orange-200 text-orange-700 shadow-sm dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400" },
            ].map((type) => {
              const isSelected = filters.type === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => setFilterKey("type", type.id)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${isSelected
                      ? type.activeClass
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-400"
                    }`}
                >
                  {type.label}
                </button>
              );
            })}
          </div>
        </FilterSection>

        {/* Modality */}
        <FilterSection title="Modality">
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "true", label: "Online", icon: Monitor, activeClass: "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-400" },
              { id: "false", label: "In-Person", icon: MapPin, activeClass: "bg-rose-50 border-rose-200 text-rose-700 shadow-sm dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400" },
            ].map((mode) => {
              const isSelected = String(filters.isOnline) === mode.id;
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  onClick={() => setFilterKey("isOnline", mode.id)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border flex flex-col items-center gap-1.5 ${isSelected
                      ? mode.activeClass
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-400"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {mode.label}
                </button>
              );
            })}
          </div>
        </FilterSection>

        {/* Cost Type */}
        <FilterSection title="Fee Type">
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "FREE", label: "Free", activeClass: "bg-green-50 border-green-200 text-green-700 shadow-sm dark:bg-green-900/20 dark:border-green-800 dark:text-green-400" },
              { id: "PAID", label: "Paid", activeClass: "bg-purple-50 border-purple-200 text-purple-700 shadow-sm dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-400" },
            ].map((cost) => {
              const isSelected = filters.cost === cost.id;
              return (
                <button
                  key={cost.id}
                  onClick={() => setFilterKey("cost", cost.id)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${isSelected
                      ? cost.activeClass
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-400"
                    }`}
                >
                  {cost.label}
                </button>
              );
            })}
          </div>
        </FilterSection>

        {/* Price Range */}
        <AnimatePresence>
          {filters.cost === "PAID" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <FilterSection title="Price Range">
                <div className="px-3 pb-2 pt-4">
                  <Slider
                    defaultValue={[0, 1000]}
                    max={5000}
                    step={50}
                    value={[filters.minPrice || 0, filters.maxPrice || 5000]}
                    onValueChange={([min, max]) => setFilters({ ...filters, minPrice: min, maxPrice: max })}
                    className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:border-primary-500 [&_[role=slider]]:bg-white [&_.bg-primary]:bg-primary-500"
                  />
                  <div className="flex items-center justify-between mt-5">
                    <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300">
                      ৳{filters.minPrice || 0}
                    </div>
                    <div className="w-4 h-[1px] bg-gray-300 dark:bg-gray-700"></div>
                    <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300">
                      ৳{filters.maxPrice || 5000}
                    </div>
                  </div>
                </div>
              </FilterSection>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 sticky bottom-0 z-10">
        <Button
          onClick={clearFilters}
          className="w-full h-12 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold shadow-lg shadow-gray-200 dark:shadow-none dark:bg-gray-800 dark:hover:bg-gray-700 transition-all active:scale-[0.98]"
        >
          Reset All Filters
        </Button>
      </div>
    </div>
  );
};

export default EventFilterSidebar;

