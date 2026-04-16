export const formatDate = (date: Date | string): string => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};

export const getInitials = (name: string): string => {
    return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

export const isExpired = (expiryDate: Date): boolean => {
    return new Date() > new Date(expiryDate);
};

export const getTimeAgo = (date: Date | string): string => {
    const now = new Date();
    const pastDate = new Date(date);
    const secondsDiff = Math.floor((now.getTime() - pastDate.getTime()) / 1000);

    if (secondsDiff < 60) return `${secondsDiff}s ago`;
    if (secondsDiff < 3600) return `${Math.floor(secondsDiff / 60)}m ago`;
    if (secondsDiff < 86400) return `${Math.floor(secondsDiff / 3600)}h ago`;
    if (secondsDiff < 604800) return `${Math.floor(secondsDiff / 86400)}d ago`;

    return formatDate(pastDate);
};
