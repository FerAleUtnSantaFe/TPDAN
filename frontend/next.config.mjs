/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    basePath: '',
    webpack: (config) => {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });
        return config;
    },
};

export default nextConfig;

