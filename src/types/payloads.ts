
import { Event } from "./index";

export type CreateEventPayload = Pick<
  Event, 
  'title' | 'description' | 'date' | 'time' | 'venue' | 'isOnline' | 'type' | 'registrationFee' | 'categoryId'
> & { 
  images?: File[] | string[]; 
  maxParticipants?: number;
};

export type UpdateEventPayload = Partial<CreateEventPayload>;