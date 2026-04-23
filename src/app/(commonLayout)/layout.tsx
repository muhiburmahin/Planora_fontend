import type { Metadata } from 'next';
import { GeistSans, GeistMono } from 'geist/font';
import { Providers } from '@/providers/Providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout';

export const metadata: Metadata = {
    title: 'Planora - Professional Event Management Platform',
    description: 'Create, manage, and promote your events with Planora. The ultimate platform for event organizers and attendees.',
    keywords: 'event management, event planning, event platform, event organizer, event attendee',
    authors: [{ name: 'Planora Team' }],
    creator: 'Planora',
    publisher: 'Planora',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'Planora - Professional Event Management Platform',
        description: 'Create, manage, and promote your events with Planora.',
        url: '/',
        siteName: 'Planora',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Planora - Event Management Platform',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Planora - Professional Event Management Platform',
        description: 'Create, manage, and promote your events with Planora.',
        images: ['/og-image.jpg'],
        creator: '@planora',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${GeistSans.variable} ${GeistMono.variable} min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300 antialiased`} suppressHydrationWarning>
                <Providers>
                    <div className="relative flex min-h-screen flex-col">
                        <Navbar />
                        <main className="flex-1">
                            {children}
                        </main>
                        <Footer />
                    </div>
                </Providers>
            </body>
        </html>
    );
}