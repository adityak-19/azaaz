/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['raw.githubusercontent.com'],
  },
  env: {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    GITHUB_USERNAME: process.env.GITHUB_USERNAME,
    GITHUB_REPO: process.env.GITHUB_REPO,
  }
};

export default nextConfig;
