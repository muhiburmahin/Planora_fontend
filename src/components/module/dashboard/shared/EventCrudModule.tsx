"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  SquarePen,
  Plus,
  Trash2,
  Calendar,
  MapPin,
  LayoutGrid,
  Globe,
  Lock,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { EventStatus, EventType } from "@/types/enums";
import { categoryService } from "@/services/categoryService";
import { eventService } from "@/services/eventService";
import { createEventAction, deleteEventAction, updateEventAction } from "@/actions/event.actions";
import { EventCreateInput, eventCreateSchema, EventUpdateInput, eventUpdateSchema } from "@/lib/validations/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "./TableSkeleton";

type EventItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  type: EventType;
  status: EventStatus;
  isPublished: boolean;
  registrationFee: number;
  category?: { id: string; name: string } | null;
  organizer?: { id: string; name?: string | null } | null;
};

type CategoryItem = {
  id: string;
  name: string;
};

interface EventCrudModuleProps {
  title: string;
  query?: Record<string, unknown>;
}

const createDefaults: EventCreateInput = {
  title: "",
  description: "",
  date: "",
  time: "",
  venue: "",
  categoryId: "",
  registrationFee: 0,
  maxParticipants: undefined,
  isOnline: false,
  type: EventType.PUBLIC,
};

const updateDefaults: EventUpdateInput = {
  title: "",
  description: "",
  date: "",
  registrationFee: 0,
  status: EventStatus.UPCOMING,
  isPublished: true,
};

