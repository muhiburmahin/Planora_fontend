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

export const notificationService = {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
};