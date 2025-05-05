"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Info, Plus, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from "next/link"

interface AgentPortfolioCardProps {
  agent: {
    id: string
    name: string
    role: string
    description: string
    coreSkills: string[]
    hitlPoints: string[]
    autonomyLevel: string
    color: string
    icon: string
  }
}

export default function AgentPortfolioCard({ agent }: AgentPortfolioCardProps) {
  const [isDeployed, setIsDeployed] = useState(false)

  const getAutonomyColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-blue-500/15 text-blue-600"
      case "medium":
        return "bg-yellow-500/15 text-yellow-600"
      case "high":
        return "bg-orange-500/15 text-orange-600"
      case "full":
        return "bg-red-500/15 text-red-600"
      default:
        return "bg-gray-500/15 text-gray-600"
    }
  }

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-100 border-blue-200",
      indigo: "bg-indigo-100 border-indigo-200",
      purple: "bg-purple-100 border-purple-200",
      green: "bg-green-100 border-green-200",
      cyan: "bg-cyan-100 border-cyan-200",
      amber: "bg-amber-100 border-amber-200",
      orange: "bg-orange-100 border-orange-200",
      sky: "bg-sky-100 border-sky-200",
      pink: "bg-pink-100 border-pink-200",
      red: "bg-red-100 border-red-200",
      violet: "bg-violet-100 border-violet-200",
    }
    return colorMap[color] || "bg-gray-100 border-gray-200"
  }

  return (
    <Card className={`border-2 ${getColorClass(agent.color)}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="text-2xl">{agent.icon}</div>
            <CardTitle>{agent.name}</CardTitle>
          </div>
          <Badge className={getAutonomyColor(agent.autonomyLevel)}>
            {agent.autonomyLevel.charAt(0).toUpperCase() + agent.autonomyLevel.slice(1)} Autonomy
          </Badge>
        </div>
        <CardDescription>{agent.role}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground mb-3">{agent.description}</p>

        <div className="space-y-2">
          <div>
            <h4 className="text-xs font-medium text-muted-foreground">Core Skills</h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {agent.coreSkills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium text-muted-foreground">HITL Review Points</h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {agent.hitlPoints.map((point, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-purple-500/15 text-purple-600">
                  {point}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex w-full justify-between">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Info className="h-4 w-4 mr-1" />
                Details
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className="text-2xl">{agent.icon}</div>
                  {agent.name} - {agent.role}
                </DialogTitle>
                <DialogDescription>{agent.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <h4 className="text-sm font-medium">Core Skills</h4>
                  <ul className="mt-2 space-y-1">
                    {agent.coreSkills.map((skill, index) => (
                      <li key={index} className="text-sm flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium">HITL Review Points</h4>
                  <ul className="mt-2 space-y-1">
                    {agent.hitlPoints.map((point, index) => (
                      <li key={index} className="text-sm flex items-center gap-2">
                        <div className="text-lg">👤</div>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium">Autonomy Level</h4>
                  <p className="text-sm mt-1">
                    {agent.autonomyLevel.charAt(0).toUpperCase() + agent.autonomyLevel.slice(1)} - This agent requires{" "}
                    {agent.autonomyLevel === "low"
                      ? "significant human oversight"
                      : agent.autonomyLevel === "medium"
                        ? "regular human review at key decision points"
                        : "minimal human intervention for most tasks"}
                    .
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" asChild>
                  <Link href={`/cognito/agents/templates/${agent.id}`}>Create from Template</Link>
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            size="sm"
            variant={isDeployed ? "outline" : "default"}
            onClick={() => setIsDeployed(!isDeployed)}
            className={isDeployed ? "text-green-600" : ""}
          >
            {isDeployed ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Deployed
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1" />
                Deploy
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
