import { httpClient } from '@/lib/axios/httpClient';
import { ApiResponse } from '@/types/api.types';

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: string;
  link: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationFilters {
  isRead?: string;
  type?: string;
  searchTerm?: string;
}

export interface NotificationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface NotificationResponse {
  meta: {
    page: number;
    limit: number;
    total: number;
    unreadCount: number;
  };
  data: Notification[];
}

export interface UnreadCountResponse {
  count: number;
  timestamp: string;
}

export interface MarkAllReadResponse {
  message: string;
  count: number;
}

export interface ClearAllResponse {
  message: string;
  deletedCount: number;
}

export interface DeleteResponse {
  id: string;
  deletedAt: string;
  status: string;
}

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/notifications`;

async function mapFetchResponse(res: Response) {
  const result = await res.json().catch(() => null);
  if (!res.ok) return { data: null, error: { message: result?.message || 'Request failed', status: res.status, raw: result } };
  return { data: result?.data ?? result, error: null };
}

const getMyNotifications = async (
  filters?: NotificationFilters,
  options?: NotificationOptions
): Promise<ApiResponse<NotificationResponse>> => {
  return httpClient.get<NotificationResponse>('/notifications', {
    params: { ...filters, ...options }
  });
};

const getUnreadCount = async (): Promise<ApiResponse<UnreadCountResponse>> => {
  return httpClient.get<UnreadCountResponse>('/notifications/unread-count');
};

const markAsRead = async (id: string): Promise<ApiResponse<Notification>> => {
  return httpClient.patch<Notification>(`/notifications/${id}`);
};

const markAllAsRead = async (): Promise<ApiResponse<MarkAllReadResponse>> => {
  return httpClient.patch<MarkAllReadResponse>('/notifications/mark-all-read');
};

const deleteNotification = async (id: string): Promise<ApiResponse<DeleteResponse>> => {
  return httpClient.delete<DeleteResponse>(`/notifications/${id}`);
};

const clearAllNotifications = async (): Promise<ApiResponse<ClearAllResponse>> => {
  return httpClient.delete<ClearAllResponse>('/notifications/clear-all');
};

const serverGetMyNotifications = async (filters?: NotificationFilters, options?: NotificationOptions) => {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const qs = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_URL}${qs}`, {
      method: 'GET',
      headers: {
        Cookie: cookieStore.toString(),
        Accept: 'application/json',
      },
      cache: 'no-store',
    });
    return await mapFetchResponse(res);
  } catch (error) {
    return { data: null, error: { message: 'Failed to fetch notifications', error } };
  }
};

const serverGetUnreadCount = async () => {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/unread-count`, {
      method: 'GET',
      headers: {
        Cookie: cookieStore.toString(),
        Accept: 'application/json',
      },
      cache: 'no-store',
    });
    return await mapFetchResponse(res);
  } catch (error) {
    return { data: null, error: { message: 'Failed to fetch unread count', error } };
  }
};

const serverMarkAsRead = async (id: string) => {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        Cookie: cookieStore.toString(),
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      cache: 'no-store',
    });
    return await mapFetchResponse(res);
  } catch (error) {
    return { data: null, error: { message: 'Failed to mark notification as read', error } };
  }
};

const serverMarkAllAsRead = async () => {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/mark-all-read`, {
      method: 'PATCH',
      headers: {
        Cookie: cookieStore.toString(),
        Accept: 'application/json',
      },
      cache: 'no-store',
    });
    return await mapFetchResponse(res);
  } catch (error) {
    return { data: null, error: { message: 'Failed to mark all notifications as read', error } };
  }
};

const serverDeleteNotification = async (id: string) => {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Cookie: cookieStore.toString(),
        Accept: 'application/json',
      },
      cache: 'no-store',
    });
    return await mapFetchResponse(res);
  } catch (error) {
    return { data: null, error: { message: 'Failed to delete notification', error } };
  }
};

const serverClearAllNotifications = async () => {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/clear-all`, {
      method: 'DELETE',
      headers: {
        Cookie: cookieStore.toString(),
        Accept: 'application/json',
      },
      cache: 'no-store',
    });
    return await mapFetchResponse(res);
  } catch (error) {
    return { data: null, error: { message: 'Failed to clear notifications', error } };
  }
};

export const notificationService = {
  server: {
    getMyNotifications: serverGetMyNotifications,
    getUnreadCount: serverGetUnreadCount,
    markAsRead: serverMarkAsRead,
    markAllAsRead: serverMarkAllAsRead,
    deleteNotification: serverDeleteNotification,
    clearAllNotifications: serverClearAllNotifications,
  },
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
};