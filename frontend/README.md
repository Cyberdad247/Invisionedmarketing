# Invisionedmarketing Frontend

This directory contains the React-based frontend for the Invisionedmarketing platform.

## Structure

- `/src/components`: Reusable UI components
- `/src/pages`: Page components for routing
- `/src/api`: API client and service layers
- `/src/hooks`: Custom React hooks
- `/src/state`: State management (using Zustand)
- `/src/utils`: Utility functions and helpers

## Setup

1. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

2. Start the development server:
   \`\`\`
   npm run dev
   \`\`\`

3. Build for production:
   \`\`\`
   npm run build
   \`\`\`

## Testing

Run tests with:
\`\`\`
npm test
\`\`\`

## Environment Variables

Create a `.env.local` file with the following variables:
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:8000
