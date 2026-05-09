import { z } from "zod";
import { EventStatus, EventType } from "@/types/enums";

export const categoryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export type CategoryFormInput = z.infer<typeof categoryFormSchema>;

export const eventCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  shortDescription: z.string().max(255, "Short description must be less than 255 characters").optional(),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  venue: z.string().min(1, "Venue is required"),
  categoryId: z.string().min(1, "Category is required"),
  registrationFee: z.coerce.number().min(0, "Fee cannot be negative").optional(),
  maxParticipants: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : val),
    z.coerce.number().int().min(1, "Must be at least 1").optional()
  ),
  isOnline: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  type: z.nativeEnum(EventType).default(EventType.PUBLIC),
  images: z.any().optional(), // For file uploads
});

export type EventCreateInput = z.infer<typeof eventCreateSchema>;

export const eventUpdateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  shortDescription: z.string().max(255, "Short description must be less than 255 characters").optional(),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  venue: z.string().min(1, "Venue is required"),
  categoryId: z.string().min(1, "Category is required"),
  registrationFee: z.coerce.number().min(0, "Fee cannot be negative").optional(),
  maxParticipants: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : val),
    z.coerce.number().int().min(1, "Must be at least 1").optional()
  ),
  isOnline: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  type: z.nativeEnum(EventType).default(EventType.PUBLIC),
  status: z.nativeEnum(EventStatus),
  isPublished: z.boolean().optional(),
  images: z.any().optional(),
});

export type EventUpdateInput = z.infer<typeof eventUpdateSchema>;
