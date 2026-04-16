/**
 * Planora - Professional Event Management Platform
 * Color Scheme: Purple + Gradient Orange (Event Industry Standard)
 * 
 * This color scheme is perfect for event management:
 * - Purple: Trust, creativity, premium feel
 * - Orange: Energy, action, event excitement
 * - Creates professional yet dynamic appearance
 */

export const colors = {
    // Brand Colors
    primary: {
        50: '#f3e8ff',
        100: '#e9d5ff',
        200: '#d8b4fe',
        300: '#c084fc',
        400: '#a855f7',
        500: '#9333ea', // Main Brand Color
        600: '#7e22ce',
        700: '#6b21a8',
        800: '#581c87',
        900: '#3f0f5c',
    },

    secondary: {
        50: '#fff7ed',
        100: '#ffedd5',
        200: '#fed7aa',
        300: '#fdba74',
        400: '#fb923c',
        500: '#f97316', // Secondary Action Color
        600: '#ea580c',
        700: '#c2410c',
        800: '#92400e',
        900: '#78350f',
    },

    // Neutral Colors
    neutral: {
        50: '#fafafa',
        100: '#f4f4f5',
        200: '#e4e4e7',
        300: '#d4d4d8',
        400: '#a1a1a6',
        500: '#71717a',
        600: '#52525b',
        700: '#3f3f46',
        800: '#27272a',
        900: '#18181b',
    },

    // Status Colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',

    // Gradients
    gradients: {
        primary: 'linear-gradient(135deg, #9333ea 0%, #c2410c 100%)',
        primarySubtle: 'linear-gradient(135deg, #f3e8ff 0%, #fff7ed 100%)',
    },
} as const;

export const theme = {
    colors,
    spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem',
    },
    borderRadius: {
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
        full: '9999px',
    },
    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
} as const;
