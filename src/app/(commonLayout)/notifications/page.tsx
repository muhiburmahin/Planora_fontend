'use client';

import React from 'react';
import { Bell, Calendar, Users, MessageSquare, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGetMyNotifications } from '@/hooks/notification.hooks';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationsPage() {
    const { data: notifications, isLoading, error } = useGetMyNotifications();

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'EVENT_INVITATION':
                return <Users className="w-5 h-5 text-blue-500" />;
            case 'EVENT_UPDATE':
                return <Calendar className="w-5 h-5 text-green-500" />;
            case 'PAYMENT_SUCCESS':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'PAYMENT_FAILED':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'MESSAGE':
                return <MessageSquare className="w-5 h-5 text-purple-500" />;
            default:
                return <Bell className="w-5 h-5 text-gray-500" />;
        }
    };

    const getNotificationBadge = (type: string, isRead: boolean) => {
        if (!isRead) {
            return <Badge variant="destructive" className="ml-2">New</Badge>;
        }

        switch (type) {
            case 'EVENT_INVITATION':
                return <Badge variant="secondary" className="ml-2">Invitation</Badge>;
            case 'EVENT_UPDATE':
                return <Badge variant="secondary" className="ml-2">Update</Badge>;
            case 'PAYMENT_SUCCESS':
                return <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">Success</Badge>;
            case 'PAYMENT_FAILED':
                return <Badge variant="secondary" className="ml-2 bg-red-100 text-red-800">Failed</Badge>;
            default:
                return null;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-3 mb-8">
                            <Bell className="w-8 h-8 text-primary-600" />
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                                Notifications
                            </h1>
                        </div>
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <Card key={i} className="animate-pulse">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                                                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            Error Loading Notifications
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            {error.message || 'Something went wrong while loading your notifications.'}
                        </p>
                        <Button onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <Bell className="w-8 h-8 text-primary-600" />
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                                    Notifications
                                </h1>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Stay updated with your latest activities
                                </p>
                            </div>
                        </div>
                        {notifications && notifications.length > 0 && (
                            <Badge variant="outline" className="px-3 py-1">
                                {notifications.filter(n => !n.isRead).length} unread
                            </Badge>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="space-y-4">
                        {notifications && notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <Card
                                    key={notification.id}
                                    className={`transition-all duration-200 hover:shadow-md ${
                                        !notification.isRead
                                            ? 'border-l-4 border-l-primary-500 bg-primary-50/50 dark:bg-primary-900/10'
                                            : 'hover:border-slate-300 dark:hover:border-slate-600'
                                    }`}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 mt-1">
                                                {getNotificationIcon(notification.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                                                            {notification.title}
                                                        </h3>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                                            {notification.message}
                                                        </p>
                                                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                            <Clock className="w-3 h-3" />
                                                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                        </div>
                                                    </div>
                                                    {getNotificationBadge(notification.type, notification.isRead)}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <Bell className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                                    <CardTitle className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
                                        No notifications yet
                                    </CardTitle>
                                    <CardDescription className="text-slate-500 dark:text-slate-500">
                                        When you receive invitations, event updates, or other activities, they'll appear here.
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Load More / Pagination could go here */}
                    {notifications && notifications.length >= 20 && (
                        <div className="text-center mt-8">
                            <Button variant="outline">
                                Load More Notifications
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
