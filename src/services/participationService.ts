import { httpClient } from '@/lib/axios/httpClient';
import { ApiResponse } from '@/types/api.types';
import { JoinEventPayload, Participation, ParticipationFilters, ParticipationOptions, ParticipationResponse, UpdateStatusPayload } from '@/types/participition';


const joinEvent = async (payload: JoinEventPayload): Promise<ApiResponse<Participation>> => {
  return httpClient.post<Participation>('/participations/join', payload);
};

const getMyParticipations = async (options?: ParticipationOptions): Promise<ApiResponse<ParticipationResponse>> => {
  return httpClient.get<ParticipationResponse>('/participations/my-participations', { params: options });
};

const getAllParticipations = async (filters?: ParticipationFilters, options?: ParticipationOptions): Promise<ApiResponse<ParticipationResponse>> => {
  return httpClient.get<ParticipationResponse>('/participations', { params: { ...filters, ...options } });
};

const getSingleParticipation = async (id: string): Promise<ApiResponse<Participation>> => {
  return httpClient.get<Participation>(`/participations/${id}`);
};

const updateStatus = async (id: string, payload: UpdateStatusPayload): Promise<ApiResponse<Participation>> => {
  return httpClient.patch<Participation>(`/participations/${id}/status`, payload);
};

const cancelParticipation = async (id: string): Promise<ApiResponse<any>> => {
  return httpClient.delete<any>(`/participations/${id}`);
};

export const participationService = {
  joinEvent,
  getMyParticipations,
  getAllParticipations,
  getSingleParticipation,
  updateStatus,
  cancelParticipation,
};