/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // You can adjust this based on your preferences
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xufhygwhdrhklvqomojy.supabase.co', // Your Supabase project-specific hostname
        port: '', // Default for https
        pathname: '/storage/v1/object/public/**', // Allows any path within your public storage
      },
      // Add other trusted hostnames here if needed in the future
    ],
  },
};

module.exports = nextConfig;
