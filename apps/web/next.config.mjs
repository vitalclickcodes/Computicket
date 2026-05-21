/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // `output: 'standalone'` shrinks the Docker image but disables some
  // Vercel-specific optimisations (ISR cache, edge functions). Opt in
  // via BUILD_TARGET=standalone for the Docker pipeline; leave it off
  // by default so Vercel builds get the native path.
  ...(process.env.BUILD_TARGET === 'standalone' ? { output: 'standalone' } : {}),
};

export default nextConfig;
