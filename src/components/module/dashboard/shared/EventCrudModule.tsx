"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
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
  AlertCircle,
  Users,
  X,
  UploadCloud,
  Image as ImageIcon,
  UserPlus
} from "lucide-react";
import InviteUserModal from "../../events/InviteUserModal";
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
  shortDescription?: string | null;
  description: string;
  date: string;
  time: string;
  venue: string;
  type: EventType;
  status: EventStatus;
  isPublished: boolean;
  isOnline: boolean;
  isFeatured: boolean;
  registrationFee: number;
  maxParticipants?: number | null;
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
  shortDescription: "",
  description: "",
  date: "",
  time: "",
  venue: "",
  categoryId: "",
  registrationFee: 0,
  maxParticipants: undefined,
  isOnline: false,
  isFeatured: false,
  type: EventType.PUBLIC,
};

const updateDefaults: EventUpdateInput = {
  title: "",
  shortDescription: "",
  description: "",
  date: "",
  registrationFee: 0,
  status: EventStatus.UPCOMING,
  isPublished: true,
  time: "",
  venue: "",
  categoryId: "",
  type: EventType.PUBLIC,
  isOnline: false,
  isFeatured: false,
  maxParticipants: undefined,
};

export function EventCrudModule({ title, query: filterQuery }: EventCrudModuleProps) {
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invitingEvent, setInvitingEvent] = useState<{ id: string, title: string } | null>(null);
  const [page, setPage] = useState(1);
  const limit = 8;

  const { data: categoriesResponse } = useQuery({
    queryKey: ["event-categories"],
    queryFn: () => categoryService.getAllCategories({ isActive: true }, { page: 1, limit: 200 }),
  });

  const categories = useMemo(() => {
    const rawData = (categoriesResponse?.data as any)?.data ?? categoriesResponse?.data ?? [];
    return Array.from(new Map(rawData.map((c: any) => [c.id, c])).values()) as CategoryItem[];
  }, [categoriesResponse]);

  const { data: eventsResponse, isLoading: loading } = useQuery({
    queryKey: ["events-crud", filterQuery, searchTerm, page],
    queryFn: () => eventService.client.list({
      limit,
      page,
      ...(searchTerm ? { searchTerm } : {}),
      sortBy: "createdAt",
      sortOrder: "desc",
      ...(filterQuery || {})
    }),
    refetchInterval: 60000, // Refresh every minute
  });

  const events = useMemo(() => {
    const payload = eventsResponse?.data as any;
    return (Array.isArray(payload) ? payload : (payload?.data ?? [])) as EventItem[];
  }, [eventsResponse]);

  const totalPages = useMemo(() => {
    const payload = eventsResponse?.data as any;
    const meta = payload?.meta ?? null;
    return meta?.totalPage ?? meta?.totalPages ?? 1;
  }, [eventsResponse]);

  const createForm = useForm<EventCreateInput>({
    resolver: zodResolver(eventCreateSchema),
    defaultValues: createDefaults,
  });

  const editForm = useForm<EventUpdateInput>({
    resolver: zodResolver(eventUpdateSchema),
    defaultValues: updateDefaults,
  });

  // Handlers moved to useQuery

  const onCreateSubmit = createForm.handleSubmit(async (values) => {
    setSubmitting(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'images') {
        // Skip images from values, we use selectedFiles
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    // Explicitly append images from selectedFiles
    selectedFiles.forEach(file => formData.append('images', file));

    const result = await createEventAction(null, formData);
    setSubmitting(false);
    if (!result?.success) {
      toast.error(result?.message || "Failed to create event");
      return;
    }
    toast.success("Event launched successfully!");
    createForm.reset(createDefaults);
    setImagePreviews([]);
    setSelectedFiles([]);
    setCreateOpen(false);
    queryClient.invalidateQueries({ queryKey: ["events-crud"] });
    queryClient.invalidateQueries({ queryKey: ["user-dashboard-stats"] });
  });

  const openEdit = (event: EventItem) => {
    setEditing(event);
    editForm.reset({
      title: event.title,
      shortDescription: event.shortDescription ?? "",
      description: event.description,
      date: event.date ? new Date(event.date).toISOString().slice(0, 10) : "",
      time: event.time ?? "",
      venue: event.venue ?? "",
      categoryId: event.category?.id ?? "",
      type: event.type ?? EventType.PUBLIC,
      isOnline: event.isOnline ?? false,
      isFeatured: event.isFeatured ?? false,
      maxParticipants: event.maxParticipants ?? undefined,
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
      if (key === 'images') {
        // Skip images from values, we use selectedFiles
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    // Explicitly append images from selectedFiles if any
    selectedFiles.forEach(file => formData.append('images', file));

    const result = await updateEventAction(null, formData);
    setSubmitting(false);
    if (!result?.success) {
      toast.error(result?.message || "Failed to update");
      return;
    }
    toast.success("Event refined successfully");
    setEditOpen(false);
    setEditing(null);
    setImagePreviews([]);
    setSelectedFiles([]);
    queryClient.invalidateQueries({ queryKey: ["events-crud"] });
    queryClient.invalidateQueries({ queryKey: ["user-dashboard-stats"] });
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, form: any) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 5MB`);
        return false;
      }
      return true;
    });

    const combinedFiles = [...selectedFiles, ...newFiles];
    setSelectedFiles(combinedFiles);
    form.setValue('images', combinedFiles);

    const previews = combinedFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index: number, form: any) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    // Revoke the URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviews[index]);

    setSelectedFiles(newFiles);
    setImagePreviews(newPreviews);
    form.setValue('images', newFiles);
  };

  const onDelete = async (id: string) => {
    if (!confirm("Are you sure? This action cannot be undone if active participants exist.")) return;
    const result = await deleteEventAction(id);
    if (result?.success) {
      toast.success("Event removed from active list");
      queryClient.invalidateQueries({ queryKey: ["events-crud"] });
      queryClient.invalidateQueries({ queryKey: ["user-dashboard-stats"] });
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
            <Button className="rounded-2xl bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 px-6 py-6 font-black text-white shadow-xl shadow-primary-500/20 transition-all hover:scale-105 hover:shadow-primary-500/40 active:scale-95 border-0">
              <Plus className="mr-2 h-5 w-5" />
              Launch New Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[95svh] overflow-y-auto border-0 bg-white p-0 shadow-2xl sm:max-w-2xl dark:bg-slate-900">
            <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 px-8 py-8 text-white relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-secondary-500/20 rounded-full blur-2xl" />
              <DialogTitle className="text-3xl font-black tracking-tight relative z-10">Create New Event</DialogTitle>
              <DialogDescription className="text-primary-100/80 font-medium relative z-10">Configure the core parameters of your upcoming experience.</DialogDescription>
            </div>
            <form onSubmit={onCreateSubmit} className="grid gap-6 p-8 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Event Title</Label>
                <Input {...createForm.register("title")} className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white dark:bg-slate-800" placeholder="e.g. Annual Tech Summit" />
                {createForm.formState.errors.title && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{createForm.formState.errors.title.message}</p>}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Short Description (Max 255 chars)</Label>
                <Input {...createForm.register("shortDescription")} className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white dark:bg-slate-800" placeholder="A brief catchphrase for your event..." />
                {createForm.formState.errors.shortDescription && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{createForm.formState.errors.shortDescription.message}</p>}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Description</Label>
                <Textarea rows={4} {...createForm.register("description")} className="rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white dark:bg-slate-800" placeholder="What is this event about?..." />
                {createForm.formState.errors.description && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{createForm.formState.errors.description.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input type="date" {...createForm.register("date")} className="h-11 pl-10 rounded-xl border-slate-200" />
                </div>
                {createForm.formState.errors.date && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{createForm.formState.errors.date.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Time</Label>
                <Input type="time" {...createForm.register("time")} className="h-11 rounded-xl border-slate-200" />
                {createForm.formState.errors.time && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{createForm.formState.errors.time.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Venue / Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input {...createForm.register("venue")} className="h-11 pl-10 rounded-xl border-slate-200" placeholder="Physical Address or Virtual Link" />
                </div>
                {createForm.formState.errors.venue && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{createForm.formState.errors.venue.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Max Participants</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input type="number" {...createForm.register("maxParticipants")} className="h-11 pl-10 rounded-xl border-slate-200" placeholder="0 for unlimited" />
                </div>
                {createForm.formState.errors.maxParticipants && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{createForm.formState.errors.maxParticipants.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Category</Label>
                <Controller
                  control={createForm.control}
                  name="categoryId"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 bg-white">
                        <SelectValue placeholder="Select classification" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border border-slate-200 bg-white dark:bg-slate-950 dark:border-slate-800 shadow-2xl z-[100]">
                        {categories.map((c: any) => (
                          <SelectItem key={c.id} value={c.id} className="rounded-lg py-3 font-bold hover:bg-primary-50 dark:hover:bg-primary-900/20">{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {createForm.formState.errors.categoryId && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{createForm.formState.errors.categoryId.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Access Type</Label>
                <Controller
                  control={createForm.control}
                  name="type"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-11 w-full rounded-xl border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border border-slate-200 bg-white dark:bg-slate-950 dark:border-slate-800 shadow-2xl z-[100]">
                        <SelectItem value={EventType.PUBLIC} className="rounded-lg py-3 font-bold hover:bg-primary-50 dark:hover:bg-primary-900/20">Public (Open Admission)</SelectItem>
                        <SelectItem value={EventType.PRIVATE} className="rounded-lg py-3 font-bold hover:bg-primary-50 dark:hover:bg-primary-900/20">Private (Restricted Access)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {createForm.formState.errors.type && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{createForm.formState.errors.type.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Admission Fee (৳)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">৳</span>
                  <Input type="number" {...createForm.register("registrationFee")} className="h-11 pl-8 rounded-xl border-slate-200" />
                </div>
                {createForm.formState.errors.registrationFee && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{createForm.formState.errors.registrationFee.message}</p>}
              </div>
              <div className="flex items-center gap-4 py-2">
                <div className="flex items-center space-x-2">
                  <Input
                    type="checkbox"
                    id="isOnlineCreate"
                    {...createForm.register("isOnline")}
                    className="h-5 w-5 rounded border-slate-200 text-primary-600 focus:ring-primary-500"
                  />
                  <Label htmlFor="isOnlineCreate" className="font-bold text-slate-700">Online Event</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="checkbox"
                    id="isFeaturedCreate"
                    {...createForm.register("isFeatured")}
                    className="h-5 w-5 rounded border-slate-200 text-primary-600 focus:ring-primary-500"
                  />
                  <Label htmlFor="isFeaturedCreate" className="font-bold text-slate-700">Featured Event</Label>
                </div>
              </div>
              <div className="md:col-span-2 space-y-4">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Event Gallery (Images)</Label>
                <div className="space-y-4">
                  <div
                    onClick={() => document.getElementById('create-image-upload')?.click()}
                    className="relative group cursor-pointer"
                  >
                    <div className="h-40 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center transition-all group-hover:border-primary-400 group-hover:bg-primary-50/30 overflow-hidden">
                      <div className="p-4 rounded-2xl bg-white shadow-sm mb-3 group-hover:scale-110 transition-transform">
                        <UploadCloud className="h-8 w-8 text-primary-500" />
                      </div>
                      <p className="text-sm font-black text-slate-600">Click to upload experience media</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Supports: JPG, PNG, WEBP (Max 5MB each)</p>
                    </div>
                    <Input
                      id="create-image-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, createForm)}
                      className="hidden"
                    />
                  </div>

                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                      {imagePreviews.map((url, i) => (
                        <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm transition-all hover:border-primary-400">
                          <img src={url} alt="preview" className="h-full w-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(i, createForm);
                              }}
                              className="h-8 w-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-all"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="md:col-span-2 pt-4">
                <Button type="submit" disabled={submitting} className="h-14 w-full rounded-2xl bg-gradient-to-r from-primary-600 to-secondary-600 text-lg font-black text-white shadow-xl shadow-primary-500/30 hover:scale-[1.02] transition-all active:scale-95 border-0">
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
        {/* Desktop View: Taxonomy Table */}
        <div className="hidden md:block overflow-x-auto">
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
                ) : events.map((event: any, index: number) => (
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
                        <button
                          className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-primary-50 hover:text-primary-600 transition-all hover:scale-110"
                          onClick={() => {
                            setInvitingEvent({ id: event.id, title: event.title });
                            setInviteOpen(true);
                          }}
                          title="Invite Participants"
                        >
                          <UserPlus className="h-5 w-5" />
                        </button>
                        <button
                          className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-primary-50 hover:text-primary-600 transition-all hover:scale-110"
                          onClick={() => openEdit(event)}
                        >
                          <SquarePen className="h-5 w-5" />
                        </button>
                        <button
                          className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all hover:scale-110"
                          onClick={() => onDelete(event.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
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

        {/* Mobile View: Event Cards */}
        <div className="block md:hidden">
            {loading ? (
                <div className="p-6 space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-48 rounded-3xl bg-slate-100 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="divide-y divide-slate-50 dark:divide-slate-800">
                    <AnimatePresence>
                        {events.map((event: any, index: number) => (
                            <motion.div 
                                key={event.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-6 space-y-4"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                                            <Calendar className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[180px]">{event.title}</h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">{event.category?.name || 'Global'}</p>
                                        </div>
                                    </div>
                                    <Badge className={`rounded-lg border-0 px-2 py-1 text-[9px] font-black uppercase ${
                                        event.isPublished ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"
                                    }`}>
                                        {event.isPublished ? "Live" : "Draft"}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-4 px-1">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black uppercase text-slate-400">Fee</p>
                                        <p className="text-xs font-black text-slate-900 dark:text-white">৳{event.registrationFee.toLocaleString()}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black uppercase text-slate-400">Date</p>
                                        <p className="text-xs font-black text-slate-500">
                                            {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button 
                                        variant="outline" 
                                        className="flex-1 h-11 rounded-xl border-slate-100 font-black text-[10px] uppercase tracking-widest hover:bg-primary-50 hover:text-primary-600"
                                        onClick={() => openEdit(event)}
                                    >
                                        Modify
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        className="flex-1 h-11 rounded-xl border-slate-100 font-black text-[10px] uppercase tracking-widest text-rose-500 hover:bg-rose-50"
                                        onClick={() => onDelete(event.id)}
                                    >
                                        Purge
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
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
              {editForm.formState.errors.title && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{editForm.formState.errors.title.message}</p>}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Short Description</Label>
              <Input {...editForm.register("shortDescription")} className="h-12 rounded-xl border-slate-200" />
              {editForm.formState.errors.shortDescription && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{editForm.formState.errors.shortDescription.message}</p>}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Description</Label>
              <Textarea rows={4} {...editForm.register("description")} className="rounded-xl border-slate-200" />
              {editForm.formState.errors.description && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{editForm.formState.errors.description.message}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Operational Status</Label>
              <Controller
                control={editForm.control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-11 w-full rounded-xl border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-2xl z-[100]">
                      <SelectItem value={EventStatus.UPCOMING} className="rounded-lg py-2 font-bold">Upcoming</SelectItem>
                      <SelectItem value={EventStatus.ONGOING} className="rounded-lg py-2 font-bold">Ongoing</SelectItem>
                      <SelectItem value={EventStatus.COMPLETED} className="rounded-lg py-2 font-bold">Completed</SelectItem>
                      <SelectItem value={EventStatus.CANCELLED} className="rounded-lg py-2 font-bold">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {editForm.formState.errors.status && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{editForm.formState.errors.status.message}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Category</Label>
              <Controller
                control={editForm.control}
                name="categoryId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 bg-white">
                      <SelectValue placeholder="Select classification" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border border-slate-200 bg-white dark:bg-slate-950 dark:border-slate-800 shadow-2xl z-[100]">
                      {categories.map((c: any) => (
                        <SelectItem key={c.id} value={c.id} className="rounded-lg py-3 font-bold hover:bg-primary-50 dark:hover:bg-primary-900/20">{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {editForm.formState.errors.categoryId && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{editForm.formState.errors.categoryId.message}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input type="date" {...editForm.register("date")} className="h-11 pl-10 rounded-xl border-slate-200" />
              </div>
              {editForm.formState.errors.date && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{editForm.formState.errors.date.message}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Time</Label>
              <Input type="time" {...editForm.register("time")} className="h-11 rounded-xl border-slate-200" />
              {editForm.formState.errors.time && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{editForm.formState.errors.time.message}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Venue / Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input {...editForm.register("venue")} className="h-11 pl-10 rounded-xl border-slate-200" />
              </div>
              {editForm.formState.errors.venue && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{editForm.formState.errors.venue.message}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Lifecycle State</Label>
              <Controller
                control={editForm.control}
                name="isPublished"
                render={({ field }) => (
                  <Select
                    value={field.value ? "PUBLISHED" : "DRAFT"}
                    onValueChange={(v) => field.onChange(v === "PUBLISHED")}
                  >
                    <SelectTrigger className="h-11 w-full rounded-xl border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-2xl z-[100]">
                      <SelectItem value="PUBLISHED" className="rounded-lg py-2 font-bold text-emerald-600">Published / Live</SelectItem>
                      <SelectItem value="DRAFT" className="rounded-lg py-2 font-bold text-slate-400">Internal Draft</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {editForm.formState.errors.isPublished && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{editForm.formState.errors.isPublished.message}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Revised Fee (৳)</Label>
              <Input type="number" {...editForm.register("registrationFee")} className="h-11 rounded-xl border-slate-200" />
              {editForm.formState.errors.registrationFee && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{editForm.formState.errors.registrationFee.message}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Max Participants</Label>
              <Input type="number" {...editForm.register("maxParticipants")} className="h-11 rounded-xl border-slate-200" placeholder="0 for unlimited" />
              {editForm.formState.errors.maxParticipants && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{editForm.formState.errors.maxParticipants.message}</p>}
            </div>
            <div className="flex items-center gap-4 py-2">
              <div className="flex items-center space-x-2">
                <Input
                  type="checkbox"
                  id="isOnlineEdit"
                  {...editForm.register("isOnline")}
                  className="h-5 w-5 rounded border-slate-200 text-secondary-600 focus:ring-secondary-500"
                />
                <Label htmlFor="isOnlineEdit" className="font-bold text-slate-700">Online Event</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="checkbox"
                  id="isFeaturedEdit"
                  {...editForm.register("isFeatured")}
                  className="h-5 w-5 rounded border-slate-200 text-secondary-600 focus:ring-secondary-500"
                />
                <Label htmlFor="isFeaturedEdit" className="font-bold text-slate-700">Featured Event</Label>
              </div>
            </div>
            <div className="md:col-span-2 space-y-4">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Update Gallery (Images)</Label>
              <div className="space-y-4">
                <div
                  onClick={() => document.getElementById('edit-image-upload')?.click()}
                  className="relative group cursor-pointer"
                >
                  <div className="h-40 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center transition-all group-hover:border-secondary-400 group-hover:bg-secondary-50/30 overflow-hidden">
                    <div className="p-4 rounded-2xl bg-white shadow-sm mb-3 group-hover:scale-110 transition-transform">
                      <ImageIcon className="h-8 w-8 text-secondary-500" />
                    </div>
                    <p className="text-sm font-black text-slate-600">Update event media gallery</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Select multiple images to add</p>
                  </div>
                  <Input
                    id="edit-image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, editForm)}
                    className="hidden"
                  />
                </div>

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                    {imagePreviews.map((url, i) => (
                      <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm transition-all hover:border-secondary-400">
                        <img src={url} alt="preview" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(i, editForm);
                            }}
                            className="h-8 w-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-all"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="md:col-span-2 pt-4">
              <Button type="submit" disabled={submitting} className="h-14 w-full rounded-2xl bg-gradient-to-r from-secondary-600 to-secondary-800 text-lg font-black text-white">
                {submitting ? <Loader2 className="h-6 w-6 animate-spin" /> : "Commit Modifications"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* Invite Modal */}
      {inviteOpen && invitingEvent && (
        <InviteUserModal
          eventId={invitingEvent.id}
          eventTitle={invitingEvent.title}
          onClose={() => {
            setInviteOpen(false);
            setInvitingEvent(null);
          }}
        />
      )}
    </motion.div>
  );
}
