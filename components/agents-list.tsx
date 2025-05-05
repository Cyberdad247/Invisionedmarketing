"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bot, ExternalLink, MoreHorizontal, PlusCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { deleteAgent, updateAgentStatus, type Agent } from "@/app/actions/agent-actions"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface AgentsListProps {
  initialAgents: Agent[]
}

export default function AgentsList({ initialAgents }: AgentsListProps) {
  const [agents, setAgents] = useState<Agent[]>(initialAgents)
  const router = useRouter()
  const { toast } = useToast()

  const handleDeleteAgent = async (id: number) => {
    try {
      await deleteAgent(id)
      setAgents(agents.filter((agent) => agent.id !== id))
      toast({
        title: "Agent deleted",
        description: "The agent has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the agent. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleStatusChange = async (id: number, status: "active" | "inactive" | "draft") => {
    try {
      await updateAgentStatus(id, status)
      setAgents(agents.map((agent) => (agent.id === id ? { ...agent, status } : agent)))
      toast({
        title: "Status updated",
        description: `Agent status changed to ${status}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update agent status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/15 text-green-600 hover:bg-green-500/25"
      case "inactive":
        return "bg-amber-500/15 text-amber-600 hover:bg-amber-500/25"
      case "draft":
        return "bg-slate-500/15 text-slate-600 hover:bg-slate-500/25"
      default:
        return "bg-slate-500/15 text-slate-600 hover:bg-slate-500/25"
    }
  }

  if (agents.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">No agents found</h3>
        <p className="text-muted-foreground mt-1">Create your first agent to get started</p>
        <Link href="/create" className="mt-4 inline-block">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Create Agent
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {agents.map((agent) => (
        <Card key={agent.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Badge className={getStatusColor(agent.status)} variant="outline">
                {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/agents/${agent.id}`} className="cursor-pointer">
                      Edit agent
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/agents/${agent.id}/deploy`} className="cursor-pointer">
                      Deploy
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange(agent.id, "active")}
                    disabled={agent.status === "active"}
                  >
                    Set as active
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange(agent.id, "inactive")}
                    disabled={agent.status === "inactive"}
                  >
                    Set as inactive
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={() => handleDeleteAgent(agent.id)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardTitle className="flex items-center gap-2 mt-2">
              <Bot className="h-5 w-5" />
              {agent.name}
            </CardTitle>
            <CardDescription>{agent.description}</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="font-medium">Model:</span>
              <span className="ml-1">{agent.model}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <span className="font-medium">Created:</span>
              <span className="ml-1">{new Date(agent.created_at).toLocaleDateString()}</span>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <div className="flex w-full justify-between">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/agents/${agent.id}/test`}>Test</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href={`/agents/${agent.id}/deploy`} className="flex items-center gap-1">
                  Deploy
                  <ExternalLink className="h-3.5 w-3.5 ml-1" />
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
