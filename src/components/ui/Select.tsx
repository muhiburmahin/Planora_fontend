'use client';

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SelectProps
    extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    hint?: string;
    icon?: ReactNode;
    options: Array<{
        value: string | number;
        label: string;
        disabled?: boolean;
    }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, hint, icon, options, className, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {label}
                    </label>
                )}

                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                            {icon}
                        </div>
                    )}

                    <select
                        ref={ref}
                        className={cn(
                            'w-full px-3 py-2 border-2 border-slate-200 rounded-lg',
                            'focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200',
                            'transition-colors duration-200',
                            'bg-white text-gray-900',
                            'disabled:bg-slate-100 disabled:text-gray-500 disabled:cursor-not-allowed',
                            icon && 'pl-10',
                            error && 'border-red-500 focus:border-red-500 focus:ring-red-200',
                            className
                        )}
                        {...props}
                    >
                        <option value="">Select an option</option>
                        {options.map((opt) => (
                            <option
                                key={opt.value}
                                value={opt.value}
                                disabled={opt.disabled}
                            >
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                {error && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <span>⚠</span> {error}
                    </p>
                )}

                {hint && !error && (
                    <p className="mt-1 text-sm text-gray-500">{hint}</p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';
