import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: 'ADMIN' | 'USER';
    status: 'ACTIVE' | 'BLOCKED' | 'DELETED' | 'PENDING';
    emailVerified: boolean;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;

    // Actions
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    setLoading: (loading: boolean) => void;
    logout: () => void;
    hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isLoading: false,
            isAuthenticated: false,

            setUser: (user) => set({ user, isAuthenticated: !!user }),
            setToken: (token) => set({ token }),
            setLoading: (isLoading) => set({ isLoading }),

            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                });
                // Clear from local storage
                localStorage.removeItem('auth-storage');
                localStorage.removeItem('token');
            },

            hydrate: async () => {
                // Hydrate from localStorage on app start
                const storedToken = localStorage.getItem('token');
                if (storedToken) {
                    set({ token: storedToken, isAuthenticated: true });
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
            }),
        }
    )
);

// Selector hooks for better performance
export const useUser = () => useAuthStore((state) => state.user);
export const useToken = () => useAuthStore((state) => state.token);
export const useIsAuthenticated = () =>
    useAuthStore((state) => state.isAuthenticated);
