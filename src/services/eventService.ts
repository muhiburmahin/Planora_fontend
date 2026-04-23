import { httpClient } from '@/lib/axios/httpClient';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/events`;

async function mapFetchResponse(res: Response) {
    const result = await res.json().catch(() => null);
    if (!res.ok) return { data: null, error: { message: result?.message || 'Request failed', status: res.status, raw: result } };
    return { data: result?.data ?? result, error: null };
}

export const eventService = {
    // Server-side (cookie + fetch) methods
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
                const res = await fetch(`${API_URL}/create-event`, {
                    method: "POST",
                    headers: {
                        Cookie: cookieStore.toString(),
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
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
                const res = await fetch(`${API_URL}/${id}`, {
                    method: "PATCH",
                    headers: {
                        Cookie: cookieStore.toString(),
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
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

    // Client-side helpers (axios/httpClient)
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
                if (payload instanceof FormData) {
                    const res = await httpClient.post<any>('/events/create-event', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
                    return { data: res.data ?? res, error: null };
                }
                const res = await httpClient.post<any>('/events/create-event', payload);
                return { data: res.data ?? res, error: null };
            } catch (error) {
                return { data: null, error };
            }
        },

        update: async (id: string, payload: any) => {
            try {
                if (payload instanceof FormData) {
                    const res = await httpClient.patch<any>(`/events/${id}`, payload, { headers: { 'Content-Type': 'multipart/form-data' } });
                    return { data: res.data ?? res, error: null };
                }
                const res = await httpClient.patch<any>(`/events/${id}`, payload);
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

