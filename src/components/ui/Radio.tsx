'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface RadioProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    description?: string;
}

interface RadioGroupProps {
    name: string;
    value?: string;
    onChange?: (value: string) => void;
    children: React.ReactNode;
    className?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
    ({ label, description, className, ...props }, ref) => {
        return (
            <div className="flex items-start">
                <div className="flex items-center h-5">
                    <input
                        ref={ref}
                        type="radio"
                        className={cn(
                            'w-4 h-4 rounded-full border-2 border-slate-300',
                            'text-purple-600 bg-white cursor-pointer',
                            'focus:ring-2 focus:ring-purple-200',
                            'hover:border-purple-400 transition-colors',
                            'disabled:bg-slate-100 disabled:cursor-not-allowed',
                            className
                        )}
                        {...props}
                    />
                </div>

                {(label || description) && (
                    <div className="ml-3">
                        {label && (
                            <label className="text-sm font-medium text-gray-900 cursor-pointer">
                                {label}
                            </label>
                        )}

                        {description && (
                            <p className="text-sm text-gray-600">{description}</p>
                        )}
                    </div>
                )}
            </div>
        );
    }
);

Radio.displayName = 'Radio';

export const RadioGroup: React.FC<RadioGroupProps> = ({
    name,
    value,
    onChange,
    children,
    className,
}) => {
    return (
        <div className={cn('space-y-3', className)}>
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child as React.ReactElement<RadioProps>, {
                        name,
                        checked: (child.props as RadioProps).value === value,
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                            onChange?.(e.target.value);
                            (child.props as RadioProps).onChange?.(e);
                        },
                    });
                }
                return child;
            })}
        </div>
    );
};
