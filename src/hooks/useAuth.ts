import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthService } from '@/services/authService';
import { StorageUtils } from '@/utils/storage';
import { User } from '@/types';

export const useAuth = () => {
    const queryClient = useQueryClient();

    const { data: user, isLoading, error } = useQuery<User>({
        queryKey: ['auth', 'user'],
        queryFn: AuthService.getMe,
        enabled: !!StorageUtils.getAccessToken(),
    });

    const loginMutation = useMutation({
        mutationFn: AuthService.login,
        onSuccess: (data) => {
            if (data.accessToken) {
                StorageUtils.setAccessToken(data.accessToken);
            }
            if (data.refreshToken) {
                StorageUtils.setRefreshToken(data.refreshToken);
            }
            if (data.user) {
                StorageUtils.setUser(data.user);
            }
            queryClient.setQueryData(['auth', 'user'], data.user);
        },
    });

    const registerMutation = useMutation({
        mutationFn: AuthService.register,
        onSuccess: (data) => {
            if (data.accessToken) {
                StorageUtils.setAccessToken(data.accessToken);
            }
            if (data.refreshToken) {
                StorageUtils.setRefreshToken(data.refreshToken);
            }
            if (data.user) {
                StorageUtils.setUser(data.user);
            }
            queryClient.setQueryData(['auth', 'user'], data.user);
        },
    });

    const logoutMutation = useMutation({
        mutationFn: AuthService.logout,
        onSuccess: () => {
            StorageUtils.clear();
            queryClient.clear();
        },
    });

    return {
        user,
        isLoading,
        error,
        login: loginMutation.mutate,
        register: registerMutation.mutate,
        logout: logoutMutation.mutate,
        isAuthLoading: loginMutation.isPending || registerMutation.isPending,
        isLogoutLoading: logoutMutation.isPending,
    };
};
