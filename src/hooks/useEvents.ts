import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EventService } from '@/services/eventService';
import { IEvent, IPaginatedResponse, ICreateEventPayload } from '@/types';

export const useEvents = (page: number = 1, limit: number = 10) => {
    return useQuery<IPaginatedResponse<IEvent>>({
        queryKey: ['events', { page, limit }],
        queryFn: () => EventService.getAllEvents(page, limit),
    });
};

export const useEvent = (id: string) => {
    return useQuery<IEvent>({
        queryKey: ['events', id],
        queryFn: () => EventService.getEventById(id),
        enabled: !!id,
    });
};

export const useCreateEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: EventService.createEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });
};

export const useUpdateEvent = (eventId: string) => {
    const queryClient = useQueryClient();

    return useMutation<IEvent, Error, Partial<ICreateEventPayload>>({
        mutationFn: (payload) => EventService.updateEvent(eventId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events', eventId] });
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });
};

export const useDeleteEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: EventService.deleteEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });
};

export const useMyEvents = () => {
    return useQuery<IEvent[]>({
        queryKey: ['events', 'my-events'],
        queryFn: EventService.getMyEvents,
    });
};
