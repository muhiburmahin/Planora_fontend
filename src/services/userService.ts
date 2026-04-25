import { httpClient } from '@/lib/axios/httpClient';
import { ApiResponse } from '@/types/api.types';
import { 
    User, 
    UpdateUserPayload, 
    ChangeUserStatusPayload, 
    AdminDashboardStats, 
    UserDashboardStats
} from '@/types/user';

// Use NEXT_PUBLIC_API_URL for server actions
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/users`;

async function mapFetchResponse(res: Response) {
    const result = await res.json().catch(() => null);
    if (!res.ok) return { data: null, error: { message: result?.message || 'Request failed', status: res.status, raw: result } };
    return { data: result?.data ?? result, error: null };
}

export const userService = {
    // Server-side helpers (use in server components / actions)
    server: {
        getMyProfile: async () => {
            try {
                const { cookies } = await import("next/headers");
                const cookieStore = await cookies();
                const res = await fetch(`${API_URL}/me`, {
                    method: "GET",
                    headers: {
                        Cookie: cookieStore.toString(),
                        Accept: "application/json",
                    },
                    cache: "no-store",
                });
                return await mapFetchResponse(res);
            } catch (error) {
                return { data: null, error: { message: 'Failed to fetch profile', error } };
            }
        },

        updateMyProfile: async (payload: UpdateUserPayload) => {
            try {
                const { cookies } = await import("next/headers");
                const cookieStore = await cookies();
                const res = await fetch(`${API_URL}/update-me`, {
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
                return { data: null, error: { message: 'Failed to update profile', error } };
            }
        },

        getDashboardStats: async () => {
            try {
                const { cookies } = await import("next/headers");
                const cookieStore = await cookies();
                const res = await fetch(`${API_URL}/dashboard-summary`, {
                    method: "GET",
                    headers: {
                        Cookie: cookieStore.toString(),
                        Accept: "application/json",
                    },
                    cache: "no-store",
                });
                return await mapFetchResponse(res);
            } catch (error) {
                return { data: null, error: { message: 'Failed to fetch dashboard stats', error } };
            }
        },

        getAllUsers: async () => {
            try {
                const { cookies } = await import("next/headers");
                const cookieStore = await cookies();
                const res = await fetch(`${API_URL}`, {
                    method: "GET",
                    headers: {
                        Cookie: cookieStore.toString(),
                        Accept: "application/json",
                    },
                    cache: "no-store",
                });
                return await mapFetchResponse(res);
            } catch (error) {
                return { data: null, error: { message: 'Failed to fetch users', error } };
            }
        },

        changeUserStatus: async (id: string, payload: ChangeUserStatusPayload) => {
            try {
                const { cookies } = await import("next/headers");
                const cookieStore = await cookies();
                const res = await fetch(`${API_URL}/${id}/status`, {
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
                return { data: null, error: { message: 'Failed to change user status', error } };
            }
        },

        getMyNotifications: async () => {
            try {
                const { cookies } = await import("next/headers");
                const cookieStore = await cookies();
                const res = await fetch(`${API_URL}/notifications`, {
                    method: "GET",
                    headers: {
                        Cookie: cookieStore.toString(),
                        Accept: "application/json",
                    },
                    cache: "no-store",
                });
                return await mapFetchResponse(res);
            } catch (error) {
                return { data: null, error: { message: 'Failed to fetch notifications', error } };
            }
        },

        markNotificationAsRead: async (id: string) => {
            try {
                const { cookies } = await import("next/headers");
                const cookieStore = await cookies();
                const res = await fetch(`${API_URL}/notifications/${id}`, {
                    method: "PATCH",
                    headers: {
                        Cookie: cookieStore.toString(),
                        Accept: "application/json",
                    },
                    cache: "no-store",
                });
                return await mapFetchResponse(res);
            } catch (error) {
                return { data: null, error: { message: 'Failed to mark notification as read', error } };
            }
        },
    },

    // Client-side methods (use in client components)
    getMyProfile: async (): Promise<ApiResponse<User>> => {
        return httpClient.get<User>('/users/me');
    },

    updateMyProfile: async (payload: UpdateUserPayload): Promise<ApiResponse<User>> => {
        return httpClient.patch<User>('/users/update-me', payload);
    },

    getDashboardStats: async (): Promise<ApiResponse<AdminDashboardStats | UserDashboardStats>> => {
        return httpClient.get<AdminDashboardStats | UserDashboardStats>('/users/dashboard-summary');
    },

    getAllUsers: async (): Promise<ApiResponse<User[]>> => {
        return httpClient.get<User[]>('/users');
    },

    changeUserStatus: async (
        id: string,
        payload: ChangeUserStatusPayload
    ): Promise<ApiResponse<User>> => {
        return httpClient.patch<User>(`/users/${id}/status`, payload);
    },

    getMyNotifications: async (): Promise<ApiResponse<Notification[]>> => {
        return httpClient.get<Notification[]>('/users/notifications');
    },

    markNotificationAsRead: async (id: string): Promise<ApiResponse<any>> => {
        return httpClient.patch<any>(`/users/notifications/${id}`);
    },

    getUserDashboardStats: async (): Promise<ApiResponse<UserDashboardStats>> => {
        return httpClient.get<UserDashboardStats>('/users/dashboard-summary');
    },

    getAdminDashboardStats: async (): Promise<ApiResponse<AdminDashboardStats>> => {
        return httpClient.get<AdminDashboardStats>('/users/admin/dashboard-summary');
    },
};