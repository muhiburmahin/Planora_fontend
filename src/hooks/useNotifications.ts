import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationService } from '@/services/notificationService';
import { INotification } from '@/types';

export const useNotifications = (page: number = 1, limit: number = 20) => {
    return useQuery({
        queryKey: ['notifications', { page, limit }],
        queryFn: () => NotificationService.getNotifications(page, limit),
    });
};

export const useMarkNotificationAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: NotificationService.markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
};
