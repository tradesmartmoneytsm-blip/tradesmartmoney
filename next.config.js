/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
    scrollRestoration: true,
  },
  
  // Compression and optimization
  compress: true,
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets-netstorage.groww.in',
        port: '',
        pathname: '/stock-assets/logos2/**',
      },
    ],
  },
  
  // Security and SEO headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Security headers
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
        ]
      },
      // Static assets caching
      {
        source: '/(robots.txt|sitemap.xml)',
        headers: [
          {
            key: 'Cache-Control', 
            value: 'public, max-age=86400, must-revalidate'
          }
        ]
      }
    ];
  },
  
  // Redirects for SEO (clean URLs)
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/market/sectors',
        destination: '/market/sector-performance',
        permanent: true,
      },
      // Redirect old/non-existent pages to relevant content
      {
        source: '/security',
        destination: '/privacy-policy#data-security',
        permanent: true,
      }
    ];
  },
  
  // Enable strict mode for better performance
  reactStrictMode: true,
  
  // Remove powered by header
  poweredByHeader: false,
  
  // Trailing slash handling
  trailingSlash: false,
  
  // Environment variables
  env: {
    SITE_URL: 'https://www.tradesmartmoney.com',
    SITE_NAME: 'TradeSmartMoney',
  },
  
  // Webpack configuration to exclude docs-site
  webpack: (config, { isServer }) => {
    // Exclude docs-site from the build
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/node_modules', '**/docs-site/**'],
    };
    return config;
  },
};

module.exports = nextConfig; 