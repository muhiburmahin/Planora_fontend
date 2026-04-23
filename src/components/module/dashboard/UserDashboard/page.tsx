'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Users, PlusCircle, BarChart3, Settings, Bell, TrendingUp, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGetMe } from '@/hooks/auth.hooks';
import { useGetUserDashboardStats } from '@/hooks/dashboard.hooks';

export default function DashboardPage() {
    const { data: user } = useGetMe();
    const { data: stats, isLoading } = useGetUserDashboardStats();

    const quickActions = [
        {
            title: 'Create Event',
            description: 'Organize a new event',
            icon: PlusCircle,
            href: '/dashboard/create-event',
            color: 'bg-primary-600 hover:bg-primary-700',
        },
        {
            title: 'My Events',
            description: 'Manage your events',
            icon: Calendar,
            href: '/dashboard/my-events',
            color: 'bg-blue-600 hover:bg-blue-700',
        },
        {
            title: 'My Participations',
            description: 'Events you joined',
            icon: Users,
            href: '/dashboard/my-participations',
            color: 'bg-green-600 hover:bg-green-700',
        },
        {
            title: 'Notifications',
            description: 'View your notifications',
            icon: Bell,
            href: '/notifications',
            color: 'bg-orange-600 hover:bg-orange-700',
        },
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
                <div className="container mx-auto px-4">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-64"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <Card key={i}>
                                    <CardContent className="p-6">
                                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                                        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        Welcome back, {user?.name?.split(' ')[0] || 'User'}!
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Here's an overview of your event activity
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Events Organized
                                    </p>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                        {stats?.stats?.myOrganizedEvents || 0}
                                    </p>
                                </div>
                                <Calendar className="w-8 h-8 text-primary-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Events Joined
                                    </p>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                        {stats?.stats?.myJoinedEvents || 0}
                                    </p>
                                </div>
                                <Users className="w-8 h-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Reviews Given
                                    </p>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                        {stats?.stats?.totalReviewsGiven || 0}
                                    </p>
                                </div>
                                <BarChart3 className="w-8 h-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Pending Invitations
                                    </p>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                        {stats?.stats?.pendingInvitations || 0}
                                    </p>
                                </div>
                                <Clock className="w-8 h-8 text-orange-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {quickActions.map((action) => (
                            <Card key={action.title} className="group hover:shadow-lg transition-all duration-300">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`p-3 rounded-lg text-white ${action.color}`}>
                                            <action.icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                                                {action.title}
                                            </h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {action.description}
                                            </p>
                                        </div>
                                    </div>
                                    <Button asChild className="w-full">
                                        <Link href={action.href}>
                                            Get Started
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Recent Activity / Upcoming Events could go here */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5" />
                                Recent Activity
                            </CardTitle>
                            <CardDescription>
                                Your latest event-related activities
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                                            Joined "Tech Conference 2024"
                                        </p>
                                        <p className="text-xs text-slate-500">2 hours ago</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                                            Created "React Workshop"
                                        </p>
                                        <p className="text-xs text-slate-500">1 day ago</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="w-5 h-5" />
                                Account Settings
                            </CardTitle>
                            <CardDescription>
                                Manage your account and preferences
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <Link href="/profile">
                                        <Users className="w-4 h-4 mr-2" />
                                        Edit Profile
                                    </Link>
                                </Button>
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <Link href="/settings">
                                        <Settings className="w-4 h-4 mr-2" />
                                        Account Settings
                                    </Link>
                                </Button>
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <Link href="/notifications">
                                        <Bell className="w-4 h-4 mr-2" />
                                        Notification Preferences
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}