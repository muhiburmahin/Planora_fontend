import { cookies } from "next/headers";
import authClient from '@/lib/auth-client';
import { httpClient } from '@/lib/axios/httpClient';

// Use NEXT_PUBLIC_API_URL (matches .env.example) for server actions
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`;

async function mapFetchResponse(res: Response) {
    const result = await res.json().catch(() => null);
    if (!res.ok || (result && result.success === false)) {
        return { data: null, error: { message: result?.message || 'Request failed', status: res.status, raw: result } };
    }
    return { data: result?.data ?? result, error: null };
}

export const authService = {
    server: {
        getMe: async () => {
            try {
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
                return { data: null, error: { message: "Failed to fetch session", error } };
            }
        },
        register: async (userData: any) => {
            try {
                const res = await fetch(`${API_URL}/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData),
                    cache: "no-store",
                });
                return await mapFetchResponse(res);
            } catch (error) {
                return { data: null, error: { message: "Internal Server Error", error } };
            }
        },
        login: async (credentials: any) => {
            try {
                const res = await fetch(`${API_URL}/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(credentials),
                    cache: "no-store",
                });
                return await mapFetchResponse(res);
            } catch (error) {
                return { data: null, error: { message: "Login failed due to server error", error } };
            }
        },
        forgetPassword: async (email: string) => {
            try {
                const res = await fetch(`${API_URL}/forget-password`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                    cache: "no-store",
                });
                return await mapFetchResponse(res);
            } catch (error) {
                return { data: null, error: { message: "Something went wrong", error } };
            }
        },
        resetPassword: async (otp: string, newPassword: string) => {
            try {
                const res = await fetch(`${API_URL}/reset-password`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ otp, newPassword }),
                    cache: "no-store",
                });
                return await mapFetchResponse(res);
            } catch (error) {
                return { data: null, error: { message: "Failed to reset password", error } };
            }
        },
        logout: async () => {
            try {
                const cookieStore = await cookies();
                const res = await fetch(`${API_URL}/logout`, {
                    method: "POST",
                    headers: {
                        Cookie: cookieStore.toString(),
                    },
                    cache: "no-store",
                });
                return await mapFetchResponse(res);
            } catch (error) {
                return { data: null, error: { message: "Logout failed", error } };
            }
        }
    },


    
    // Client-side helpers (use from browser; built on top of httpClient/authClient)
    client: {
        login: async (payload: any) => {
            try {
                const res = await authClient.login(payload);
                return { data: res.data ?? res, error: null };
            } catch (error) {
                return { data: null, error };
            }
        },
        register: async (payload: any) => {
            try {
                const res = await authClient.register(payload);
                return { data: res.data ?? res, error: null };
            } catch (error) {
                return { data: null, error };
            }
        },
        getMe: async () => {
            try {
                const res = await authClient.getMe();
                return { data: res.data ?? res, error: null };
            } catch (error) {
                return { data: null, error };
            }
        },
        logout: async () => {
            try {
                const res = await authClient.logout();
                return { data: res, error: null };
            } catch (error) {
                return { data: null, error };
            }
        },
        forgetPassword: async (email: string) => {
            try {
                const res = await httpClient.post('/auth/forget-password', { email });
                return { data: res.data ?? res, error: null };
            } catch (error) {
                return { data: null, error };
            }
        },
        resetPassword: async (otp: string, newPassword: string) => {
            try {
                const res = await httpClient.post('/auth/reset-password', { otp, newPassword });
                return { data: res.data ?? res, error: null };
            } catch (error) {
                return { data: null, error };
            }
        },
        changePassword: async (oldPassword: string, newPassword: string) => {
            try {
                const res = await httpClient.post('/auth/change-password', { oldPassword, newPassword });
                return { data: res.data ?? res, error: null };
            } catch (error) {
                return { data: null, error };
            }
        }
    }
};