import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: 'ADMIN' | 'USER';
    status: 'ACTIVE' | 'BLOCKED' | 'DELETED' | 'PENDING';
    emailVerified: boolean;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;

    // Actions
    setAuth: (user: User, token: string) => void;
    setToken: (token: string) => void; // নতুন যোগ করা হয়েছে
    setLoading: (loading: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isLoading: false,
            isAuthenticated: false,

            // লগইন এর সময় ইউজার এবং টোকেন একসাথে সেট করার জন্য
            setAuth: (user, token) => set({
                user,
                token,
                isAuthenticated: true,
                isLoading: false
            }),

            // শুধুমাত্র টোকেন আপডেট করার জন্য (যেমন: Refresh Token এর সময়)
            setToken: (token) => set({
                token,
                isAuthenticated: !!token
            }),

            setLoading: (isLoading) => set({ isLoading }),

            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                });
            },
        }),
        {
            name: 'planora-auth',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

// Selector hooks (Performance এর জন্য সেরা)
export const useUser = () => useAuthStore((state) => state.user);
export const useToken = () => useAuthStore((state) => state.token);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);