/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

experimental: {
    proxyClientMaxBodySize: 50 * 1024 * 1024,
    // This prevents these heavy hitters from being bundled into your API functions
    serverComponentsExternalPackages: ['canvas', 'pdfjs-dist'],
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