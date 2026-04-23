'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Users, Clock, CheckCircle, XCircle, Mail, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGetMyInvitations } from '@/hooks/invitation.hooks';

export default function InvitationsPage() {
    const { data: invitations, isLoading, error } = useGetMyInvitations();

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'ACCEPTED':
                return <CheckCircle className='w-5 h-5 text-green-500' />;
            case 'PENDING':
                return <Clock className='w-5 h-5 text-yellow-500' />;
            case 'DECLINED':
                return <XCircle className='w-5 h-5 text-red-500' />;
            default:
                return <Mail className='w-5 h-5 text-blue-500' />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ACCEPTED':
                return <Badge className='bg-green-100 text-green-800'>Accepted</Badge>;
            case 'PENDING':
                return <Badge variant='secondary' className='bg-yellow-100 text-yellow-800'>Pending</Badge>;
            case 'DECLINED':
                return <Badge variant='destructive'>Declined</Badge>;
            default:
                return <Badge variant='outline'>{status}</Badge>;
        }
    };

    if (isLoading) {
        return (
            <div className='min-h-screen bg-slate-50 dark:bg-slate-900 py-16'>
                <div className='container mx-auto px-4'>
                    <div className='text-center mb-12'>
                        <div className='h-8 bg-slate-200 dark:bg-slate-700 rounded w-64 mx-auto mb-4 animate-pulse'></div>
                        <div className='h-4 bg-slate-200 dark:bg-slate-700 rounded w-96 mx-auto animate-pulse'></div>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        {[...Array(4)].map((_, i) => (
                            <Card key={i} className='animate-pulse'>
                                <CardContent className='p-6'>
                                    <div className='h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2'></div>
                                    <div className='h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4'></div>
                                    <div className='h-4 bg-slate-200 dark:bg-slate-700 rounded w-full'></div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='min-h-screen bg-slate-50 dark:bg-slate-900 py-16'>
                <div className='container mx-auto px-4 text-center'>
                    <h1 className='text-2xl font-bold text-slate-900 dark:text-white mb-4'>
                        Error Loading Invitations
                    </h1>
                    <p className='text-slate-600 dark:text-slate-400 mb-6'>
                        {error.message || 'Something went wrong while loading your invitations.'}
                    </p>
                    <Button onClick={() => window.location.reload()}>
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-slate-50 dark:bg-slate-900 py-16'>
            <div className='container mx-auto px-4'>
                {/* Hero Section */}
                <div className='text-center mb-12'>
                    <h1 className='text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4'>
                        My <span className='text-primary-600'>Invitations</span>
                    </h1>
                    <p className='text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto'>
                        Manage event invitations you've received and respond to them.
                    </p>
                </div>

                {/* Invitations List */}
                <div className='max-w-4xl mx-auto'>
                    {invitations && invitations.length > 0 ? (
                        <div className='space-y-6'>
                            {invitations.map((invitation) => (
                                <Card key={invitation.id} className='hover:shadow-lg transition-all duration-300'>
                                    <CardContent className='p-6'>
                                        <div className='flex items-start justify-between mb-4'>
                                            <div className='flex-1'>
                                                <h3 className='text-xl font-bold text-slate-900 dark:text-white mb-2'>
                                                    {invitation.event?.title || 'Event Title'}
                                                </h3>
                                                <p className='text-slate-600 dark:text-slate-400 mb-3'>
                                                    {invitation.event?.description || 'Event description'}
                                                </p>
                                                <div className='text-sm text-slate-500 dark:text-slate-400 mb-2'>
                                                    Invited by {invitation.invitedBy?.name || 'Unknown'}
                                                </div>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                {getStatusIcon(invitation.status)}
                                                {getStatusBadge(invitation.status)}
                                            </div>
                                        </div>

                                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
                                            <div className='flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400'>
                                                <Calendar className='w-4 h-4' />
                                                {invitation.event?.date ? new Date(invitation.event.date).toLocaleDateString() : 'Date TBA'}
                                                {invitation.event?.time &&  at }
                                            </div>
                                            <div className='flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400'>
                                                <MapPin className='w-4 h-4' />
                                                {invitation.event?.location || 'Location TBA'}
                                            </div>
                                            <div className='flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400'>
                                                <Users className='w-4 h-4' />
                                                Organized by {invitation.event?.organizer?.name || 'Unknown'}
                                            </div>
                                        </div>

                                        <div className='flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700'>
                                            <div className='text-sm text-slate-500 dark:text-slate-400'>
                                                Invited on {new Date(invitation.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className='flex gap-2'>
                                                <Button variant='outline' size='sm' asChild>
                                                    <Link href={/event/}>
                                                        <ExternalLink className='w-4 h-4 mr-1' />
                                                        View Event
                                                    </Link>
                                                </Button>
                                                {invitation.status === 'PENDING' && (
                                                    <div className='flex gap-2'>
                                                        <Button size='sm' className='bg-green-600 hover:bg-green-700'>
                                                            Accept
                                                        </Button>
                                                        <Button variant='outline' size='sm' className='border-red-300 text-red-600 hover:bg-red-50'>
                                                            Decline
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className='p-12 text-center'>
                                <Mail className='w-16 h-16 text-slate-400 mx-auto mb-4' />
                                <CardTitle className='text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2'>
                                    No invitations yet
                                </CardTitle>
                                <CardDescription className='text-slate-500 dark:text-slate-500 mb-6'>
                                    You haven't received any event invitations yet. When someone invites you to an event, they'll appear here.
                                </CardDescription>
                                <Button asChild>
                                    <Link href='/events'>
                                        <Calendar className='w-4 h-4 mr-2' />
                                        Browse Events
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Quick Stats */}
                {invitations && invitations.length > 0 && (
                    <div className='max-w-4xl mx-auto mt-12'>
                        <Card>
                            <CardHeader>
                                <CardTitle className='flex items-center gap-2'>
                                    <Mail className='w-5 h-5' />
                                    Invitation Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                                    <div className='text-center'>
                                        <div className='text-3xl font-bold text-green-600 mb-2'>
                                            {invitations.filter(i => i.status === 'ACCEPTED').length}
                                        </div>
                                        <div className='text-sm text-slate-600 dark:text-slate-400'>Accepted</div>
                                    </div>
                                    <div className='text-center'>
                                        <div className='text-3xl font-bold text-yellow-600 mb-2'>
                                            {invitations.filter(i => i.status === 'PENDING').length}
                                        </div>
                                        <div className='text-sm text-slate-600 dark:text-slate-400'>Pending</div>
                                    </div>
                                    <div className='text-center'>
                                        <div className='text-3xl font-bold text-slate-600 mb-2'>
                                            {invitations.length}
                                        </div>
                                        <div className='text-sm text-slate-600 dark:text-slate-400'>Total</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
