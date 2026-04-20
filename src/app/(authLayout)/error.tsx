"use client"
import * as React from "react"

export default function AuthError({ error }: { error: Error }) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-lg w-full p-8 bg-white rounded-xl shadow">
                <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
                <p className="text-sm text-slate-600 mb-4">{error?.message || 'An unexpected error occurred.'}</p>
                <button onClick={() => location.reload()} className="px-4 py-2 bg-primary-600 text-white rounded">Reload</button>
            </div>
        </div>
    )
}

