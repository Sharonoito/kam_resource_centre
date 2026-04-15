/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',


  serverExternalPackages: ['canvas', 'pdfjs-dist'],

  experimental: {
    proxyClientMaxBodySize: 50 * 1024 * 1024,
  },

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