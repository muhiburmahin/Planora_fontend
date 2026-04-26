import { Navbar } from "@/components/layout";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative">
            <Navbar />
            {children}
        </div>
    );
}