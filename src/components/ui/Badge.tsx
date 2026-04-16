import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
    size?: 'sm' | 'md';
    children: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
        const variantStyles = {
            primary: 'bg-purple-100 text-purple-700 border-purple-200',
            secondary: 'bg-orange-100 text-orange-700 border-orange-200',
            success: 'bg-green-100 text-green-700 border-green-200',
            warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            error: 'bg-red-100 text-red-700 border-red-200',
            info: 'bg-blue-100 text-blue-700 border-blue-200',
        };

        const sizeStyles = {
            sm: 'px-2 py-1 text-xs font-semibold',
            md: 'px-3 py-1.5 text-sm font-semibold',
        };

        return (
            <span
                ref={ref}
                className={cn(
                    'inline-flex items-center rounded-full border',
                    variantStyles[variant],
                    sizeStyles[size],
                    className
                )}
                {...props}
            >
                {children}
            </span>
        );
    }
);

Badge.displayName = 'Badge';
