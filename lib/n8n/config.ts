export interface N8nConfig {
  baseUrl: string
  apiKey: string
  webhookBaseUrl: string
  selfHosted: true // Always self-hosted
}

// Default configuration for self-hosted n8n
export function getN8nConfig(): N8nConfig {
  return {
    baseUrl: process.env.N8N_API_URL || "http://localhost:5678",
    apiKey: process.env.N8N_API_KEY || "",
    webhookBaseUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    selfHosted: true,
  }
}

// Self-hosted n8n setup instructions
export const selfHostedSetupInstructions = {
  title: "Self-Hosted n8n Setup",
  steps: [
    {
      title: "Install n8n",
      description: "Install n8n on your server using Docker or npm.",
      commands: ["npm install n8n -g", "docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n"],
    },
    {
      title: "Configure API Access",
      description: "Enable the n8n REST API and create an API key.",
      commands: [
        "n8n start --tunnel",
        "docker run -it --rm --name n8n -p 5678:5678 -e N8N_BASIC_AUTH_ACTIVE=true -e N8N_BASIC_AUTH_USER=admin -e N8N_BASIC_AUTH_PASSWORD=password n8nio/n8n",
      ],
    },
    {
      title: "Connect to Cognito",
      description: "Add your n8n URL and API key to your Cognito environment variables.",
      envVars: ["N8N_API_URL=http://your-n8n-instance:5678", "N8N_API_KEY=your-api-key"],
    },
  ],
}
