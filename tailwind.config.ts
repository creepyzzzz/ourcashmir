import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: 'class',
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"DM Sans"', 'sans-serif'],
            },
            colors: {
                brand: {
                    primary: '#00C853',      // Vibrant Green
                    secondary: '#2E7D32',    // Darker Green
                    dark: '#121212',         // Matte Black
                    darker: '#000000',       // Pure Black
                    white: '#FFFFFF',        // White
                    offwhite: '#F5F5F5',     // Off White
                    surface: '#0D2012',      // Very Dark Green Surface for cards

                    // Legacy mappings (to be replaced)
                    yellow: '#00C853',       // Replaced with primary
                    black: '#121212',        // Replaced with dark
                    bg: '#000000',           // Replaced with darker (Background)
                    lightGreen: '#1B5E20',   // Dark Green Background for cards
                    muted: '#9CA3AF',
                    accentGreen: '#4CAF50',  // Accent
                }
            }
        },
    },
    plugins: [],
};
export default config;
