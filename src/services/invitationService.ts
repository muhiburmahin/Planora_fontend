import { httpClient } from '@/lib/axios/httpClient';
import { ApiResponse } from '@/types/api.types';
import { Invitation, SendInvitationPayload, RespondInvitationPayload, InvitationFilterRequest, InvitationOptions, InvitationResponse } from '@/types/invitation';

// Use NEXT_PUBLIC_API_URL for server actions
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/invitations`;

async function mapFetchResponse(res: Response) {
    const result = await res.json().catch(() => null);
    if (!res.ok) return { data: null, error: { message: result?.message || 'Request failed', status: res.status, raw: result } };
    return { data: result?.data ?? result, error: null };
}

export const invitationService = {
    // Server-side helpers (use in server components / actions)
    server: {
        sendInvitation: async (payload: SendInvitationPayload) => {
            try {
                const { cookies } = await import("next/headers");
                const cookieStore = await cookies();
                const res = await fetch(`${API_URL}/send`, {
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
                return { data: null, error: { message: 'Failed to send invitation', error } };
            }
        },

        respondToInvitation: async (id: string, payload: RespondInvitationPayload) => {
            try {
                const { cookies } = await import("next/headers");
                const cookieStore = await cookies();
                const res = await fetch(`${API_URL}/${id}/respond`, {
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
                return { data: null, error: { message: 'Failed to respond to invitation', error } };
            }
        },

        getMyInvitations: async () => {
            try {
                const { cookies } = await import("next/headers");
                const cookieStore = await cookies();
                const res = await fetch(`${API_URL}/inbox`, {
                    method: "GET",
                    headers: {
                        Cookie: cookieStore.toString(),
                        Accept: "application/json",
                    },
                    cache: "no-store",
                });
                return await mapFetchResponse(res);
            } catch (error) {
                return { data: null, error: { message: 'Failed to fetch invitations', error } };
            }
        },

        getSentInvitations: async () => {
            try {
                const { cookies } = await import("next/headers");
                const cookieStore = await cookies();
                const res = await fetch(`${API_URL}/sent`, {
                    method: "GET",
                    headers: {
                        Cookie: cookieStore.toString(),
                        Accept: "application/json",
                    },
                    cache: "no-store",
                });
                return await mapFetchResponse(res);
            } catch (error) {
                return { data: null, error: { message: 'Failed to fetch sent invitations', error } };
            }
        },

        getAllInvitations: async (filters?: InvitationFilterRequest, options?: InvitationOptions) => {
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
                return { data: null, error: { message: 'Failed to fetch all invitations', error } };
            }
        },

        getSingleInvitation: async (id: string) => {
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
                return { data: null, error: { message: 'Failed to fetch invitation', error } };
            }
        },

        withdrawInvitation: async (id: string) => {
            try {
                const { cookies } = await import("next/headers");
                const cookieStore = await cookies();
                const res = await fetch(`${API_URL}/${id}/withdraw`, {
                    method: "DELETE",
                    headers: {
                        Cookie: cookieStore.toString(),
                        Accept: "application/json",
                    },
                    cache: "no-store",
                });
                return await mapFetchResponse(res);
            } catch (error) {
                return { data: null, error: { message: 'Failed to withdraw invitation', error } };
            }
        },

        cleanupInvitations: async () => {
            try {
                const { cookies } = await import("next/headers");
                const cookieStore = await cookies();
                const res = await fetch(`${API_URL}/cleanup`, {
                    method: "DELETE",
                    headers: {
                        Cookie: cookieStore.toString(),
                        Accept: "application/json",
                    },
                    cache: "no-store",
                });
                return await mapFetchResponse(res);
            } catch (error) {
                return { data: null, error: { message: 'Failed to cleanup invitations', error } };
            }
        },
    },

    // Client-side methods (use in client components)
    sendInvitation: async (payload: SendInvitationPayload): Promise<ApiResponse<Invitation>> => {
        return httpClient.post<Invitation>('/invitations/send', payload);
    },

    respondToInvitation: async (
        id: string,
        payload: RespondInvitationPayload
    ): Promise<ApiResponse<Invitation>> => {
        return httpClient.patch<Invitation>(`/invitations/${id}/respond`, payload);
    },

    getMyInvitations: async (): Promise<ApiResponse<Invitation[]>> => {
        return httpClient.get<Invitation[]>('/invitations/inbox');
    },

    getSentInvitations: async (): Promise<ApiResponse<Invitation[]>> => {
        return httpClient.get<Invitation[]>('/invitations/sent');
    },

    getAllInvitations: async (
        filters?: InvitationFilterRequest,
        options?: InvitationOptions
    ): Promise<ApiResponse<InvitationResponse>> => {
        return httpClient.get<InvitationResponse>('/invitations', {
            params: { ...filters, ...options }
        });
    },

    getSingleInvitation: async (id: string): Promise<ApiResponse<Invitation>> => {
        return httpClient.get<Invitation>(`/invitations/${id}`);
    },

    withdrawInvitation: async (id: string): Promise<ApiResponse<any>> => {
        return httpClient.delete<any>(`/invitations/${id}/withdraw`);
    },

    cleanupInvitations: async (): Promise<ApiResponse<any>> => {
        return httpClient.delete<any>('/invitations/cleanup');
    },
};