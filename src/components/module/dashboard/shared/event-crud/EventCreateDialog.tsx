"use client";

import { Controller, UseFormReturn } from "react-hook-form";
import { Calendar, Loader2, MapPin, Plus } from "lucide-react";
import { EventType } from "@/types/enums";
import { EventCreateInput } from "@/lib/validations/dashboard";
import { CategoryItem } from "./types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type EventCreateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<EventCreateInput>;
  categories: CategoryItem[];
  submitting: boolean;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
};

export function EventCreateDialog({ open, onOpenChange, form, categories, submitting, onSubmit }: EventCreateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-6 font-black text-white shadow-xl shadow-primary-500/20 transition-all hover:scale-105 hover:shadow-primary-500/40 active:scale-95">
          <Plus className="mr-2 h-5 w-5" />
          Launch New Event
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[95svh] overflow-y-auto border-0 bg-slate-50 p-0 shadow-2xl sm:max-w-2xl dark:bg-slate-900">
        <div className="bg-gradient-to-r from-primary-900 to-primary-700 px-8 py-8 text-white">
          <DialogTitle className="text-3xl font-black tracking-tight">Create New Event</DialogTitle>
          <DialogDescription className="font-medium text-primary-100/80">Configure the core parameters of your upcoming experience.</DialogDescription>
        </div>
        <form onSubmit={onSubmit} className="grid gap-6 bg-brand-100 p-8 md:grid-cols-2 dark:bg-brand-900">
          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Event Title</Label>
            <Input
              {...form.register("title", { required: "Event title is required" })}
              placeholder="Enter event title"
              className="bg-white border border-slate-300 focus:ring-primary-500 focus:border-primary-500"
            />
            {form.formState.errors.title && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.title.message}</p>
            )}
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Description</Label>
            <Textarea rows={4} {...form.register("description")} className="rounded-xl border-slate-200 bg-slate-50/50" placeholder="What is this event about?..." />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input type="date" {...form.register("date")} className="h-11 rounded-xl border-slate-200 pl-10" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Time</Label>
            <Input type="time" {...form.register("time")} className="h-11 rounded-xl border-slate-200" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Venue / Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input {...form.register("venue")} className="h-11 rounded-xl border-slate-200 pl-10" placeholder="Physical Address or Virtual Link" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Category</Label>
            <Controller
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <Select value={field.value || ""} onValueChange={field.onChange}>
                  <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 bg-white">
                    <SelectValue placeholder="Select classification" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="rounded-2xl border-0 shadow-2xl">
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id} className="rounded-lg py-3 font-bold">{c.name}</SelectItem>
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
                    <SelectItem value={EventType.PUBLIC} className="rounded-lg py-3 font-bold">Public (Open Admission)</SelectItem>
                    <SelectItem value={EventType.PRIVATE} className="rounded-lg py-3 font-bold">Private (Restricted Access)</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
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
                    <SelectItem value="OFFLINE" className="rounded-lg py-3 font-bold">Offline</SelectItem>
                    <SelectItem value="ONLINE" className="rounded-lg py-3 font-bold">Online</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Maximum Participants</Label>
            <Input type="number" min={1} {...form.register("maxParticipants")} className="h-11 rounded-xl border-slate-200" placeholder="Optional" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Admission Fee (৳)</Label>
            <Input type="number" {...form.register("registrationFee")} className="h-11 rounded-xl border-slate-200" />
          </div>
          <div className="pt-4 md:col-span-2">
            <Button type="submit" disabled={submitting} className="h-14 w-full rounded-2xl bg-gradient-to-r from-primary-600 to-primary-800 text-lg font-black text-white shadow-xl shadow-primary-500/20">
              {submitting ? <Loader2 className="h-6 w-6 animate-spin" /> : "Deploy Experience"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
