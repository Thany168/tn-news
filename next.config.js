/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "news-api-production-5937.up.railway.app",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "news-api-production-5937.up.railway.app",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
