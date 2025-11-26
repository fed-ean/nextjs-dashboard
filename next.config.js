/** @type {import('next').NextConfig} */
const nextConfig = {output: 'export',            // si necesita exportación estática
  experimental: {
    globalNotFound: true       // habilita 404 global
  },
  async rewrites() {
    return [
      {
        source: '/graphql',
        destination: 'https://radioempresaria.com.ar/graphql',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'radioempresaria.com.ar',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
};

module.exports = nextConfig;
