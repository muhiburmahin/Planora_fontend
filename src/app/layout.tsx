import type { Metadata } from 'next';
import { GeistSans, GeistMono } from 'geist/font';
import { ThemeProvider } from '@/providers/themeProvider';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Toaster } from 'sonner';
import QueryProvider from '@/providers/query-provider';
import { TooltipProvider } from '@/components/ui/tooltip';

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
            <body suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable} min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300`}>

                <QueryProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                    >
                        <TooltipProvider>
                            <main>
                                {children}
                            </main>
                            <Toaster position="top-right" richColors />
                        </TooltipProvider>
                    </ThemeProvider>
                </QueryProvider>
            </body>
        </html>
    );
}