import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/userService';
import { UserDashboardStats, AdminDashboardStats } from '@/types/user';

export const useGetUserDashboardStats = () => {
    return useQuery({
        queryKey: ['user-dashboard-stats'],
        queryFn: async (): Promise<UserDashboardStats> => {
            const response = await userService.getUserDashboardStats();
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useGetAdminDashboardStats = () => {
    return useQuery({
        queryKey: ['admin-dashboard-stats'],
        queryFn: async (): Promise<AdminDashboardStats> => {
            const response = await userService.getAdminDashboardStats();
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};