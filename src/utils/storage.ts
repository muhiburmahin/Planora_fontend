export const StorageUtils = {
    setAccessToken: (token: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', token);
        }
    },

    getAccessToken: () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('accessToken');
        }
        return null;
    },

    setRefreshToken: (token: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('refreshToken', token);
        }
    },

    getRefreshToken: () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('refreshToken');
        }
        return null;
    },

    setUser: (user: any) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(user));
        }
    },

    getUser: () => {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        }
        return null;
    },

    clear: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        }
    },
};
