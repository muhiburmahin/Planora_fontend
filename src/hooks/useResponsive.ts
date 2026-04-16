import { useState, useEffect } from 'react';
import { breakpoints } from '@/utils/responsive';

/**
 * Hook to detect if window width is above breakpoint
 */
export function useIsAboveBreakpoint(breakpoint: keyof typeof breakpoints) {
    const [isAbove, setIsAbove] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsAbove(window.innerWidth >= breakpoints[breakpoint]);
        };

        handleResize(); // Set initial value
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoint]);

    return isAbove;
}

/**
 * Hook to get current breakpoint name
 */
export function useBreakpoint() {
    const [breakpoint, setBreakpoint] = useState<keyof typeof breakpoints>('sm');

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width >= breakpoints['2xl']) setBreakpoint('2xl');
            else if (width >= breakpoints.xl) setBreakpoint('xl');
            else if (width >= breakpoints.lg) setBreakpoint('lg');
            else if (width >= breakpoints.md) setBreakpoint('md');
            else if (width >= breakpoints.sm) setBreakpoint('sm');
            else setBreakpoint('xs');
        };

        handleResize(); // Set initial value
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return breakpoint;
}

/**
 * Hook to detect if device is mobile
 */
export function useIsMobile() {
    return !useIsAboveBreakpoint('sm');
}

/**
 * Hook to detect if device is tablet
 */
export function useIsTablet() {
    const sm = useIsAboveBreakpoint('sm');
    const md = useIsAboveBreakpoint('md');
    return sm && !md;
}

/**
 * Hook to detect if device is desktop
 */
export function useIsDesktop() {
    return useIsAboveBreakpoint('lg');
}

/**
 * Hook to toggle sidebar visibility
 */
export function useSidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const isMobile = useIsMobile();

    // Auto-close sidebar on mobile
    useEffect(() => {
        if (isMobile) {
            setIsOpen(false);
        }
    }, [isMobile]);

    const toggle = () => setIsOpen(!isOpen);
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);

    return { isOpen, toggle, open, close };
}

/**
 * Hook for debounced resize events
 */
export function useResizeObserver(callback: () => void, delay: number = 150) {
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(callback, delay);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timeoutId);
        };
    }, [callback, delay]);
}
