import axios, { AxiosInstance, AxiosError } from 'axios';
import { envVars } from '../env';


const createAxiosInstance = (): AxiosInstance => {
    const instance = axios.create({
        baseURL: envVars.NEXT_PUBLIC_API_URL,
        timeout: 30000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Request Interceptor
    instance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Response Interceptor
    instance.interceptors.response.use(
        (response) => response.data,
        (error: AxiosError) => {
            if (error.response?.status === 401) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }
            throw error;
        }
    );

    return instance;
};

export const apiClient = createAxiosInstance();
