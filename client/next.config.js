/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "www.gravatar.com",
      "localhost",
      "ec2-54-89-217-115.compute-1.amazonaws.com",
    ],
  },
};

module.exports = nextConfig;
