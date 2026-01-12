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
};

export default nextConfig;
