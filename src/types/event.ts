
import { Category } from './category';
import { EventStatus, EventType } from './enums';
import { User } from './user';

export interface EventImage {
  id: string;
  url: string;
  eventId: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string | null;
  description: string;
  date: string; // ISO String
  time: string;
  venue: string;
  isOnline: boolean;
  type: EventType;
  registrationFee: number;
  maxParticipants?: number | null;
  status: EventStatus;
  isPublished: boolean;
  isFeatured: boolean;
  categoryId: string;
  category: Category;
  organizerId: string;
  organizer: User;
  images: EventImage[];
  averageRating: number;
  totalReviews: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { participations: number };
}

export interface CreateEventPayload {
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  categoryId: string;
  type?: EventType;
  registrationFee?: number;
  isOnline?: boolean;
  maxParticipants?: number;
  shortDescription?: string;
}

export interface UpdateEventPayload extends Partial<CreateEventPayload> {}