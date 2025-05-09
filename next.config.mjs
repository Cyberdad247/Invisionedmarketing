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
  
  // Increase serverless function timeout for AI operations
  serverRuntimeConfig: {
    // Will only be available on the server side
    functionTimeout: 60, // seconds
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
  

}

export default nextConfig
