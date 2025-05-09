"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Bot, Settings, Play, Pause, Edit } from "lucide-react"
import Link from "next/link"
import type { CognitoAgent } from "@/types/cognito"

interface AgentManagementModuleProps {
  initialAgents: CognitoAgent[]
}

export default function AgentManagementModule({ initialAgents }: AgentManagementModuleProps) {
  const [agents, setAgents] = useState<CognitoAgent[]>(initialAgents)

  // Predefined agent templates based on the Cognito platform
  const agentTemplates = [
    {
      name: "Strategos",
      role: "Strategic Planning",
      description: "Handles market analysis, goal setting, and audience definition",
      coreSkills: ["Market Analysis", "Goal Setting", "Audience Definition"],
      hitlPoints: ["Strategy Approval", "Budget Allocation"],
    },
    {
      name: "Lexica",
      role: "Content Creation (Text)",
      description: "Creates blog posts, ad copy, and social media content",
      coreSkills: ["Blog Writing", "Ad Copy", "Social Media Posts"],
      hitlPoints: ["Key Content Approval", "Brand Voice Check"],
    },
    {
      name: "Visio",
      role: "Content Creation (Visual)",
      description: "Generates images and basic graphic designs",
      coreSkills: ["Image Generation", "Basic Graphic Design"],
      hitlPoints: ["Brand-Sensitive Visual Approval"],
    },
    {
      name: "Optimus",
      role: "Media Buying & Optimization",
      description: "Manages ad platforms and controls budgets",
      coreSkills: ["Ad Platform Management", "Budget Control"],
      hitlPoints: ["Budget Limits", "Campaign Changes"],
    },
    {
      name: "Connecta",
      role: "Social Media Management",
      description: "Handles post scheduling and engagement",
      coreSkills: ["Post Scheduling", "Engagement"],
      hitlPoints: ["Crisis Response", "High-Impact Initiatives"],
    },
    {
      name: "Crawler",
      role: "SEO Audit",
      description: "Analyzes websites and researches keywords",
      coreSkills: ["Website Analysis", "Keyword Research"],
      hitlPoints: ["Major Technical SEO Changes"],
    },
    {
      name: "Fixer",
      role: "Technical Optimization",
      description: "Makes code adjustments and schema markup",
      coreSkills: ["Code Adjustments", "Schema Markup"],
      hitlPoints: ["Significant Website Modifications"],
    },
    {
      name: "Insight",
      role: "Analytics & Reporting",
      description: "Analyzes data and tracks KPIs",
      coreSkills: ["Data Analysis", "KPI Tracking"],
      hitlPoints: ["Complex Report Interpretation"],
    },
    {
      name: "Converse",
      role: "Client Communication",
      description: "Handles automated updates and meeting scheduling",
      coreSkills: ["Automated Updates", "Meeting Scheduling"],
      hitlPoints: ["Onboarding", "Strategic Discussions"],
    },
    {
      name: "Sentinel",
      role: "Error Handling",
      description: "Analyzes logs and performs system checks",
      coreSkills: ["Log Analysis", "System Checks"],
      hitlPoints: ["Complex Error Escalation"],
    },
    {
      name: "NexusLink",
      role: "Human Interface",
      description: "Presents data and handles interventions",
      coreSkills: ["Data Presentation", "Intervention Handling"],
      hitlPoints: ["All human interactions"],
    },
  ]

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Agent Management Module</h2>
        <Link href="/cognito/agents/create">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Create Agent
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.length > 0 ? (
          agents.map((agent) => (
            <Card key={agent.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={getAutonomyColor(agent.autonomyLevel || "medium")}>
                    {agent.autonomyLevel
                      ? agent.autonomyLevel.charAt(0).toUpperCase() + agent.autonomyLevel.slice(1)
                      : "Medium"}{" "}
                    Autonomy
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      agent.status === "active"
                        ? "bg-green-500/15 text-green-600"
                        : agent.status === "inactive"
                          ? "bg-amber-500/15 text-amber-600"
                          : "bg-slate-500/15 text-slate-600"
                    }
                  >
                    {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                  </Badge>
                </div>
                <CardTitle className="flex items-center gap-2 mt-2">
                  <Bot className="h-5 w-5" />
                  {agent.name}
                </CardTitle>
                <CardDescription>{agent.role || "No role defined"}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground mb-3">{agent.description}</p>

                <div className="space-y-2">
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground">Core Skills</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {agent.coreSkills && agent.coreSkills.length > 0 ? (
                        agent.coreSkills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">No skills defined</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground">HITL Review Points</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {agent.hitlReviewPoints && agent.hitlReviewPoints.length > 0 ? (
                        agent.hitlReviewPoints.map((point, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-purple-500/15 text-purple-600">
                            {point.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">No review points defined</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <div className="flex w-full justify-between">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/cognito/agents/${agent.id}`}>
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </Link>
                  </Button>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    {agent.status === "active" ? (
                      <Button size="sm" variant="outline" className="text-amber-600">
                        <Pause className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="text-green-600">
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-3 text-center py-10">
            <h3 className="text-lg font-medium">No agents found</h3>
            <p className="text-muted-foreground mt-1">Create your first agent to get started</p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agentTemplates.slice(0, 6).map((template, index) => (
                <Card key={index} className="cursor-pointer hover:border-primary transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <CardDescription>{template.role}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" variant="outline" className="w-full" asChild>
                      <Link href={`/cognito/agents/create?template=${index}`}>
                        <PlusCircle className="h-3 w-3 mr-1" />
                        Create
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <Button className="mt-4" asChild>
              <Link href="/cognito/agents/create">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Custom Agent
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
