/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "xufhygwhdrhklvqomojy.supabase.co", // Your Supabase project-specific hostname
				port: "", // Default for https
				pathname: "/storage/v1/object/public/**", // Allows any path within your public storage
			},
			// Add other trusted hostnames here if needed in the future
		],
		formats: ["image/webp", "image/avif"], // Enable modern image formats
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Responsive breakpoints
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Fixed sizes for smaller images
		minimumCacheTTL: 60 * 60 * 24 * 30, // Cache images for 30 days
		dangerouslyAllowSVG: false, // Disable SVG for security
		contentSecurityPolicy:
			"default-src 'self'; script-src 'none'; sandbox;", // CSP for images
	},
};

module.exports = nextConfig;
