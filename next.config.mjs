import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': resolve(__dirname, 'src'),
    };
    return config;
  },
  images: {
    domains: ['nextjs.org', 'avatars.githubusercontent.com'],
    disableStaticImages: false,
  },
};

export default nextConfig;
