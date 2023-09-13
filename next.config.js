/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'uploadthing.com',
      'res.cloudinary.com',
      'img.clerk.com',
      'images.unsplash.com',
    ],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
