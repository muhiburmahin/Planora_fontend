"use client";

import { Controller, UseFormReturn } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { EventStatus, EventType } from "@/types/enums";
import { EventUpdateInput } from "@/lib/validations/dashboard";
import { CategoryItem } from "./types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type EventEditDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<EventUpdateInput>;
  categories: CategoryItem[];
  submitting: boolean;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
};

export function EventEditDialog({ open, onOpenChange, form, categories, submitting, onSubmit }: EventEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95svh] overflow-y-auto border-0 bg-white p-0 shadow-2xl sm:max-w-2xl dark:bg-slate-900">
        <div className="bg-gradient-to-r from-secondary-900 to-secondary-700 px-8 py-8 text-white">
          <DialogTitle className="text-3xl font-black tracking-tight">Refine Experience</DialogTitle>
          <DialogDescription className="font-medium text-secondary-100/80">Calibrate the status and metadata of your active event.</DialogDescription>
        </div>
        <form onSubmit={onSubmit} className="grid gap-6 p-8 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Title</Label>
            <Input {...form.register("title")} className="h-12 rounded-xl border-slate-200" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Description</Label>
            <Textarea rows={4} {...form.register("description")} className="rounded-xl border-slate-200" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Date</Label>
            <Input type="date" {...form.register("date")} className="h-11 rounded-xl border-slate-200" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Time</Label>
            <Input type="time" {...form.register("time")} className="h-11 rounded-xl border-slate-200" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Venue / Location</Label>
            <Input {...form.register("venue")} className="h-11 rounded-xl border-slate-200" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Category</Label>
            <Controller
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <Select value={field.value || ""} onValueChange={field.onChange}>
                  <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 bg-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="rounded-2xl border-0 shadow-2xl">
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id} className="rounded-lg py-2 font-bold">{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Access Type</Label>
            <Controller
              control={form.control}
              name="type"
              render={({ field }) => (
                <Select value={field.value} onValueChange={(v) => field.onChange(v as EventType)}>
                  <SelectTrigger className="h-11 w-full rounded-xl border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper" className="rounded-2xl border-0 shadow-2xl">
                    <SelectItem value={EventType.PUBLIC} className="rounded-lg py-2 font-bold">Public</SelectItem>
                    <SelectItem value={EventType.PRIVATE} className="rounded-lg py-2 font-bold">Private</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Maximum Participants</Label>
            <Input type="number" min={1} {...form.register("maxParticipants")} className="h-11 rounded-xl border-slate-200" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Mode</Label>
            <Controller
              control={form.control}
              name="isOnline"
              render={({ field }) => (
                <Select value={field.value ? "ONLINE" : "OFFLINE"} onValueChange={(v) => field.onChange(v === "ONLINE")}>
                  <SelectTrigger className="h-11 w-full rounded-xl border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper" className="rounded-2xl border-0 shadow-2xl">
                    <SelectItem value="ONLINE" className="rounded-lg py-2 font-bold">Online</SelectItem>
                    <SelectItem value="OFFLINE" className="rounded-lg py-2 font-bold">Offline</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Operational Status</Label>
            <Controller
              control={form.control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={(v) => field.onChange(v as EventStatus)}>
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
              )}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Lifecycle State</Label>
            <Controller
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <Select value={field.value ? "PUBLISHED" : "DRAFT"} onValueChange={(v) => field.onChange(v === "PUBLISHED")}>
                  <SelectTrigger className="h-11 w-full rounded-xl border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-0 shadow-2xl">
                    <SelectItem value="PUBLISHED" className="rounded-lg py-2 font-bold text-emerald-600">Published / Live</SelectItem>
                    <SelectItem value="DRAFT" className="rounded-lg py-2 font-bold text-slate-400">Internal Draft</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Revised Fee (৳)</Label>
            <Input type="number" {...form.register("registrationFee")} className="h-11 rounded-xl border-slate-200" />
          </div>
          <div className="pt-4 md:col-span-2">
            <Button type="submit" disabled={submitting} className="h-14 w-full rounded-2xl bg-gradient-to-r from-secondary-600 to-secondary-800 text-lg font-black text-white">
              {submitting ? <Loader2 className="h-6 w-6 animate-spin" /> : "Commit Modifications"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
