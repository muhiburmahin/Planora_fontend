"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, SquarePen, Plus, Trash2, AlertCircle } from "lucide-react";
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
  const [actionError, setActionError] = useState<string | null>(null);

  const createForm = useForm<EventCreateInput>({
    resolver: zodResolver(eventCreateSchema),
    defaultValues: createDefaults,
  });

  const editForm = useForm<EventUpdateInput>({
    resolver: zodResolver(eventUpdateSchema),
    defaultValues: updateDefaults,
  });

  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [events]
  );

  const loadCategories = async () => {
    const response = await categoryService.getAllCategories({ isActive: true }, { page: 1, limit: 200 });
    if (!response?.success) {
      toast.error(response?.message || "Failed to load categories");
      return;
    }
    const payload = response.data as any;
    setCategories(payload?.data ?? payload ?? []);
  };

  const loadEvents = async () => {
    setLoading(true);
    const response = await eventService.client.list({ limit: 200, sortBy: "createdAt", sortOrder: "desc", ...(query || {}) });
    if (response.error || !response.data?.success) {
      toast.error((response.error as any)?.message || response.data?.message || "Failed to load events");
      setLoading(false);
      return;
    }
    setEvents((response.data.data ?? []) as EventItem[]);
    setLoading(false);
  };

  useEffect(() => {
    void Promise.all([loadCategories(), loadEvents()]);
  }, []);

  const onCreateSubmit = createForm.handleSubmit(async (values) => {
    setActionError(null);
    setSubmitting(true);
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("date", values.date);
    formData.append("time", values.time);
    formData.append("venue", values.venue);
    formData.append("categoryId", values.categoryId);
    formData.append("type", values.type);
    formData.append("registrationFee", String(values.registrationFee ?? 0));
    formData.append("isOnline", values.isOnline ? "true" : "false");
    if (values.maxParticipants) {
      formData.append("maxParticipants", String(values.maxParticipants));
    }

    const result = await createEventAction(null, formData);
    setSubmitting(false);
    if (!result?.success) {
      const message = result?.message || "Failed to create event";
      setActionError(message);
      toast.error(message);
      return;
    }
    toast.success(result.message || "Event created");
    createForm.reset(createDefaults);
    setCreateOpen(false);
    await loadEvents();
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
    setActionError(null);
    setSubmitting(true);
    const formData = new FormData();
    formData.append("id", editing.id);
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("date", values.date);
    formData.append("registrationFee", String(values.registrationFee ?? 0));
    formData.append("status", values.status);
    formData.append("isPublished", values.isPublished ? "true" : "false");
    const result = await updateEventAction(null, formData);
    setSubmitting(false);
    if (!result?.success) {
      const message = result?.message || "Failed to update event";
      setActionError(message);
      toast.error(message);
      return;
    }
    toast.success(result.message || "Event updated");
    setEditOpen(false);
    setEditing(null);
    await loadEvents();
  });

  const onDelete = async (id: string) => {
    setActionError(null);
    const result = await deleteEventAction(id);
    if (!result?.success) {
      const message = result?.message || "Failed to delete event";
      setActionError(message);
      toast.error(message);
      return;
    }
    toast.success(result.message || "Event deleted");
    await loadEvents();
  };

  return (
    <Card className="border-primary-200/80 bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/40 shadow-lg shadow-primary-200/20 dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-slate-900 dark:text-slate-100">{title}</CardTitle>
          <p className="mt-1 text-xs font-medium text-primary-700 dark:text-primary-300">Create, update and manage event records from one place</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-gradient-primary text-white shadow-md sm:w-auto">
              <Plus className="mr-1 h-4 w-4" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90svh] overflow-y-auto border-primary-200 bg-gradient-to-br from-white to-primary-50 sm:max-w-2xl dark:border-slate-700 dark:from-slate-900 dark:to-slate-800">
            <DialogHeader>
              <DialogTitle>Create Event</DialogTitle>
              <DialogDescription>Add a new event to the platform.</DialogDescription>
            </DialogHeader>
            <form onSubmit={onCreateSubmit} className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label>Title</Label>
                <Input {...createForm.register("title")} />
                {createForm.formState.errors.title && <p className="text-xs text-red-500">{createForm.formState.errors.title.message}</p>}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Textarea rows={4} {...createForm.register("description")} />
                {createForm.formState.errors.description && <p className="text-xs text-red-500">{createForm.formState.errors.description.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" {...createForm.register("date")} />
                {createForm.formState.errors.date && <p className="text-xs text-red-500">{createForm.formState.errors.date.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Time</Label>
                <Input type="time" {...createForm.register("time")} />
                {createForm.formState.errors.time && <p className="text-xs text-red-500">{createForm.formState.errors.time.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Venue</Label>
                <Input {...createForm.register("venue")} />
                {createForm.formState.errors.venue && <p className="text-xs text-red-500">{createForm.formState.errors.venue.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={createForm.watch("categoryId")} onValueChange={(v) => createForm.setValue("categoryId", v, { shouldValidate: true })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {createForm.formState.errors.categoryId && <p className="text-xs text-red-500">{createForm.formState.errors.categoryId.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={createForm.watch("type")} onValueChange={(v) => createForm.setValue("type", v as EventType)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={EventType.PUBLIC}>Public</SelectItem>
                    <SelectItem value={EventType.PRIVATE}>Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Registration Fee</Label>
                <Input type="number" min={0} step="0.01" {...createForm.register("registrationFee")} />
              </div>
              <DialogFooter className="md:col-span-2">
                <Button type="submit" disabled={submitting} className="w-full bg-gradient-primary text-white sm:w-auto">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Event"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        {actionError && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            <AlertCircle className="h-4 w-4" />
            <span>{actionError}</span>
          </div>
        )}
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading events...
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-primary-100 bg-gradient-to-br from-primary-50/50 to-secondary-50/60 dark:border-slate-700 dark:from-slate-900 dark:to-slate-800">
          <Table>
            <TableHeader>
              <TableRow className="bg-white/80 dark:bg-slate-900/80">
                <TableHead className="font-bold text-primary-800">Title</TableHead>
                <TableHead className="font-bold text-primary-800">Date</TableHead>
                <TableHead className="font-bold text-primary-800">Category</TableHead>
                <TableHead className="font-bold text-primary-800">Status</TableHead>
                <TableHead className="font-bold text-primary-800">Fee</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedEvents.map((event) => (
                <TableRow key={event.id} className="bg-white/70 dark:bg-slate-900/60">
                  <TableCell className="max-w-xs truncate font-medium">{event.title}</TableCell>
                  <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                  <TableCell>{event.category?.name || "N/A"}</TableCell>
                  <TableCell>
                    <span className="rounded-full bg-primary-100 px-2 py-1 text-xs font-semibold text-primary-700">{event.status}</span>
                  </TableCell>
                  <TableCell>${event.registrationFee ?? 0}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" className="border-primary-200 text-primary-700 hover:bg-primary-50" onClick={() => openEdit(event)}>
                        <SquarePen className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="destructive" className="bg-red-500 hover:bg-red-600" onClick={() => void onDelete(event.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {sortedEvents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-500">
                    No events found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90svh] overflow-y-auto border-primary-200 bg-gradient-to-br from-white to-primary-50 sm:max-w-xl dark:border-slate-700 dark:from-slate-900 dark:to-slate-800">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>Update your event information.</DialogDescription>
          </DialogHeader>
          <form onSubmit={onEditSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label>Title</Label>
              <Input {...editForm.register("title")} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Description</Label>
              <Textarea rows={4} {...editForm.register("description")} />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" {...editForm.register("date")} />
            </div>
            <div className="space-y-2">
              <Label>Registration Fee</Label>
              <Input type="number" min={0} step="0.01" {...editForm.register("registrationFee")} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={editForm.watch("status")} onValueChange={(v) => editForm.setValue("status", v as EventStatus)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EventStatus.UPCOMING}>Upcoming</SelectItem>
                  <SelectItem value={EventStatus.ONGOING}>Ongoing</SelectItem>
                  <SelectItem value={EventStatus.COMPLETED}>Completed</SelectItem>
                  <SelectItem value={EventStatus.CANCELLED}>Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Publication</Label>
              <Select
                value={editForm.watch("isPublished") ? "PUBLISHED" : "DRAFT"}
                onValueChange={(v) => editForm.setValue("isPublished", v === "PUBLISHED")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="md:col-span-2">
              <Button type="submit" disabled={submitting} className="w-full bg-gradient-primary text-white sm:w-auto">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
