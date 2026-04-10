/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix upload size limit for large PDFs (Turbopack)
  experimental: {
    turbopack: {
      resolveAlias: {
        canvas: false,
      },
    },
    serverActions: true,
      middlewareClientMaxBodySize: 50 * 1024 * 1024, // 50MB limit for uploads
  },

  // API body size limit for webpack (fallback)
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },

  // Image optimization
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
