'use client';

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
    icon?: ReactNode;
    showCharCount?: boolean;
}

export const Textarea = React.forwardRef<
    HTMLTextAreaElement,
    TextareaProps
>(
    (
        { label, error, hint, icon, className, showCharCount, ...props },
        ref
    ) => {
        const [charCount, setCharCount] = React.useState(0);
        const maxLength = props.maxLength as number | undefined;

        const handleChange = (
            e: React.ChangeEvent<HTMLTextAreaElement>
        ) => {
            setCharCount(e.target.value.length);
            props.onChange?.(e);
        };

        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {label}
                    </label>
                )}

                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-3 text-gray-500 pointer-events-none">
                            {icon}
                        </div>
                    )}

                    <textarea
                        ref={ref}
                        className={cn(
                            'w-full px-3 py-2 border-2 border-slate-200 rounded-lg',
                            'focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200',
                            'transition-colors duration-200',
                            'bg-white text-gray-900 resize-none',
                            'disabled:bg-slate-100 disabled:text-gray-500 disabled:cursor-not-allowed',
                            icon && 'pl-10',
                            error && 'border-red-500 focus:border-red-500 focus:ring-red-200',
                            className
                        )}
                        onChange={handleChange}
                        {...props}
                    />
                </div>

                <div className="flex items-center justify-between mt-1">
                    <div>
                        {error && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <span>⚠</span> {error}
                            </p>
                        )}

                        {hint && !error && (
                            <p className="text-sm text-gray-500">{hint}</p>
                        )}
                    </div>

                    {showCharCount && maxLength && (
                        <p className="text-xs text-gray-400">
                            {charCount}/{maxLength}
                        </p>
                    )}
                </div>
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';
