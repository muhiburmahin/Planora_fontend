"use client";
import { Provider } from "react-redux";
import { store } from "@/store";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/providers/themeProvider";
import QueryProvider from "@/providers/query-provider";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <QueryProvider>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    {children}
                    <Toaster position="top-right" richColors />
                </ThemeProvider>
            </QueryProvider>
        </Provider>
    );
}