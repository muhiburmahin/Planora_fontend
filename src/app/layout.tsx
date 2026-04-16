import type { Metadata } from 'next';
import { GeistSans, GeistMono } from 'geist/font';
import { Providers } from '@/components/providers';

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
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body
                className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased bg-gradient-to-br from-slate-50 to-slate-100 text-gray-900`}
            >
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
