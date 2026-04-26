import { httpClient } from "./axios/httpClient";
import axios from 'axios'

export type LoginPayload = { email: string; password: string };
export type RegisterPayload = { name: string; email: string; password: string };

const setTokens = (accessToken?: string | null, refreshToken?: string | null) => {
    if (typeof window === "undefined") return;
    if (accessToken) localStorage.setItem("accessToken", accessToken);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    if (accessToken) document.cookie = `accessToken=${accessToken}; path=/; max-age=604800; samesite=lax`;
    if (refreshToken) document.cookie = `refreshToken=${refreshToken}; path=/; max-age=2592000; samesite=lax`;
};

export const authClient: any = {
    login: async (payload: LoginPayload) => {
        const res = await httpClient.post<any>("/auth/login", payload);
        if (res?.data?.accessToken) setTokens(res.data.accessToken, res.data.refreshToken);
        return res;
    },
    register: async (payload: RegisterPayload) => {
        const res = await httpClient.post<any>("/auth/register", payload);
        // Registration must not auto-login before email verification.
        try {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        } catch { }
        return res;
    },
    getMe: async () => {
        const res = await httpClient.get<any>("/auth/me");
        return res;
    },
    logout: async () => {
        // Call logout without attaching the Authorization header to ensure
        // server can clear HttpOnly cookies even if access token is expired.
        const base = process.env.NEXT_PUBLIC_API_URL || ''
        try {
            await axios.post(`${base}/auth/logout`, {}, { withCredentials: true })
        } catch (err) {
            // ignore network errors here; we'll still clear client-side tokens
            console.warn('Logout request failed', err)
        }

        try {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        } catch { }
        try {
            document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        } catch { }

        return { success: true }
    }
};

// Additional auth helpers
authClient.forgetPassword = async (email: string) => {
    const res = await httpClient.post<any>("/auth/forget-password", { email });
    return res;
}

authClient.resetPassword = async (otp: string, newPassword: string) => {
    const res = await httpClient.post<any>("/auth/reset-password", { otp, newPassword });
    return res;
}

authClient.changePassword = async (oldPassword: string, newPassword: string) => {
    const res = await httpClient.post<any>("/auth/change-password", { oldPassword, newPassword });
    return res;
}

export default authClient;
// NOTE: removed duplicate createAuthClient usage to avoid re-declaration.