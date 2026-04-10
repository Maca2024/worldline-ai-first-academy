/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output creates a minimal self-contained bundle for Docker.
  // Vercel ignores this setting — safe to always enable.
  output: 'standalone',
};

export default nextConfig;
