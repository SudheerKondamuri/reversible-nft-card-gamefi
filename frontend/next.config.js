/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'gateway.pinata.cloud' },
            { protocol: 'https', hostname: '**.ipfs.dweb.link' },
            { protocol: 'https', hostname: 'ipfs.io' },
        ],
    },
    webpack: (config) => {
        config.resolve.fallback = { fs: false, net: false, tls: false };
        config.externals.push('pino-pretty', 'lokijs', 'encoding');
        return config;
    },
};

module.exports = nextConfig;
