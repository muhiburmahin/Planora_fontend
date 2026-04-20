import { httpClient } from "./axios/httpClient";

export type LoginPayload = { email: string; password: string };
export type RegisterPayload = { name: string; email: string; password: string };

const setTokens = (accessToken?: string | null, refreshToken?: string | null) => {
    if (typeof window === "undefined") return;
    if (accessToken) localStorage.setItem("accessToken", accessToken);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
};

export const authClient = {
    login: async (payload: LoginPayload) => {
        const res = await httpClient.post<any>("/auth/login", payload);
        if (res?.data?.accessToken) setTokens(res.data.accessToken, res.data.refreshToken);
        return res;
    },
    register: async (payload: RegisterPayload) => {
        const res = await httpClient.post<any>("/auth/register", payload);
        if (res?.data?.accessToken) setTokens(res.data.accessToken, res.data.refreshToken);
        return res;
    },
    getMe: async () => {
        const res = await httpClient.get<any>("/auth/me");
        return res;
    },
    logout: async () => {
        const res = await httpClient.post<any>("/auth/logout", {});
        try {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        } catch { }
        return res;
    }
};

export default authClient;
// NOTE: removed duplicate createAuthClient usage to avoid re-declaration.