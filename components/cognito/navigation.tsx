"use client"

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
