import { cookies } from "next/headers";
import { env } from "process";

const API_URL = `${env.API_URL}/auth`;

export const authService = {
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

            const result = await res.json();
            if (!res.ok || !result.success) {
                return { data: null, error: { message: result.message || "Session not found" } };
            }
            return { data: result.data, error: null };
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

            const result = await res.json();
            if (!res.ok) {
                return { data: null, error: { message: result.message || "Registration failed" } };
            }
            return { data: result.data, error: null };
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

            const result = await res.json();
            if (!res.ok) {
                return { data: null, error: { message: result.message || "Login failed" } };
            }
            return { data: result.data, error: null };
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

            const result = await res.json();
            if (!res.ok) return { data: null, error: { message: result.message } };
            return { data: result, error: null };
        } catch (error) {
            return { data: null, error: { message: "Something went wrong" } };
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

            const result = await res.json();
            if (!res.ok) return { data: null, error: { message: result.message } };
            return { data: result, error: null };
        } catch (error) {
            return { data: null, error: { message: "Failed to reset password" } };
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

            const result = await res.json();
            return { data: result, error: null };
        } catch (error) {
            return { data: null, error: { message: "Logout failed" } };
        }
    }
};