/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Server Components
  reactStrictMode: true,
  
  // Configure image domains for external images
  images: {
    domains: [
      'vercel.blob.core.windows.net',
      'huggingface.co',
      'n8n.io',
      'api.openai.com',
      'ollama.ai'
    ],
    unoptimized: true,
  },
  
  // Enable experimental server actions and configure function timeout
  experimental: { // Enable experimental server actions
    serverActions: {},
  },
  
  // Configure redirects if needed
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/cognito',
        permanent: true,
      },
    ]
  },
  
  // Ignore ESLint errors during build
  eslint: {
  },
  
  // Ignore TypeScript errors during build
  typescript: {
  },
}

export default nextConfig
