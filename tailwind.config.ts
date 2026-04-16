import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f3e8ff',
                    100: '#e9d5ff',
                    200: '#d8b4fe',
                    300: '#c084fc',
                    400: '#a855f7',
                    500: '#9333ea',
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
                    500: '#f97316',
                    600: '#ea580c',
                    700: '#c2410c',
                    800: '#92400e',
                    900: '#78350f',
                },
            },
            fontFamily: {
                sans: ['var(--font-geist-sans)', ...defaultTheme.fontFamily.sans],
                mono: ['var(--font-geist-mono)', ...defaultTheme.fontFamily.mono],
            },
            backgroundImage: {
                'gradient-primary':
                    'linear-gradient(135deg, #9333ea 0%, #f97316 100%)',
                'gradient-primary-subtle':
                    'linear-gradient(135deg, #f3e8ff 0%, #fff7ed 100%)',
            },
            boxShadow: {
                'lg-primary': '0 20px 25px -5px rgba(147, 51, 234, 0.1)',
            },
            animation: {
                'spin-slow': 'spin 3s linear infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'fade-in': 'fadeIn 0.5s ease-in',
                'slide-up': 'slideUp 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
};

export default config;
