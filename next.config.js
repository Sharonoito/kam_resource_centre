/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  serverExternalPackages: ['canvas', 'pdfjs-dist'],
  
  experimental: {
    proxyClientMaxBodySize: 50 * 1024 * 1024,
    // This is the "Nuclear Option"
    outputFileTracingExcludes: {
      '*': [
        'node_modules/canvas/**',
        'node_modules/pdfjs-dist/**',
        '**/@swc/core-linux-x64-gnu/**',
        '**/@swc/core-linux-x64-musl/**',
      ],
    },
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'app.powerbi.com' },
      { protocol: 'https', hostname: '*.powerbi.com' },
    ],
  },
};

module.exports = nextConfig;