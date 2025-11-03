/** @type {import('next').NextConfig} */
const nextConfig = { 
  reactStrictMode: true, 
  experimental: { typedRoutes: true },
  output: 'export' // ←★ この1行を追加！
};

export default nextConfig;
