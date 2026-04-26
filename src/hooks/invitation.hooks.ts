import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invitationService } from '@/services/invitationService';
import { Invitation, SendInvitationPayload } from '@/types/invitation';

export const useGetMyInvitations = () => {
    return useQuery({
        queryKey: ['my-invitations'],
        queryFn: async (): Promise<Invitation[]> => {
            const response = await invitationService.getMyInvitations();
            return response.data ?? [];
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useGetInvitationById = (id: string) => {
    return useQuery({
        queryKey: ['invitation', id],
        queryFn: async (): Promise<Invitation> => {
            const response = await invitationService.getSingleInvitation(id);
            return response.data as Invitation;
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useCreateInvitation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: SendInvitationPayload): Promise<Invitation> => {
            const response = await invitationService.sendInvitation(payload);
            return response.data as Invitation;
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
            const response = await invitationService.respondToInvitation(id, {
                status: status === "APPROVED" ? "APPROVED" : "REJECTED",
            });
            return response.data as Invitation;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-invitations'] });
            queryClient.invalidateQueries({ queryKey: ['invitations'] });
        },
    });
};
