import { Navbar } from "@/components/layout/Navbar";
import { Providers } from "@/providers/Providers";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <Providers>
            <div>
                <Navbar />
                {children}
            </div>
        </Providers>
    );
}