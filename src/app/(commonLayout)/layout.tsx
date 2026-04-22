import type { Metadata } from 'next';
import { GeistSans, GeistMono } from 'geist/font';
import { ThemeProvider } from '@/providers/themeProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout';
import { Toaster } from 'sonner';
import QueryProvider from '@/providers/query-provider';

export const metadata: Metadata = {
    title: 'Planora - Professional Event Management Platform',
    description: 'Create, manage, and promote your events with Planora.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${GeistSans.variable} ${GeistMono.variable} min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300`} suppressHydrationWarning>

                <QueryProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                    >
                        <Navbar />
                        <main>
                            {children}
                        </main>
                        <Footer />
                        <Toaster position="top-right" richColors />
                    </ThemeProvider>
                </QueryProvider>
            </body>
        </html>
    );
}