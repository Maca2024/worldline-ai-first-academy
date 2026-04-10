/** @type {import('next').NextConfig} */
const nextConfig = {
  // Docker deployments: BUILD_TARGET=docker npm run build
  // Vercel: no output override needed (Vercel handles this internally)
  ...(process.env.BUILD_TARGET === 'docker' && { output: 'standalone' }),
};

export default nextConfig;
