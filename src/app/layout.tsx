import type { Metadata } from 'next';
import { GeistSans, GeistMono } from 'geist/font';

import { ThemeProvider } from '@/providers/themeProvider';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';

export const metadata: Metadata = {
    title: 'Planora - Professional Event Management Platform',
    description:
        'Create, manage, and promote your events with Planora. The ultimate event management solution for organizers and attendees.',
    keywords:
        'event management, event planning, event ticketing, virtual events, in-person events',
    authors: [{ name: 'Planora Team' }],
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://planora.com',
        title: 'Planora - Event Management Platform',
        description: 'Create and manage amazing events',
        images: [
            {
                url: 'https://planora.com/og-image.jpg',
                width: 1200,
                height: 630,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Planora - Event Management',
        description: 'Create and manage amazing events',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <Navbar />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}