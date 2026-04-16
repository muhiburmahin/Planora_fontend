
export const breakpoints = {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
} as const;


export const getBreakpoint = (breakpoint: keyof typeof breakpoints): number => {
    return breakpoints[breakpoint];
};


export const isAboveBreakpoint = (breakpoint: keyof typeof breakpoints): boolean => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= breakpoints[breakpoint];
};


export const getCurrentBreakpoint = (): keyof typeof breakpoints => {
    if (typeof window === 'undefined') return 'sm';

    const width = window.innerWidth;
    if (width >= breakpoints['2xl']) return '2xl';
    if (width >= breakpoints.xl) return 'xl';
    if (width >= breakpoints.lg) return 'lg';
    if (width >= breakpoints.md) return 'md';
    if (width >= breakpoints.sm) return 'sm';
    return 'xs';
};


export const getResponsiveSpacing = (
    mobile: string,
    tablet: string,
    desktop: string
): string => {
    const currentBreakpoint = getCurrentBreakpoint();

    if (['md', 'lg', 'xl', '2xl'].includes(currentBreakpoint)) {
        return desktop;
    }
    if (['sm', 'md'].includes(currentBreakpoint)) {
        return tablet;
    }
    return mobile;
};

/**
 * Responsive grid columns utility
 */
export const getResponsiveColumns = (
    mobile: number,
    tablet: number,
    desktop: number
): number => {
    const currentBreakpoint = getCurrentBreakpoint();

    if (['md', 'lg', 'xl', '2xl'].includes(currentBreakpoint)) {
        return desktop;
    }
    if (['sm', 'md'].includes(currentBreakpoint)) {
        return tablet;
    }
    return mobile;
};


export const getResponsiveFontSize = (
    mobile: string,
    tablet: string,
    desktop: string
): string => {
    return getResponsiveSpacing(mobile, tablet, desktop);
};


export const generateResponsiveClass = (
    property: 'p' | 'm' | 'px' | 'py' | 'mx' | 'my',
    mobile: string,
    tablet: string,
    desktop: string
): string => {
    return `${property}-${mobile} sm:${property}-${tablet} lg:${property}-${desktop}`;
};


export const containerWidths = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    full: '100%',
} as const;


export const responsiveClasses = {
    gridCols: {
        desktop: 'grid-cols-4',
        tablet: 'md:grid-cols-2',
        mobile: 'sm:grid-cols-1',
    },

    padding: {
        desktop: 'px-8 py-8',
        tablet: 'md:px-6 md:py-6',
        mobile: 'sm:px-4 sm:py-4',
    },

    gap: {
        desktop: 'gap-6',
        tablet: 'md:gap-4',
        mobile: 'sm:gap-2',
    },

    fontSize: {
        hero: 'text-3xl md:text-4xl lg:text-5xl',
        heading: 'text-2xl md:text-3xl lg:text-4xl',
        subheading: 'text-xl md:text-2xl lg:text-3xl',
        body: 'text-base md:text-lg',
        small: 'text-sm md:text-base',
    },
} as const;

/**
 * Responsive layout classes
 */
export const flexResponsive = {
    center: 'flex flex-col sm:flex-row items-center justify-center gap-4',
    spaceBetween: 'flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4',
    stack: 'flex flex-col gap-4',
} as const;
