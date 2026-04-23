import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { participationService } from '@/services/participationService';
import { Participation, CreateParticipationPayload } from '@/types/participition';

export const useGetMyParticipations = () => {
    return useQuery({
        queryKey: ['my-participations'],
        queryFn: async (): Promise<Participation[]> => {
            const response = await participationService.getMyParticipations();
            return response.data || [];
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useGetParticipationById = (id: string) => {
    return useQuery({
        queryKey: ['participation', id],
        queryFn: async (): Promise<Participation> => {
            const response = await participationService.getParticipationById(id);
            return response.data;
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useCreateParticipation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateParticipationPayload): Promise<Participation> => {
            const response = await participationService.createParticipation(payload);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-participations'] });
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });
};

export const useUpdateParticipationStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }): Promise<Participation> => {
            const response = await participationService.updateParticipationStatus(id, status);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-participations'] });
            queryClient.invalidateQueries({ queryKey: ['participations'] });
        },
    });
};

export const useCancelParticipation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string): Promise<void> => {
            await participationService.cancelParticipation(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-participations'] });
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });
};