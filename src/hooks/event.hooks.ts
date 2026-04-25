import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '@/services/eventService';
import { Event, CreateEventPayload, UpdateEventPayload } from '@/types/event';

export const useGetMyEvents = () => {
    return useQuery({
        queryKey: ['my-events'],
        queryFn: async (): Promise<Event[]> => {
            const response = await eventService.getMyEvents();
            return response.data ?? [];
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useGetEventById = (id: string) => {
    return useQuery({
        queryKey: ['event', id],
        queryFn: async (): Promise<Event> => {
            const response = await eventService.getEventById(id);
            return response.data as Event;
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useGetEventsByCategory = (categorySlug: string, filters?: any) => {
    return useQuery({
        queryKey: ['events', 'category', categorySlug, filters],
        queryFn: async (): Promise<Event[]> => {
            const response = await eventService.client.getEventsByCategory(categorySlug, filters);
            return response.data?.data ?? [];
        },
        enabled: !!categorySlug,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

export const useCreateEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateEventPayload): Promise<Event> => {
            const response = await eventService.createEvent(payload);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-events'] });
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });
};

export const useUpdateEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, payload }: { id: string; payload: UpdateEventPayload }): Promise<Event> => {
            const response = await eventService.updateEvent(id, payload);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-events'] });
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });
};

export const useDeleteEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string): Promise<void> => {
            await eventService.deleteEvent(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-events'] });
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });
};