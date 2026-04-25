"use server";
import { participationService } from '@/services/participationService';
import { revalidatePath } from 'next/cache';
import { JoinEventPayload, UpdateStatusPayload, ParticipationFilters, ParticipationOptions } from '@/types/participition';

export const joinEventAction = async (prevState: any, formData: FormData) => {
  const eventId = formData.get('eventId') as string;
  if (!eventId) {
    return { success: false, message: 'Event id is required' };
  }

  const payload: JoinEventPayload = { eventId };
  const response = await participationService.server.joinEvent(payload);

  if (response.error) {
    return { success: false, message: response.error.message };
  }

  revalidatePath('/dashboard');
  return { success: true, message: 'Participation requested successfully', data: response.data };
};

export const updateParticipationStatusAction = async (prevState: any, formData: FormData) => {
  const id = formData.get('id') as string;
  const status = formData.get('status') as 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

  if (!id || !status) {
    return { success: false, message: 'Participation id and status are required' };
  }

  const payload: UpdateStatusPayload = { status };
  const response = await participationService.server.updateStatus(id, payload);

  if (response.error) {
    return { success: false, message: response.error.message };
  }

  revalidatePath('/dashboard');
  return { success: true, message: 'Participation status updated successfully', data: response.data };
};

export const cancelParticipationAction = async (id: string) => {
  const response = await participationService.server.cancelParticipation(id);

  if (response.error) {
    return { success: false, message: response.error.message };
  }

  revalidatePath('/dashboard');
  return { success: true, message: 'Participation canceled successfully' };
};

export const getMyParticipationsAction = async (options?: ParticipationOptions) => {
  const response = await participationService.server.getMyParticipations(options);

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data;
};

export const getSingleParticipationAction = async (id: string) => {
  const response = await participationService.server.getSingleParticipation(id);

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data;
};

export const getAllParticipationsAction = async (filters?: ParticipationFilters, options?: ParticipationOptions) => {
  const response = await participationService.server.getAllParticipations(filters, options);

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data;
};
