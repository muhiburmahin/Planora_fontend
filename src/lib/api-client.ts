import { httpClient, ApiRequestOptions } from "./axios/httpClient";

export const eventsApi = {
    list: async (params?: Record<string, any>) => {
        return httpClient.get<any>("/events", { params });
    },
    get: async (id: string) => {
        return httpClient.get<any>(`/events/${id}`);
    },
    create: async (data: any) => {
        return httpClient.post<any>("/events/create-event", data);
    },
    update: async (id: string, data: any) => {
        return httpClient.patch<any>(`/events/${id}`, data);
    },
    remove: async (id: string) => {
        return httpClient.delete<any>(`/events/${id}`);
    }
};

export default {
    events: eventsApi,
};
