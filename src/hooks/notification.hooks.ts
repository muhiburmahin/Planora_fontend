import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/userService';
import { Notification } from '@/services/userService';

export const useGetMyNotifications = () => {
    return useQuery({
        queryKey: ['user-notifications'],
        queryFn: async (): Promise<Notification[]> => {
            const response = await userService.getMyNotifications();
            return response.data || [];
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchInterval: 30 * 1000, // 30 seconds
    });
};