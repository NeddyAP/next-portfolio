/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [], // Add any image domains if needed
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.pdf$/,
      type: "asset",
      resourceQuery: /url/,
    });
    return config;
  },
  // Other Next.js config options
}

module.exports = nextConfig
