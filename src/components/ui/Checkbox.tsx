'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CheckboxProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    description?: string;
    helpText?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, description, helpText, className, ...props }, ref) => {
        return (
            <div className="flex items-start">
                <div className="flex items-center h-5">
                    <input
                        ref={ref}
                        type="checkbox"
                        className={cn(
                            'w-4 h-4 rounded border-2 border-slate-300',
                            'text-purple-600 bg-white cursor-pointer',
                            'focus:ring-2 focus:ring-purple-200',
                            'hover:border-purple-400 transition-colors',
                            'disabled:bg-slate-100 disabled:cursor-not-allowed',
                            className
                        )}
                        {...props}
                    />
                </div>

                {(label || description || helpText) && (
                    <div className="ml-3">
                        {label && (
                            <label className="text-sm font-medium text-gray-900 cursor-pointer">
                                {label}
                            </label>
                        )}

                        {description && (
                            <p className="text-sm text-gray-600">{description}</p>
                        )}

                        {helpText && (
                            <p className="text-xs text-gray-500 mt-1">{helpText}</p>
                        )}
                    </div>
                )}
            </div>
        );
    }
);

Checkbox.displayName = 'Checkbox';
