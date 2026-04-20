import { ApiResponse } from '@/types/api.types';
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined in environment variables');
}

const instance: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem('accessToken');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        const customError = {
            success: false,
            message: error.response?.data?.message || "Internal Server Error!",
            status: error.response?.status || 500,
            errorSources: error.response?.data?.errorSources || []
        };
        return Promise.reject(customError);
    }
);

export interface ApiRequestOptions {
    params?: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
        searchTerm?: string;
        [key: string]: any;
    };
    headers?: Record<string, string>;
}

const httpGet = async <TData>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    const response = await instance.get<ApiResponse<TData>>(endpoint, {
        params: options?.params,
        headers: options?.headers,
    });
    return response.data;
}

const httpPost = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    const response = await instance.post<ApiResponse<TData>>(endpoint, data, {
        params: options?.params,
        headers: options?.headers,
    });
    return response.data;
}

const httpPut = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    const response = await instance.put<ApiResponse<TData>>(endpoint, data, {
        params: options?.params,
        headers: options?.headers,
    });
    return response.data;
}

const httpPatch = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    const response = await instance.patch<ApiResponse<TData>>(endpoint, data, {
        params: options?.params,
        headers: options?.headers,
    });
    return response.data;
}

const httpDelete = async <TData>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    const response = await instance.delete<ApiResponse<TData>>(endpoint, {
        params: options?.params,
        headers: options?.headers,
    });
    return response.data;
}

export const httpClient = {
    get: httpGet,
    post: httpPost,
    put: httpPut,
    patch: httpPatch,
    delete: httpDelete,
};