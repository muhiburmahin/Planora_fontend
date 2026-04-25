/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from '@/lib/axios/httpClient';

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
        list: async (params?: Record<string, any>) => {
            try {
                const res = await httpClient.get<any>('/events', { params });
                return { data: res.data ?? res, error: null };
            } catch (error) {
                return { data: null, error };
            }
        },

        getById: async (id: string) => {
            try {
                const res = await httpClient.get<any>(`/events/${id}`);
                return { data: res.data ?? res, error: null };
            } catch (error) {
                return { data: null, error };
            }
        },

        getEventsByCategory: async (categorySlug: string, filters?: Record<string, any>) => {
            try {
                const params = { categorySlug, ...filters };
                const res = await httpClient.get<any>('/events', { params });
                return { data: res.data ?? res, error: null };
            } catch (error) {
                return { data: null, error };
            }
        },

        create: async (payload: any) => {
            try {
                const config = payload instanceof FormData 
                    ? { headers: { 'Content-Type': 'multipart/form-data' } } 
                    : {};
                const res = await httpClient.post<any>('/events/create-event', payload, config);
                return { data: res.data ?? res, error: null };
            } catch (error) {
                return { data: null, error };
            }
        },

        update: async (id: string, payload: any) => {
            try {
                const config = payload instanceof FormData 
                    ? { headers: { 'Content-Type': 'multipart/form-data' } } 
                    : {};
                const res = await httpClient.patch<any>(`/events/${id}`, payload, config);
                return { data: res.data ?? res, error: null };
            } catch (error) {
                return { data: null, error };
            }
        },

        remove: async (id: string) => {
            try {
                const res = await httpClient.delete<any>(`/events/${id}`);
                return { data: res.data ?? res, error: null };
            } catch (error) {
                return { data: null, error };
            }
        }
    }
};

export default eventService;