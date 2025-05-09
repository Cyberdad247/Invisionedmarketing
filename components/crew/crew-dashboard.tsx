"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CrewAgentsList } from "./crew-agents-list"
import { CrewWorkflowsList } from "./crew-workflows-list"
import { CrewAnalytics } from "./crew-analytics"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export function CrewAIDashboard() {
  const [activeTab, setActiveTab] = useState("agents")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CrewAI Dashboard</h1>
          <p className="text-muted-foreground">Manage collaborative AI agents and orchestrate complex workflows</p>
        </div>
        <div className="flex space-x-2">
          {activeTab === "agents" && (
            <Button asChild>
              <Link href="/crew/agents/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Agent
              </Link>
            </Button>
          )}
          {activeTab === "workflows" && (
            <Button asChild>
              <Link href="/crew/workflows/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Workflow
              </Link>
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="agents" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="agents" className="space-y-4">
          <CrewAgentsList />
        </TabsContent>
        <TabsContent value="workflows" className="space-y-4">
          <CrewWorkflowsList />
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <CrewAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  )
}
