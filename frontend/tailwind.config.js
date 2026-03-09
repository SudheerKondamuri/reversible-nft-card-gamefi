/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Core dark palette
                dark: {
                    900: '#0a0b0f',
                    800: '#10121a',
                    700: '#161825',
                    600: '#1e2033',
                    500: '#282a40',
                    400: '#353852',
                },
                // Rarity colors
                rarity: {
                    common: '#9ca3af',
                    rare: '#3b82f6',
                    epic: '#a855f7',
                    legendary: '#f59e0b',
                },
                // Element colors
                element: {
                    fire: '#ef4444',
                    water: '#3b82f6',
                    earth: '#84cc16',
                    air: '#06b6d4',
                    lightning: '#eab308',
                    steam: '#94a3b8',
                    lava: '#f97316',
                    nature: '#22c55e',
                    ice: '#67e8f9',
                    dust: '#d4a574',
                    plasma: '#e879f9',
                    storm: '#6366f1',
                    magnetism: '#a78bfa',
                    thunder: '#fbbf24',
                },
                // Accent
                accent: {
                    primary: '#6366f1',
                    secondary: '#8b5cf6',
                    glow: '#818cf8',
                },
                neon: {
                    blue: '#00d4ff',
                    purple: '#b44aff',
                    green: '#00ff88',
                    pink: '#ff2d92',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'system-ui', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'glass': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            },
            boxShadow: {
                'glow-sm': '0 0 10px rgba(99, 102, 241, 0.3)',
                'glow-md': '0 0 20px rgba(99, 102, 241, 0.4)',
                'glow-lg': '0 0 40px rgba(99, 102, 241, 0.5)',
                'glow-common': '0 0 15px rgba(156, 163, 175, 0.4)',
                'glow-rare': '0 0 20px rgba(59, 130, 246, 0.5)',
                'glow-epic': '0 0 25px rgba(168, 85, 247, 0.5)',
                'glow-legendary': '0 0 30px rgba(245, 158, 11, 0.6)',
                'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
            },
            animation: {
                'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
                'float': 'float 3s ease-in-out infinite',
                'card-flip': 'card-flip 0.6s ease-in-out',
                'slide-up': 'slide-up 0.3s ease-out',
                'slide-down': 'slide-down 0.3s ease-out',
                'fade-in': 'fade-in 0.3s ease-out',
                'shimmer': 'shimmer 2s linear infinite',
                'spin-slow': 'spin 3s linear infinite',
                'bounce-in': 'bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            },
            keyframes: {
                'glow-pulse': {
                    '0%': { boxShadow: '0 0 5px rgba(99, 102, 241, 0.3)' },
                    '100%': { boxShadow: '0 0 25px rgba(99, 102, 241, 0.6)' },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'card-flip': {
                    '0%': { transform: 'rotateY(0deg)' },
                    '100%': { transform: 'rotateY(180deg)' },
                },
                'slide-up': {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'slide-down': {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'shimmer': {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                'bounce-in': {
                    '0%': { transform: 'scale(0.3)', opacity: '0' },
                    '50%': { transform: 'scale(1.05)' },
                    '70%': { transform: 'scale(0.9)' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
};
