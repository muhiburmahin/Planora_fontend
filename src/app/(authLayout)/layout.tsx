import { Navbar } from "@/components/layout";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gradient-primary-subtle text-slate-900 dark:bg-slate-950 dark:text-slate-100">
             <Navbar />
            
            <div className="relative px-4 pb-10 pt-28 sm:px-6 lg:px-8">
                <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1fr_460px] lg:items-center">
                    <div className="hidden rounded-3xl border border-primary-100/70 bg-white/70 p-8 shadow-sm backdrop-blur lg:block dark:border-slate-800 dark:bg-slate-900/70">
                        <p className="text-xs font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300">
                            Planora Auth
                        </p>
                        <h2 className="mt-3 text-3xl font-black leading-tight">
                            Secure sign-in and account recovery for your events.
                        </h2>
                        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                            Login, register, forgot password, reset password, and secure account settings are connected to your backend auth APIs.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-2 text-xs">
                            <span className="rounded-full bg-primary-100 px-3 py-1 font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-200">JWT Auth</span>
                            <span className="rounded-full bg-secondary-100 px-3 py-1 font-semibold text-secondary-700 dark:bg-secondary-900/40 dark:text-secondary-200">Refresh Token</span>
                            <span className="rounded-full bg-slate-200 px-3 py-1 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">Role Aware</span>
                        </div>
                        <Link href="/events" className="mt-7 inline-block text-sm font-semibold text-primary-700 hover:underline dark:text-primary-300">
                            Browse public events
                        </Link>
                    </div>
                    <div>
                       
                        {children}</div>
                </div>
            </div>
        </div>
    );
}