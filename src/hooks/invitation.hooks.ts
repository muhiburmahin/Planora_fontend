import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invitationService } from '@/services/invitationService';
import { Invitation, CreateInvitationPayload, UpdateInvitationStatusPayload } from '@/types/invitation';

export const useGetMyInvitations = () => {
    return useQuery({
        queryKey: ['my-invitations'],
        queryFn: async (): Promise<Invitation[]> => {
            const response = await invitationService.getMyInvitations();
            return response.data || [];
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useGetInvitationById = (id: string) => {
    return useQuery({
        queryKey: ['invitation', id],
        queryFn: async (): Promise<Invitation> => {
            const response = await invitationService.getInvitationById(id);
            return response.data;
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useCreateInvitation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateInvitationPayload): Promise<Invitation> => {
            const response = await invitationService.createInvitation(payload);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invitations'] });
        },
    });
};

export const useUpdateInvitationStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }): Promise<Invitation> => {
            const response = await invitationService.updateInvitationStatus(id, status);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-invitations'] });
            queryClient.invalidateQueries({ queryKey: ['invitations'] });
        },
    });
};
