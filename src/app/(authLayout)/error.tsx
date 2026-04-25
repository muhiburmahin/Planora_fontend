"use client"
import * as React from "react"

export default function AuthError({ error }: { error: Error }) {
    return (
        <div className="flex min-h-[60vh] items-center justify-center px-4">
            <div className="w-full max-w-lg rounded-2xl border border-primary-100 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h2 className="mb-2 text-xl font-bold">Something went wrong</h2>
                <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">{error?.message || "An unexpected error occurred."}</p>
                <button onClick={() => location.reload()} className="rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700">
                    Reload
                </button>
            </div>
        </div>
    );
}

