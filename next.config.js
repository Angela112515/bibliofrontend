/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'img.daisyui.com',
      'localhost',
      '127.0.0.1',
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4400',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '4400',
        pathname: '/uploads/**',
      },
    ],
  },
};

module.exports = nextConfig;
