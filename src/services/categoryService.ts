import { httpClient } from '@/lib/axios/httpClient';
import { ApiResponse } from '@/types/api.types';

// Use NEXT_PUBLIC_API_URL for server actions
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/categories`;

async function mapFetchResponse(res: Response) {
    const result = await res.json().catch(() => null);
    if (!res.ok) return { data: null, error: { message: result?.message || 'Request failed', status: res.status, raw: result } };
    return { data: result?.data ?? result, error: null };
}

export const categoryService = {
    // Server-side helpers (use in server components / actions)
    server: {
        getAllCategories: async (filters?: any, options?: any) => {
            try {
                const { cookies } = await import("next/headers");
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
                const qs = params.toString() ? `?${params.toString()}` : "";
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
                return { data: null, error: { message: 'Failed to fetch categories', error } };
            }
        },

        getSingleCategory: async (slug: string) => {
            try {
                const { cookies } = await import("next/headers");
                const cookieStore = await cookies();
                const res = await fetch(`${API_URL}/${slug}`, {
                    method: "GET",
                    headers: {
                        Cookie: cookieStore.toString(),
                        Accept: "application/json",
                    },
                    cache: "no-store",
                });
                return await mapFetchResponse(res);
            } catch (error) {
                return { data: null, error: { message: 'Failed to fetch category', error } };
            }
        },

        createCategory: async (payload: any) => {
            try {
                const { cookies } = await import("next/headers");
                const cookieStore = await cookies();
                const res = await fetch(`${API_URL}/create-category`, {
                    method: "POST",
                    headers: {
                        Cookie: cookieStore.toString(),
                        Accept: "application/json",
                    },
                    body: payload instanceof FormData ? payload : JSON.stringify(payload),
                    cache: "no-store",
                });
                return await mapFetchResponse(res);
            } catch (error) {
                return { data: null, error: { message: 'Failed to create category', error } };
            }
        },

        updateCategory: async (id: string, payload: any) => {
            try {
                const { cookies } = await import("next/headers");
                const cookieStore = await cookies();
                const res = await fetch(`${API_URL}/${id}`, {
                    method: "PATCH",
                    headers: {
                        Cookie: cookieStore.toString(),
                        Accept: "application/json",
                    },
                    body: payload instanceof FormData ? payload : JSON.stringify(payload),
                    cache: "no-store",
                });
                return await mapFetchResponse(res);
            } catch (error) {
                return { data: null, error: { message: 'Failed to update category', error } };
            }
        },

        toggleCategoryStatus: async (id: string) => {
            try {
                const { cookies } = await import("next/headers");
                const cookieStore = await cookies();
                const res = await fetch(`${API_URL}/${id}/toggle-status`, {
                    method: "PATCH",
                    headers: {
                        Cookie: cookieStore.toString(),
                        Accept: "application/json",
                    },
                    cache: "no-store",
                });
                return await mapFetchResponse(res);
            } catch (error) {
                return { data: null, error: { message: 'Failed to toggle category status', error } };
            }
        },

        deleteCategory: async (id: string) => {
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
                return { data: null, error: { message: 'Failed to delete category', error } };
            }
        },
    },

    // Client-side methods (use in client components)
    getAllCategories: async (filters?: any, options?: any): Promise<ApiResponse<any>> => {
        return httpClient.get<any>('/categories', { params: { ...filters, ...options } });
    },

    getSingleCategory: async (slug: string): Promise<ApiResponse<any>> => {
        return httpClient.get<any>(`/categories/${slug}`);
    },
    getCategoryById: async (slug: string): Promise<ApiResponse<any>> => {
        return httpClient.get<any>(`/categories/${slug}`);
    },

    createCategory: async (payload: any): Promise<ApiResponse<any>> => {
        if (payload instanceof FormData) {
            return httpClient.post<any>('/categories/create-category', payload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }
        return httpClient.post<any>('/categories/create-category', payload);
    },

    updateCategory: async (id: string, payload: any): Promise<ApiResponse<any>> => {
        if (payload instanceof FormData) {
            return httpClient.patch<any>(`/categories/${id}`, payload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }
        return httpClient.patch<any>(`/categories/${id}`, payload);
    },

    toggleCategoryStatus: async (id: string): Promise<ApiResponse<any>> => {
        return httpClient.patch<any>(`/categories/${id}/toggle-status`);
    },

    deleteCategory: async (id: string): Promise<ApiResponse<any>> => {
        return httpClient.delete<any>(`/categories/${id}`);
    },
};

export default categoryService;