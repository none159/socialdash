/** @type {import('next').NextConfig} */
const nextConfig = { images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'files.edgestore.dev',
        pathname: '/**',
      },  {
        hostname:'upload.wikimedia.org',
      },
    ],}};

export default nextConfig;
