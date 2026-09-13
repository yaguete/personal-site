import path from 'node:path'
import { fileURLToPath } from 'node:url'
import createMDX from '@next/mdx';

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  // Enable Turbopack compatibility with webpack plugins (e.g., @next/mdx)
  turbopack: {},
  outputFileTracingRoot: __dirname,
  outputFileTracingIncludes: {
    '/api/ask': ['./app/blog/**/*.mdx'],
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
