import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: 'class',
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    plugins: [
        require('@tailwindcss/typography'),
    ],
    theme: {
        extend: {
            typography: (theme: any) => ({
                DEFAULT: {
                    css: {
                        color: theme('colors.gray.300'),
                        '[class~="lead"]': {
                            color: theme('colors.gray.300'),
                        },
                        a: {
                            color: theme('colors.brand.primary'),
                            '&:hover': {
                                color: theme('colors.brand.secondary'),
                            },
                        },
                        strong: {
                            color: theme('colors.brand.white'),
                        },
                        'ol > li::marker': {
                            color: theme('colors.brand.primary'),
                        },
                        'ul > li::marker': {
                            color: theme('colors.brand.primary'),
                        },
                        hr: {
                            borderColor: theme('colors.brand.primary'),
                            opacity: 0.1,
                        },
                        blockquote: {
                            borderLeftColor: theme('colors.brand.primary'),
                            color: theme('colors.gray.200'),
                        },
                        h1: {
                            color: theme('colors.brand.white'),
                        },
                        h2: {
                            color: theme('colors.brand.white'),
                        },
                        h3: {
                            color: theme('colors.brand.white'),
                        },
                        h4: {
                            color: theme('colors.brand.white'),
                        },
                        code: {
                            color: theme('colors.brand.primary'),
                        },
                        'pre code': {
                            color: (_connection: any) => 'inherit',
                        },
                        thead: {
                            color: theme('colors.brand.white'),
                            borderBottomColor: theme('colors.brand.primary'),
                        },
                        'tbody tr': {
                            borderBottomColor: theme('colors.white'),
                            opacity: 0.1,
                        },
                    },
                },
            }),
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
};
export default config;
