"use client"

import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'outline'
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export const Button = ({ variant = 'outline', size = 'md', className = '', children, ...rest }: Props) => {
    const base = 'inline-flex items-center justify-center rounded-md font-semibold'
    const sizeClass = size === 'lg' ? 'px-6 py-3 text-base' : size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2'
    const variantClass = variant === 'primary' ? 'bg-primary text-white' : variant === 'secondary' ? 'bg-secondary text-white' : 'border bg-transparent'
    return (
        <button className={`${base} ${sizeClass} ${variantClass} ${className}`} {...rest}>
            {children}
        </button>
    )
}

export default Button
