/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'lsbvcbyyslygxyunvoga.supabase.co',
                port: '',
                pathname: '/**',
            },
        ],
    },
    devIndicators: {
        allowedDevOrigins: ['10.190.74.210'],
    },

    // Security Headers to fix Burp Suite findings
    async headers() {
        return [
            {
                // Apply to all routes
                source: '/:path*',
                headers: [
                    // Fix: Frameable response (Clickjacking)
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN',
                    },
                    // Fix: Strict transport security not enforced (HSTS)
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=31536000; includeSubDomains; preload',
                    },
                    // Fix: Content-Security-Policy frame-ancestors (additional clickjacking protection)
                    {
                        key: 'Content-Security-Policy',
                        value: "frame-ancestors 'self'",
                    },
                    // Prevent MIME type sniffing
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    // Control referrer information
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    // XSS Protection (legacy but still useful)
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    // Permissions Policy (restrict browser features)
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()',
                    },
                    // Cross-Origin Embedder Policy
                    {
                        key: 'Cross-Origin-Embedder-Policy',
                        value: 'credentialless',
                    },
                    // Cross-Origin Opener Policy
                    {
                        key: 'Cross-Origin-Opener-Policy',
                        value: 'same-origin-allow-popups',
                    },
                    // Cross-Origin Resource Policy
                    {
                        key: 'Cross-Origin-Resource-Policy',
                        value: 'same-origin',
                    },
                ],
            },
            {
                // Prevent caching of sensitive pages (Fix: Cacheable HTTPS response)
                source: '/login',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
                    },
                    {
                        key: 'Pragma',
                        value: 'no-cache',
                    },
                ],
            },
            {
                // Prevent caching of dashboard/authenticated areas
                source: '/dashboard/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
                    },
                    {
                        key: 'Pragma',
                        value: 'no-cache',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
