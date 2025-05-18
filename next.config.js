/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for development
  reactStrictMode: true,
  
  // Configure images
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
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Add path alias
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': __dirname,
    };
    
    // Handle CSS modules
    const cssRules = config.module.rules
      .find(rule => typeof rule.oneOf === 'object')
      .oneOf.filter(rule => Array.isArray(rule.use));
    
    // Find and update the CSS rule
    cssRules.forEach(rule => {
      rule.use.forEach(module => {
        if (module.loader && module.loader.includes('css-loader') && !module.loader.includes('postcss-loader')) {
          module.options = {
            ...module.options,
            importLoaders: 1,
            modules: false, // Disable CSS modules for global CSS
          };
        }
      });
    });
    
    return config;
  },
  
  // Enable experimental features
  experimental: {
    turbo: {
      rules: {
        // Configure Turbopack rules here
      },
    },
  },
  allowedDevOrigins: ['3001-idx-unifriend-1744290562446.cluster-blu4edcrfnajktuztkjzgyvzek.cloudworkstations.dev'],
}

module.exports = nextConfig
