// src/types/index.ts

export interface ApiMeta {
  page: number;
  limit: number;
  total: number;
  totalPage?: number;
  totalPages?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: ApiMeta;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { events: number };
}

export interface EventImage {
  id: string;
  url: string;
  eventId: string;
}

export interface Organizer {
  id?: string;
  name: string;
  image?: string;
  email?: string;
}

export type EventType = "PUBLIC" | "PRIVATE";
export type EventStatus = "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "BANNED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface Event {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  isOnline: boolean;
  type: EventType;
  registrationFee: number;
  maxParticipants?: number;
  status: EventStatus;
  isPublished: boolean;
  isFeatured: boolean;
  images: EventImage[];
  categoryId: string;
  category: Category;
  organizerId: string;
  organizer: Organizer;
  averageRating: number;
  totalReviews: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { participations: number };
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  eventId: string;
  user: { name: string; image?: string };
  createdAt: string;
  updatedAt: string;
}

export interface Participation {
  id: string;
  ticketNumber?: string;
  userId: string;
  eventId: string;
  status: RequestStatus;
  paymentStatus: PaymentStatus;
  transactionId?: string;
  event?: Event;
  user?: Organizer;
  createdAt: string;
  updatedAt: string;
}

export interface Invitation {
  id: string;
  eventId: string;
  senderId: string;
  receiverId: string;
  status: RequestStatus;
  message?: string;
  event?: Event;
  sender?: Organizer;
  receiver?: Organizer;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: "ADMIN" | "USER";
  status: string;
  emailVerified: boolean;
  profile?: {
    bio?: string;
    contactNumber?: string;
    address?: string;
  };
}

export interface EventFilters {
  searchTerm?: string;
  categoryId?: string;
  type?: EventType;
  status?: EventStatus;
  minPrice?: number;
  maxPrice?: number;
  isOnline?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}