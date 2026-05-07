"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type EventDeleteButtonProps = {
  eventId: string;
  onDelete: (id: string) => Promise<void>;
};

export function EventDeleteButton({ eventId, onDelete }: EventDeleteButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      className="h-10 w-10 rounded-xl border-slate-100 hover:bg-red-50 hover:text-red-600 transition-all hover:scale-110 active:scale-95"
      onClick={() => onDelete(eventId)}
    >
      <Trash2 className="h-5 w-5" />
    </Button>
  );
}
