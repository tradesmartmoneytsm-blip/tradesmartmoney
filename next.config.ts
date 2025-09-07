import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: ['dhan.co'],
  },
  
  // Experimental features for performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
  
  // Custom redirects and rewrites
  async rewrites() {
    return [
      // Serve ads.txt directly without redirect
      {
        source: '/ads.txt',
        destination: '/ads.txt',
        has: [
          {
            type: 'host',
            value: 'tradesmartmoney.com',
          },
        ],
      },
    ];
  },
  
  // Static file serving for ads.txt
  async headers() {
    return [
      // Ads.txt specific headers
      {
        source: '/ads.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate',
          },
        ],
      },
      // General security headers
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=60, stale-while-revalidate=300'
          }
        ]
      },
      {
        source: '/(.*\\.(ico|png|jpg|jpeg|gif|webp|avif|svg))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  },
};

export default nextConfig;
