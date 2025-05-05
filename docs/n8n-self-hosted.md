# Self-Hosted n8n Integration Guide

This guide explains how to set up a self-hosted n8n instance and integrate it with the Cognito platform.

## Prerequisites

- A server or VM to host n8n
- Docker (recommended) or Node.js installed
- Network access between your Cognito platform and n8n instance

## Installation Options

### Using Docker (Recommended)

\`\`\`bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=password \
  -e N8N_PROTOCOL=https \
  -e NODE_ENV=production \
  n8nio/n8n
\`\`\`

### Using npm

\`\`\`bash
npm install n8n -g
n8n start
\`\`\`

## Security Considerations

1. **Enable Authentication**: Always enable authentication for your n8n instance
2. **Use HTTPS**: Set up a reverse proxy with HTTPS
3. **Restrict Network Access**: Limit access to your n8n instance
4. **Regular Backups**: Back up your n8n workflows and data

## Integrating with Cognito

1. Generate an API key in your n8n instance
2. Add the n8n URL and API key to your Cognito environment variables:
   - `N8N_API_URL`: Your n8n instance URL (e.g., https://n8n.yourdomain.com)
   - `N8N_API_KEY`: Your n8n API key

## Troubleshooting

If you encounter connection issues:

1. Verify network connectivity between Cognito and n8n
2. Check that your n8n instance is running and accessible
3. Verify the API key is correct
4. Check n8n logs for any errors
\`\`\`

## 6. Update Navigation to Include n8n Settings

```typescriptreact file="components/cognito/navigation.tsx"
[v0-no-op-code-block-prefix]"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Bot, Share2, Database, Users, Shield, BarChart2, Settings, Network, ServerIcon } from 'lucide-react'

export default function CognitoNavigation() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Agents",
      href: "/cognito/agents/portfolio",
      icon: Bot,
    },
    {
      name: "Workflows",
      href: "/cognito/workflows",
      icon: Share2,
    },
    {
      name: "Data Lake",
      href: "/cognito/data",
      icon: Database,
    },
    {
      name: "HITL Interface",
      href: "/cognito/hitl",
      icon: Users,
    },
    {
      name: "Integrations",
      href: "/cognito/integrations",
      icon: Network,
    },
    {
      name: "Security",
      href: "/cognito/security",
      icon: Shield,
    },
    {
      name: "Performance",
      href: "/cognito/performance",
      icon: BarChart2,
    },
    {
      name: "Settings",
      href: "/cognito/settings",
      icon: Settings,
    },
    {
      name: "n8n Settings",
      href: "/cognito/settings/n8n",
      icon: ServerIcon,
    },
  ]

  return (
    <div className="flex overflow-auto pb-2 mb-6 border-b">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center px-4 py-2 text-sm font-medium rounded-md mr-2 whitespace-nowrap",
            pathname === item.href
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted",
          )}
        >
          <item.icon className="h-4 w-4 mr-2" />
          {item.name}
        </Link>
      ))}
    </div>
  )
}
