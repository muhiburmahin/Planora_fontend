import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export const useGetMe = () => {
    return useQuery({
        queryKey: ["user-me"],
        queryFn: async () => {
            try {
                const res = await authClient.getMe();
                return res.data ?? null;
            } catch {
                return null;
            }
        },
        staleTime: 60 * 1000,
    });
};

export const useLoginMutation = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: any) => authClient.login(data),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["user-me"] });
        },
        onError: (error: any) => {
            toast.error(error?.message || "Login failed!");
        }
    });

    return {
        mutate: mutation.mutate,
        isPending: (mutation as any).isPending ?? (mutation as any).isLoading ?? false,
        mutation,
    };
};