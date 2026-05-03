/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from '@/lib/axios/httpClient';
import { ApiResponse } from '@/types';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/events`;

// Helper for mapping fetch responses
async function mapFetchResponse(res: Response) {
    const result = await res.json().catch(() => null);
    if (!res.ok) return { data: null, error: { message: result?.message || 'Request failed', status: res.status, raw: result } };
    return { data: result?.data ?? result, error: null };
}

export const eventService = {
    // Server-side (cookie + fetch) methods for Next.js Server Actions
    server: {
        list: async (query?: Record<string, any>) => {
            try {
                const qs = query
                    ? `?${new URLSearchParams(
                        Object.entries(query).reduce((acc, [k, v]) => {
                            if (v !== undefined && v !== null) acc[k] = String(v);
                            return acc;
                        }, {} as Record<string, string>)
                    )}`
                    : "";

                const { cookies } = await import("next/headers");
                const cookieStore = await cookies();
                const res = await fetch(`${API_URL}${qs}`, {
                    method: "GET",
                    headers: {
                        Cookie: cookieStore.toString(),
                        Accept: "application/json",
                    },
                    cache: "no-store",
                });
                return await mapFetchResponse(res);
            } catch (error) {
                return { data: null, error: { message: 'Failed to fetch events', error } };
            }
        },

        getById: async (id: string) => {
            try {
                const { cookies } = await import("next/headers");
                const cookieStore = await cookies();
                const res = await fetch(`${API_URL}/${id}`, {
                    method: "GET",
                    headers: {
                        Cookie: cookieStore.toString(),
                        Accept: "application/json",
                    },
                    cache: "no-store",
                });
                return await mapFetchResponse(res);
            } catch (error) {
                return { data: null, error: { message: 'Failed to fetch event', error } };
            }
        },

        create: async (payload: any) => {
            try {
                const { cookies } = await import("next/headers");
                const cookieStore = await cookies();
                const headers: Record<string, string> = {
                    Cookie: cookieStore.toString(),
                    Accept: "application/json",
                };

                const body = payload instanceof FormData ? payload : JSON.stringify(payload);
                if (!(payload instanceof FormData)) {
                    headers["Content-Type"] = "application/json";
                }

                const res = await fetch(`${API_URL}/create-event`, {
                    method: "POST",
                    headers,
                    body,
                    cache: "no-store",
                });
                return await mapFetchResponse(res);
            } catch (error) {
                return { data: null, error: { message: 'Failed to create event', error } };
            }
        },

        update: async (id: string, payload: any) => {
            try {
                const { cookies } = await import("next/headers");
                const cookieStore = await cookies();
                const headers: Record<string, string> = {
                    Cookie: cookieStore.toString(),
                    Accept: "application/json",
                };

                const body = payload instanceof FormData ? payload : JSON.stringify(payload);
                if (!(payload instanceof FormData)) {
                    headers["Content-Type"] = "application/json";
                }

                const res = await fetch(`${API_URL}/${id}`, {
                    method: "PATCH",
                    headers,
                    body,
                    cache: "no-store",
                });
                return await mapFetchResponse(res);
            } catch (error) {
                return { data: null, error: { message: 'Failed to update event', error } };
            }
        },

        remove: async (id: string) => {
            try {
                const { cookies } = await import("next/headers");
                const cookieStore = await cookies();
                const res = await fetch(`${API_URL}/${id}`, {
                    method: "DELETE",
                    headers: {
                        Cookie: cookieStore.toString(),
                        Accept: "application/json",
                    },
                    cache: "no-store",
                });
                return await mapFetchResponse(res);
            } catch (error) {
                return { data: null, error: { message: 'Failed to delete event', error } };
            }
        }
    },

    // Client-side helpers (using Axios)
    client: {
        list: async (params?: Record<string, any>): Promise<ApiResponse<any>> => {
            return httpClient.get<any>('/events', { params });
        },

        getById: async (id: string): Promise<ApiResponse<any>> => {
            return httpClient.get<any>(`/events/${id}`);
        },

        getEventsByCategory: async (categorySlug: string, filters?: Record<string, any>): Promise<ApiResponse<any>> => {
            const params = { categorySlug, ...filters };
            return httpClient.get<any>('/events', { params });
        },

        create: async (payload: any): Promise<ApiResponse<any>> => {
            const config = payload instanceof FormData
                ? { headers: { 'Content-Type': 'multipart/form-data' } }
                : {};
            return httpClient.post<any>('/events/create-event', payload, config);
        },

        update: async (id: string, payload: any): Promise<ApiResponse<any>> => {
            const config = payload instanceof FormData
                ? { headers: { 'Content-Type': 'multipart/form-data' } }
                : {};
            return httpClient.patch<any>(`/events/${id}`, payload, config);
        },

        remove: async (id: string): Promise<ApiResponse<any>> => {
            return httpClient.delete<any>(`/events/${id}`);
        },
    },
    // Backward-compatible aliases
    getMyEvents: async () => {
        const response = await eventService.client.list({ myEvents: true });
        return {
            data: response.data?.data ?? [],
            error: response.success ? null : { message: response.message },
        };
    },
    getEventById: async (id: string) => {
        const response = await eventService.client.getById(id);
        return {
            data: response.data?.data ?? null,
            error: response.success ? null : { message: response.message },
        };
    },
    createEvent: async (payload: any) => {
        const response = await eventService.client.create(payload);
        return {
            data: response.data?.data ?? null,
            error: response.success ? null : { message: response.message },
        };
    },
    updateEvent: async (id: string, payload: any) => {
        const response = await eventService.client.update(id, payload);
        return {
            data: response.data?.data ?? null,
            error: response.success ? null : { message: response.message },
        };
    },
    deleteEvent: async (id: string) => {
        const response = await eventService.client.remove(id);
        return {
            data: response.data?.data ?? null,
            error: response.success ? null : { message: response.message },
        };
    },
};

export default eventService;