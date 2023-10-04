/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'uploadthing.com',
      'res.cloudinary.com',
      'img.clerk.com',
      'images.unsplash.com',
      'utfs.io',
    ],
  },
  experimental: {
    serverActions: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