export function EventCrudModule({ title, query }: EventCrudModuleProps) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  const createForm = useForm<EventCreateInput>({
    resolver: zodResolver(eventCreateSchema),
    defaultValues: createDefaults,
  });

  const editForm = useForm<EventUpdateInput>({
    resolver: zodResolver(eventUpdateSchema),
    defaultValues: updateDefaults,
  });

  const loadCategories = async () => {
    const response = await categoryService.getAllCategories({ isActive: true }, { page: 1, limit: 200 });
    if (response?.success) {
      const payload = response.data as any;
      const rawData = payload?.data ?? payload ?? [];
      // Ensure uniqueness by ID to prevent duplicate keys in UI
      const uniqueData = Array.from(new Map(rawData.map((c: any) => [c.id, c])).values());
      setCategories(uniqueData as any[]);
    }
  };

  const loadEvents = async () => {
    setLoading(true);
    const response = await eventService.client.list({
      limit,
      page,
      searchTerm,
      isPublished: 'all', // Admins should see all
      sortBy: "createdAt",
      sortOrder: "desc",
      ...(query || {})
    });

    if (response.success) {
      const payload = response.data as any;
      setEvents((payload.data ?? []) as EventItem[]);
      setTotalPages(payload.meta?.totalPage || 1);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadEvents();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, page]);

  const onCreateSubmit = createForm.handleSubmit(async (values) => {
    setSubmitting(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, String(value));
    });

    const result = await createEventAction(null, formData);
    setSubmitting(false);
    if (!result?.success) {
      toast.error(result?.message || "Failed to create event");
      return;
    }
    toast.success("Event launched successfully!");
    createForm.reset(createDefaults);
    setCreateOpen(false);
    loadEvents();
  });

  const openEdit = (event: EventItem) => {
    setEditing(event);
    editForm.reset({
      title: event.title,
      description: event.description,
      date: event.date ? new Date(event.date).toISOString().slice(0, 10) : "",
      registrationFee: event.registrationFee ?? 0,
      status: event.status,
      isPublished: event.isPublished,
    });
    setEditOpen(true);
  };

  const onEditSubmit = editForm.handleSubmit(async (values) => {
    if (!editing) return;
    setSubmitting(true);
    const formData = new FormData();
    formData.append("id", editing.id);
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, String(value));
    });

    const result = await updateEventAction(null, formData);
    setSubmitting(false);
    if (!result?.success) {
      toast.error(result?.message || "Failed to update");
      return;
    }
    toast.success("Event refined successfully");
    setEditOpen(false);
    setEditing(null);
    loadEvents();
  });

  const onDelete = async (id: string) => {
    if (!confirm("Are you sure? This action cannot be undone if active participants exist.")) return;
    const result = await deleteEventAction(id);
    if (result?.success) {
      toast.success("Event removed from active list");
      loadEvents();
    } else {
      toast.error(result?.message || "Failed to delete");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{title}</h1>
          <p className="text-sm font-medium text-slate-500">Intelligent ecosystem for event orchestration.</p>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-6 font-black text-white shadow-xl shadow-primary-500/20 transition-all hover:scale-105 hover:shadow-primary-500/40 active:scale-95">
              <Plus className="mr-2 h-5 w-5" />
              Launch New Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[95svh] overflow-y-auto border-0 bg-white p-0 shadow-2xl sm:max-w-2xl dark:bg-slate-900">
            <div className="bg-gradient-to-r from-primary-900 to-primary-700 px-8 py-8 text-white">
              <DialogTitle className="text-3xl font-black tracking-tight">Create New Event</DialogTitle>
              <DialogDescription className="text-primary-100/80 font-medium">Configure the core parameters of your upcoming experience.</DialogDescription>
            </div>
            <form onSubmit={onCreateSubmit} className="grid gap-6 p-8 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Event Title</Label>
                <Input {...createForm.register("title")} className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white dark:bg-slate-800" placeholder="e.g. Annual Tech Summit" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Description</Label>
                <Textarea rows={4} {...createForm.register("description")} className="rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white dark:bg-slate-800" placeholder="What is this event about?..." />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input type="date" {...createForm.register("date")} className="h-11 pl-10 rounded-xl border-slate-200" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Time</Label>
                <Input type="time" {...createForm.register("time")} className="h-11 rounded-xl border-slate-200" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Venue / Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input {...createForm.register("venue")} className="h-11 pl-10 rounded-xl border-slate-200" placeholder="Physical Address or Virtual Link" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Category</Label>
                <Select value={createForm.watch("categoryId")} onValueChange={(v) => createForm.setValue("categoryId", v)}>
                  <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 bg-white">
                    <SelectValue placeholder="Select classification" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-0 shadow-2xl">
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id} className="rounded-lg py-3 font-bold">{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Access Type</Label>
                <Select value={createForm.watch("type")} onValueChange={(v) => createForm.setValue("type", v as EventType)}>
                  <SelectTrigger className="h-11 w-full rounded-xl border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-0 shadow-2xl">
                    <SelectItem value={EventType.PUBLIC} className="rounded-lg py-3 font-bold">Public (Open Admission)</SelectItem>
                    <SelectItem value={EventType.PRIVATE} className="rounded-lg py-3 font-bold">Private (Restricted Access)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Admission Fee (৳)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">৳</span>
                  <Input type="number" {...createForm.register("registrationFee")} className="h-11 pl-8 rounded-xl border-slate-200" />
                </div>
              </div>
              <div className="md:col-span-2 pt-4">
                <Button type="submit" disabled={submitting} className="h-14 w-full rounded-2xl bg-gradient-to-r from-primary-600 to-primary-800 text-lg font-black text-white shadow-xl shadow-primary-500/20">
                  {submitting ? <Loader2 className="h-6 w-6 animate-spin" /> : "Deploy Experience"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 bg-white/60 shadow-sm backdrop-blur-md dark:bg-slate-900/40">
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search events by title or venue..."
              className="h-11 pl-10 rounded-xl border-slate-200 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-11 gap-2 rounded-xl border-slate-200 px-6 font-bold">
            <Filter className="h-4 w-4" />
            Refine Search
          </Button>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card className="overflow-hidden border-0 bg-white shadow-2xl shadow-slate-200/50 dark:bg-slate-900 dark:shadow-none">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
              <TableRow>
                <TableHead className="px-8 py-5 font-black uppercase tracking-widest text-slate-400">Identity</TableHead>
                <TableHead className="px-8 py-5 font-black uppercase tracking-widest text-slate-400">Logistics</TableHead>
                <TableHead className="px-8 py-5 font-black uppercase tracking-widest text-slate-400">Lifecycle</TableHead>
                <TableHead className="px-8 py-5 font-black uppercase tracking-widest text-slate-400">Financials</TableHead>
                <TableHead className="px-8 py-5 text-right font-black uppercase tracking-widest text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-20">
                      <TableSkeleton columns={5} rows={5} />
                    </TableCell>
                  </TableRow>
                ) : events.map((event, index) => (
                  <motion.tr
                    key={event.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                  >
                    <TableCell className="px-8 py-5">
                      <div className="flex items-start gap-4">
                        <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-100/50 text-primary-700 shadow-inner group-hover:scale-110 transition-transform">
                          <Calendar className="h-6 w-6" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-base font-black text-slate-900 dark:text-white">{event.title}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <Badge variant="outline" className="rounded-md border-primary-100 bg-primary-50/30 text-[10px] font-black text-primary-700">
                              {event.category?.name || "Global"}
                            </Badge>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {event.id.slice(0, 8)}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-5">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                          <MapPin className="h-3.5 w-3.5 text-secondary-500" />
                          <span className="truncate max-w-[150px]">{event.venue}</span>
                        </div>
                        <p className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                          {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          <span className="h-1 w-1 rounded-full bg-slate-200"></span>
                          {event.time}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-5">
                      <div className="space-y-2">
                        <Badge className={`rounded-lg border-0 px-3 py-1 text-[10px] font-black uppercase tracking-widest ${event.isPublished ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200" : "bg-slate-50 text-slate-400 ring-1 ring-slate-200"
                          }`}>
                          {event.isPublished ? "Live Feed" : "Internal Draft"}
                        </Badge>
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase">
                          {event.type === EventType.PUBLIC ? <Globe className="h-3.5 w-3.5 text-blue-500" /> : <Lock className="h-3.5 w-3.5 text-amber-500" />}
                          {event.type}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-5">
                      <div className="text-lg font-black text-slate-900 dark:text-white">
                        <span className="mr-0.5 text-xs text-slate-400 font-bold">৳</span>
                        {event.registrationFee.toLocaleString()}
                      </div>
                      <p className={`text-[10px] font-black uppercase tracking-widest ${event.status === EventStatus.COMPLETED ? "text-blue-500" :
                          event.status === EventStatus.CANCELLED ? "text-red-500" :
                            "text-primary-500"
                        }`}>
                        {event.status}
                      </p>
                    </TableCell>
                    <TableCell className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 rounded-xl border-slate-100 hover:bg-primary-50 hover:text-primary-600 transition-all hover:scale-110 active:scale-95"
                          onClick={() => openEdit(event)}
                        >
                          <SquarePen className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 rounded-xl border-slate-100 hover:bg-red-50 hover:text-red-600 transition-all hover:scale-110 active:scale-95"
                          onClick={() => onDelete(event.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {!loading && events.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-96 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="rounded-full bg-slate-50 p-6">
                        <AlertCircle className="h-12 w-12 text-slate-300" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-black text-slate-600 tracking-tight">No Events Detected</p>
                        <p className="text-sm font-medium text-slate-400">Adjust your filters or initiate a new launch.</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between border-t border-slate-50 bg-slate-50/30 px-8 py-6 dark:bg-slate-900/50">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">
            Page <span className="text-slate-900 dark:text-white">{page}</span> of {totalPages}
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="h-10 rounded-xl border-slate-100 font-bold px-4 disabled:opacity-30"
              disabled={page <= 1 || loading}
              onClick={() => setPage(p => p - 1)}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-10 rounded-xl border-slate-100 font-bold px-4 disabled:opacity-30"
              disabled={page >= totalPages || loading}
              onClick={() => setPage(p => p + 1)}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[95svh] overflow-y-auto border-0 bg-white p-0 shadow-2xl sm:max-w-2xl dark:bg-slate-900">
          <div className="bg-gradient-to-r from-secondary-900 to-secondary-700 px-8 py-8 text-white">
            <DialogTitle className="text-3xl font-black tracking-tight">Refine Experience</DialogTitle>
            <DialogDescription className="text-secondary-100/80 font-medium">Calibrate the status and metadata of your active event.</DialogDescription>
          </div>
          <form onSubmit={onEditSubmit} className="grid gap-6 p-8 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Title</Label>
              <Input {...editForm.register("title")} className="h-12 rounded-xl border-slate-200" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Description</Label>
              <Textarea rows={4} {...editForm.register("description")} className="rounded-xl border-slate-200" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Operational Status</Label>
              <Select value={editForm.watch("status")} onValueChange={(v) => editForm.setValue("status", v as EventStatus)}>
                <SelectTrigger className="h-11 w-full rounded-xl border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-0 shadow-2xl">
                  <SelectItem value={EventStatus.UPCOMING} className="rounded-lg py-2 font-bold">Upcoming</SelectItem>
                  <SelectItem value={EventStatus.ONGOING} className="rounded-lg py-2 font-bold">Ongoing</SelectItem>
                  <SelectItem value={EventStatus.COMPLETED} className="rounded-lg py-2 font-bold">Completed</SelectItem>
                  <SelectItem value={EventStatus.CANCELLED} className="rounded-lg py-2 font-bold">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Lifecycle State</Label>
              <Select
                value={editForm.watch("isPublished") ? "PUBLISHED" : "DRAFT"}
                onValueChange={(v) => editForm.setValue("isPublished", v === "PUBLISHED")}
              >
                <SelectTrigger className="h-11 w-full rounded-xl border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-0 shadow-2xl">
                  <SelectItem value="PUBLISHED" className="rounded-lg py-2 font-bold text-emerald-600">Published / Live</SelectItem>
                  <SelectItem value="DRAFT" className="rounded-lg py-2 font-bold text-slate-400">Internal Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Revised Fee (৳)</Label>
              <Input type="number" {...editForm.register("registrationFee")} className="h-11 rounded-xl border-slate-200" />
            </div>
            <div className="md:col-span-2 pt-4">
              <Button type="submit" disabled={submitting} className="h-14 w-full rounded-2xl bg-gradient-to-r from-secondary-600 to-secondary-800 text-lg font-black text-white">
                {submitting ? <Loader2 className="h-6 w-6 animate-spin" /> : "Commit Modifications"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
