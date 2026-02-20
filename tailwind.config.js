/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Brand Core
                primary: "#D82818",
                primaryDark: "#B82818",
                primaryActive: "#981E14",
                accent: "#F0D880",
                accentDark: "#E8C968",
                light: "#F8F8F8",
                neutral: "#D8D8D8",
                // Dark Mode Backgrounds
                dark: "#0F1115",
                darkSurface: "#171A20",
                darkCard: "#1E222A",
                darkBorder: "#2A2E36",
                // Functional Colors
                success: "#22C55E",
                warning: "#F59E0B",
                error: "#EF4444",
                info: "#3B82F6",
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
