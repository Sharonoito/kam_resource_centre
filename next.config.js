/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. THE WEIGHT SHRUNKER: This helps fix that 300MB Vercel error
  output: 'standalone',

  experimental: {
    // 2. THE RENAME: Updated from middleware... to proxy...
    proxyClientMaxBodySize: 50 * 1024 * 1024, // 50MB
    
    // 3. THE PDF FIX: Keeps PDF.js happy without bundling the heavy 'canvas' library
    serverComponentsExternalPackages: ['canvas'],
  },

  // 4. IMAGE SETTINGS: Kept exactly as you had them for Power BI
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'app.powerbi.com',
      },
      {
        protocol: 'https',
        hostname: '*.powerbi.com',
      },
    ],
  },
};

module.exports = nextConfig;