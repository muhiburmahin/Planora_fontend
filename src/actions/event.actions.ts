"use server";
import eventService from '@/services/eventService';
import { revalidatePath } from 'next/cache';

export const createEventAction = async (prevState: any, formData: FormData) => {
  const response = await eventService.server.create(formData as any);

  if (response.error) {
    return { success: false, message: response.error.message };
  }

  revalidatePath('/events');
  revalidatePath('/dashboard');
  return { success: true, message: 'Event created successfully', data: response.data };
};

export const updateEventAction = async (prevState: any, formData: FormData) => {
  const id = formData.get('id') as string;
  if (!id) {
    return { success: false, message: 'Event id is required' };
  }

  const response = await eventService.server.update(id, formData as any);

  if (response.error) {
    return { success: false, message: response.error.message };
  }

  revalidatePath(`/events/${id}`);
  revalidatePath('/events');
  revalidatePath('/dashboard');
  return { success: true, message: 'Event updated successfully', data: response.data };
};

export const deleteEventAction = async (id: string) => {
  const response = await eventService.server.remove(id);

  if (response.error) {
    return { success: false, message: response.error.message };
  }

  revalidatePath('/events');
  revalidatePath('/dashboard');
  return { success: true, message: 'Event deleted successfully' };
};

export const getAllEventsAction = async (query?: Record<string, any>) => {
  const response = await eventService.server.list(query);

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data;
};

export const getSingleEventAction = async (id: string) => {
  const response = await eventService.server.getById(id);

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data;
};
