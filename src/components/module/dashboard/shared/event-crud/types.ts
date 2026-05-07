import { EventStatus, EventType } from "@/types/enums";

export type EventItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  type: EventType;
  status: EventStatus;
  isPublished: boolean;
  isOnline: boolean;
  registrationFee: number;
  maxParticipants?: number;
  category?: { id: string; name: string } | null;
  organizer?: { id: string; name?: string | null } | null;
};

export type CategoryItem = {
  id: string;
  name: string;
};

export type EventListPayload = {
  data: EventItem[];
  meta?: {
    totalPage?: number;
    totalPages?: number;
  } | null;
};
