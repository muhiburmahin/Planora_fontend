import React from 'react'

export const Badge = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: string }) => {
    const cls = variant === 'info' ? 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold' : 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold'
    return <span className={cls}>{children}</span>
}

export default Badge
