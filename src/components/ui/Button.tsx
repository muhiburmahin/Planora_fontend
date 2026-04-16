import React from 'react';
import { colors } from '@/theme/colors';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            isLoading = false,
            className,
            disabled,
            children,
            ...props
        },
        ref
    ) => {
        const baseStyles =
            'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

        const sizeStyles = {
            sm: 'px-3 py-2 text-sm',
            md: 'px-4 py-2.5 text-base',
            lg: 'px-6 py-3 text-lg',
        };

        const variantStyles = {
            primary: `bg-gradient-to-r from-purple-500 to-orange-500 text-white hover:shadow-lg focus-visible:ring-purple-500`,
            secondary: `bg-orange-500 text-white hover:bg-orange-600 focus-visible:ring-orange-500`,
            outline: `border-2 border-purple-500 text-purple-500 hover:bg-purple-50 focus-visible:ring-purple-500`,
            ghost: `text-purple-600 hover:bg-purple-50 focus-visible:ring-purple-500`,
            danger: `bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500`,
        };

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    baseStyles,
                    sizeStyles[size],
                    variantStyles[variant],
                    className
                )}
                {...props}
            >
                {isLoading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin" />
                        Loading...
                    </>
                ) : (
                    children
                )}
            </button>
        );
    }
);

Button.displayName = 'Button';
