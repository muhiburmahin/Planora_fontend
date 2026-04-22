/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },
    // Explicit Turbopack root to silence workspace-root inference warnings
    turbopack: {
        root: './',
    },
};

export default nextConfig;