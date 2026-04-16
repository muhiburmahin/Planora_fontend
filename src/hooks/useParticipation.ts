import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ParticipationService } from '@/services/participationService';
import { IParticipation } from '@/types';

export const useJoinEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ParticipationService.joinEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['participations'] });
        },
    });
};

export const useMyParticipations = (page: number = 1, limit: number = 10) => {
    return useQuery({
        queryKey: ['participations', 'my', { page, limit }],
        queryFn: () => ParticipationService.getMyParticipations(page, limit),
    });
};

export const useLeaveEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ParticipationService.leaveEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['participations'] });
        },
    });
};
