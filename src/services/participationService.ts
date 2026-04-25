import { httpClient } from '@/lib/axios/httpClient';
import { ApiResponse } from '@/types/api.types';
import { JoinEventPayload, Participation, ParticipationFilters, ParticipationOptions, ParticipationResponse, UpdateStatusPayload } from '@/types/participition';

// Use NEXT_PUBLIC_API_URL for server actions
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/participations`;

async function mapFetchResponse(res: Response) {
  const result = await res.json().catch(() => null);
  if (!res.ok) return { data: null, error: { message: result?.message || 'Request failed', status: res.status, raw: result } };
  return { data: result?.data ?? result, error: null };
}

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

const serverJoinEvent = async (payload: JoinEventPayload) => {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/join`, {
      method: 'POST',
      headers: {
        Cookie: cookieStore.toString(),
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });
    return await mapFetchResponse(res);
  } catch (error) {
    return { data: null, error: { message: 'Failed to join event', error } };
  }
};

const serverGetMyParticipations = async (options?: ParticipationOptions) => {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const params = new URLSearchParams();
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const qs = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_URL}/my-participations${qs}`, {
      method: 'GET',
      headers: {
        Cookie: cookieStore.toString(),
        Accept: 'application/json',
      },
      cache: 'no-store',
    });
    return await mapFetchResponse(res);
  } catch (error) {
    return { data: null, error: { message: 'Failed to fetch my participations', error } };
  }
};

const serverGetAllParticipations = async (filters?: ParticipationFilters, options?: ParticipationOptions) => {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const qs = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_URL}${qs}`, {
      method: 'GET',
      headers: {
        Cookie: cookieStore.toString(),
        Accept: 'application/json',
      },
      cache: 'no-store',
    });
    return await mapFetchResponse(res);
  } catch (error) {
    return { data: null, error: { message: 'Failed to fetch participations', error } };
  }
};

const serverGetSingleParticipation = async (id: string) => {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: {
        Cookie: cookieStore.toString(),
        Accept: 'application/json',
      },
      cache: 'no-store',
    });
    return await mapFetchResponse(res);
  } catch (error) {
    return { data: null, error: { message: 'Failed to fetch participation', error } };
  }
};

const serverUpdateStatus = async (id: string, payload: UpdateStatusPayload) => {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/${id}/status`, {
      method: 'PATCH',
      headers: {
        Cookie: cookieStore.toString(),
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });
    return await mapFetchResponse(res);
  } catch (error) {
    return { data: null, error: { message: 'Failed to update participation status', error } };
  }
};

const serverCancelParticipation = async (id: string) => {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Cookie: cookieStore.toString(),
        Accept: 'application/json',
      },
      cache: 'no-store',
    });
    return await mapFetchResponse(res);
  } catch (error) {
    return { data: null, error: { message: 'Failed to cancel participation', error } };
  }
};

export const participationService = {
  server: {
    joinEvent: serverJoinEvent,
    getMyParticipations: serverGetMyParticipations,
    getAllParticipations: serverGetAllParticipations,
    getSingleParticipation: serverGetSingleParticipation,
    updateStatus: serverUpdateStatus,
    cancelParticipation: serverCancelParticipation,
  },
  joinEvent,
  createParticipation: joinEvent,
  getMyParticipations,
  getAllParticipations,
  getSingleParticipation,
  getParticipationById: getSingleParticipation,
  updateStatus,
  updateParticipationStatus: updateStatus,
  cancelParticipation,
};