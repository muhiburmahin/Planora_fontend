"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Calendar, ChevronLeft, ChevronRight, Globe, Lock, MapPin, SquarePen } from "lucide-react";
import { EventStatus, EventType } from "@/types/enums";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableSkeleton } from "../TableSkeleton";
import { EventDeleteButton } from "./EventDeleteButton";
import { EventItem } from "./types";

type EventsTableProps = {
  loading: boolean;
  events: EventItem[];
  page: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onEdit: (event: EventItem) => void;
  onDelete: (id: string) => Promise<void>;
};

export function EventsTable({
  loading,
  events,
  page,
  totalPages,
  onPrevPage,
  onNextPage,
  onEdit,
  onDelete,
}: EventsTableProps) {
  return (
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
              ) : (
                <>
                  <TableRow>
                    <TableCell className="font-bold">Status</TableCell>
                    <TableCell className="font-bold">Title</TableCell>
                    <TableCell className="font-bold">Date</TableCell>
                    <TableCell className="font-bold">Actions</TableCell>
                  </TableRow>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <Badge
                          className={`${
                            event.status === EventStatus.UPCOMING
                              ? "bg-green-500"
                              : event.status === EventStatus.ONGOING
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          } text-white`}
                        >
                          {event.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{event.title}</TableCell>
                      <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button onClick={() => onEdit(event)} variant="outline" size="sm">
                          Edit
                        </Button>
                        <EventDeleteButton eventId={event.id as string} onDelete={onDelete} />
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
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

      <div className="flex items-center justify-between border-t border-slate-50 bg-slate-50/30 px-8 py-6 dark:bg-slate-900/50">
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">
          Page <span className="text-slate-900 dark:text-white">{page}</span> of {totalPages}
        </p>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-10 rounded-xl border-slate-100 font-bold px-4 disabled:opacity-30" disabled={page <= 1 || loading} onClick={onPrevPage}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button variant="outline" size="sm" className="h-10 rounded-xl border-slate-100 font-bold px-4 disabled:opacity-30" disabled={page >= totalPages || loading} onClick={onNextPage}>
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
