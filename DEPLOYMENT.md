# Deployment Guide for Cognito Platform

## Environment Variables

Set up the following environment variables in your Vercel project:

### Database Configuration
- `NEON_NEON_DATABASE_URL`: Your Neon PostgreSQL connection string

### n8n Configuration
- `N8N_API_URL`: URL of your n8n instance (e.g., https://n8n.yourdomain.com)
- `N8N_API_KEY`: API key for authenticating with n8n

### AI Model Providers
- `HUGGINGFACE_API_KEY`: API key for Hugging Face
- `OPENAI_API_KEY`: API key for OpenAI
- `ANTHROPIC_API_KEY`: API key for Anthropic
- `OPENROUTER_API_KEY`: API key for OpenRouter
- `MISTRAL_API_KEY`: API key for Mistral AI

### Blob Storage
- `BLOB_READ_WRITE_TOKEN`: Token for Vercel Blob storage

### Application Configuration
- `NEXTAUTH_SECRET`: Secret for NextAuth.js
- `NEXTAUTH_URL`: URL for NextAuth.js (your deployed app URL)
- `NEXT_PUBLIC_APP_URL`: Public URL of your application

## Deployment Steps

1. Install Vercel CLI: `npm install -g vercel`
2. Login to Vercel: `vercel login`
3. Link your project: `vercel link`
4. Set up environment variables: `vercel env pull`
5. Deploy to production: `npm run deploy`

## Database Migrations

Database migrations will run automatically during deployment. If you need to run them manually:

\`\`\`bash
npm run migrate
\`\`\`

## Troubleshooting

If you encounter issues with the deployment:

1. Check Vercel logs: `vercel logs`
2. Verify environment variables are set correctly
3. Ensure database connection is working
4. Check n8n connection and API key
