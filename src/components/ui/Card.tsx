import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    hover?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ children, hover = true, className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'bg-white rounded-xl border border-gray-200 shadow-sm transition-all duration-300',
                    hover && 'hover:shadow-lg hover:border-purple-200',
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('px-6 py-4 border-b border-gray-200', className)} {...props} />
);

export const CardBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('px-6 py-4', className)} {...props} />
);

export const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl', className)} {...props} />
);
