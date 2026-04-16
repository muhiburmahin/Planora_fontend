'use client';

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    closeButton?: boolean;
    footer?: ReactNode;
}

const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
};

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    closeButton = true,
    footer,
}: ModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className={cn(
                    'bg-white rounded-xl shadow-2xl w-full mx-4 max-h-[90vh] overflow-y-auto',
                    'animation-fade-in',
                    sizeClasses[size]
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                {(title || closeButton) && (
                    <div className="flex items-center justify-between p-6 border-b border-slate-200">
                        {title && (
                            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                        )}
                        {closeButton && (
                            <button
                                onClick={onClose}
                                className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="p-6">{children}</div>

                {/* Footer */}
                {footer && (
                    <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
