/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['uploadthing.com', 'res.cloudinary.com', 'img.clerk.com'],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
