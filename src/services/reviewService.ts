import { httpClient } from '@/lib/axios/httpClient';
import { ApiResponse } from '@/types/api.types';
import { Review, CreateReviewPayload, UpdateReviewPayload, ReviewOptions, ReviewResponse, ReviewStats } from '@/types/review';

// Use NEXT_PUBLIC_API_URL for server actions
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/reviews`;

async function mapFetchResponse(res: Response) {
    const result = await res.json().catch(() => null);
    if (!res.ok) return { data: null, error: { message: result?.message || 'Request failed', status: res.status, raw: result } };
    return { data: result?.data ?? result, error: null };
}

export const reviewService = {
    // Server-side helpers (use in server components / actions)
    server: {
        createReview: async (payload: CreateReviewPayload) => {
            try {
                const { cookies } = await import("next/headers");
                const cookieStore = await cookies();
                const res = await fetch(`${API_URL}`, {
                    method: "POST",
                    headers: {
                        Cookie: cookieStore.toString(),
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify(payload),
                    cache: "no-store",
                });
                return await mapFetchResponse(res);
            } catch (error) {
                return { data: null, error: { message: 'Failed to create review', error } };
            }
        },

        getEventReviews: async (eventId: string, options?: ReviewOptions) => {
            try {
                const { cookies } = await import("next/headers");
                const cookieStore = await cookies();
                const qs = options ? `?${new URLSearchParams(Object.entries(options).reduce((acc, [k, v]) => {
                    if (v !== undefined && v !== null) acc[k] = String(v);
                    return acc;
                }, {} as Record<string, string>))}` : "";
                const res = await fetch(`${API_URL}/${eventId}${qs}`, {
                    method: "GET",
                    headers: {
                        Cookie: cookieStore.toString(),
                        Accept: "application/json",
                    },
                    cache: "no-store",
                });
                return await mapFetchResponse(res);
            } catch (error) {
                return { data: null, error: { message: 'Failed to fetch reviews', error } };
            }
        },

        getSingleReview: async (id: string) => {
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
                return { data: null, error: { message: 'Failed to fetch review', error } };
            }
        },

        getReviewStats: async (eventId: string) => {
            try {
                const { cookies } = await import("next/headers");
                const cookieStore = await cookies();
                const res = await fetch(`${API_URL}/stats/${eventId}`, {
                    method: "GET",
                    headers: {
                        Cookie: cookieStore.toString(),
                        Accept: "application/json",
                    },
                    cache: "no-store",
                });
                return await mapFetchResponse(res);
            } catch (error) {
                return { data: null, error: { message: 'Failed to fetch review stats', error } };
            }
        },

        getMyReviews: async (options?: ReviewOptions) => {
            try {
                const { cookies } = await import("next/headers");
                const cookieStore = await cookies();
                const qs = options ? `?${new URLSearchParams(Object.entries(options).reduce((acc, [k, v]) => {
                    if (v !== undefined && v !== null) acc[k] = String(v);
                    return acc;
                }, {} as Record<string, string>))}` : "";
                const res = await fetch(`${API_URL}/my-reviews${qs}`, {
                    method: "GET",
                    headers: {
                        Cookie: cookieStore.toString(),
                        Accept: "application/json",
                    },
                    cache: "no-store",
                });
                return await mapFetchResponse(res);
            } catch (error) {
                return { data: null, error: { message: 'Failed to fetch my reviews', error } };
            }
        },

        updateReview: async (id: string, payload: UpdateReviewPayload) => {
            try {
                const { cookies } = await import("next/headers");
                const cookieStore = await cookies();
                const res = await fetch(`${API_URL}/${id}`, {
                    method: "PATCH",
                    headers: {
                        Cookie: cookieStore.toString(),
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify(payload),
                    cache: "no-store",
                });
                return await mapFetchResponse(res);
            } catch (error) {
                return { data: null, error: { message: 'Failed to update review', error } };
            }
        },

        deleteReview: async (id: string) => {
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
                return { data: null, error: { message: 'Failed to delete review', error } };
            }
        },

        deleteReviewByAdmin: async (id: string) => {
            try {
                const { cookies } = await import("next/headers");
                const cookieStore = await cookies();
                const res = await fetch(`${API_URL}/admin/${id}`, {
                    method: "DELETE",
                    headers: {
                        Cookie: cookieStore.toString(),
                        Accept: "application/json",
                    },
                    cache: "no-store",
                });
                return await mapFetchResponse(res);
            } catch (error) {
                return { data: null, error: { message: 'Failed to delete review by admin', error } };
            }
        },
    },

    // Client-side methods (use in client components)
    createReview: async (payload: CreateReviewPayload): Promise<ApiResponse<Review>> => {
        return httpClient.post<Review>('/reviews', payload);
    },

    getEventReviews: async (eventId: string, options?: ReviewOptions): Promise<ApiResponse<ReviewResponse>> => {
        return httpClient.get<ReviewResponse>(`/reviews/${eventId}`, { params: options });
    },

    getSingleReview: async (id: string): Promise<ApiResponse<Review>> => {
        return httpClient.get<Review>(`/reviews/${id}`);
    },

    getReviewStats: async (eventId: string): Promise<ApiResponse<ReviewStats>> => {
        return httpClient.get<ReviewStats>(`/reviews/stats/${eventId}`);
    },

    getMyReviews: async (options?: ReviewOptions): Promise<ApiResponse<ReviewResponse>> => {
        return httpClient.get<ReviewResponse>('/reviews/my-reviews', { params: options });
    },

    updateReview: async (id: string, payload: UpdateReviewPayload): Promise<ApiResponse<Review>> => {
        return httpClient.patch<Review>(`/reviews/${id}`, payload);
    },

    deleteReview: async (id: string): Promise<ApiResponse<any>> => {
        return httpClient.delete<any>(`/reviews/${id}`);
    },

    deleteReviewByAdmin: async (id: string): Promise<ApiResponse<any>> => {
        return httpClient.delete<any>(`/reviews/admin/${id}`);
    },
};