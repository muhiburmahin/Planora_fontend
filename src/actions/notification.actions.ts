"use server";
import { notificationService, NotificationFilters, NotificationOptions } from '@/services/notificationService';
import { revalidatePath } from 'next/cache';

export const getMyNotificationsAction = async (filters?: NotificationFilters, options?: NotificationOptions) => {
  const response = await notificationService.server.getMyNotifications(filters, options);

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data;
};

export const getUnreadCountAction = async () => {
  const response = await notificationService.server.getUnreadCount();

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data;
};

export const markAsReadAction = async (id: string) => {
  const response = await notificationService.server.markAsRead(id);

  if (response.error) {
    return { success: false, message: response.error.message };
  }

  revalidatePath('/notifications');
  return { success: true, message: 'Notification marked as read', data: response.data };
};

export const markAllAsReadAction = async () => {
  const response = await notificationService.server.markAllAsRead();

  if (response.error) {
    return { success: false, message: response.error.message };
  }

  revalidatePath('/notifications');
  return { success: true, message: 'All notifications marked as read', data: response.data };
};

export const deleteNotificationAction = async (id: string) => {
  const response = await notificationService.server.deleteNotification(id);

  if (response.error) {
    return { success: false, message: response.error.message };
  }

  revalidatePath('/notifications');
  return { success: true, message: 'Notification deleted successfully' };
};

export const clearAllNotificationsAction = async () => {
  const response = await notificationService.server.clearAllNotifications();

  if (response.error) {
    return { success: false, message: response.error.message };
  }

  revalidatePath('/notifications');
  return { success: true, message: 'All notifications cleared successfully' };
};


