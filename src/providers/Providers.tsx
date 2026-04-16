"use client";
import { Provider } from "react-redux";
import { store } from "@/store";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/providers/themeProvider";
export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                {children}
                <Toaster position="top-center" richColors />
            </ThemeProvider>
        </Provider>
    );
}