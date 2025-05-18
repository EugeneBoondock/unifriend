/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': __dirname,
    };
    return config;
  },
  experimental: {
    turbo: {
      rules: {
        // Configure any specific rules for Turbopack
      },
    },
  },
  allowedDevOrigins: ['3001-idx-unifriend-1744290562446.cluster-blu4edcrfnajktuztkjzgyvzek.cloudworkstations.dev'],
}

module.exports = nextConfig
