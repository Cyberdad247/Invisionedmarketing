"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Edit, MoreVertical, Play, Trash2, Users, PlusCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface CrewAgent {
  id: number
  name: string
  role: string
  goal: string
  backstory: string
  model: string
  tools: any[]
  created_at: string
}

export function CrewAgentsList() {
  const [agents, setAgents] = useState<CrewAgent[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Fetch agents from API
    const fetchAgents = async () => {
      try {
        setLoading(true)
        // In a real implementation, this would be an API call
        // const response = await fetch('/api/crew/agents')
        // const data = await response.json()

        // Simulated data for demonstration
        const data = [
          {
            id: 1,
            name: "Research Assistant",
            role: "Researcher",
            goal: "Find accurate information on any topic",
            backstory: "You are an expert researcher with access to vast knowledge.",
            model: "gpt-4o",
            tools: [{ name: "search", description: "Search for information" }],
            created_at: "2023-05-01T12:00:00Z",
          },
          {
            id: 2,
            name: "Content Writer",
            role: "Writer",
            goal: "Create engaging content based on research",
            backstory: "You are a skilled writer who can create compelling content.",
            model: "gpt-4o",
            tools: [],
            created_at: "2023-05-02T14:30:00Z",
          },
          {
            id: 3,
            name: "Data Analyst",
            role: "Analyst",
            goal: "Analyze data and provide insights",
            backstory: "You are a data expert who can extract meaningful insights.",
            model: "gpt-4o",
            tools: [{ name: "analyze_data", description: "Analyze data sets" }],
            created_at: "2023-05-03T09:15:00Z",
          },
        ]

        setAgents(data)
      } catch (error) {
        console.error("Error fetching agents:", error)
        toast({
          title: "Error",
          description: "Failed to load agents. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAgents()
  }, [toast])

  const handleDeleteAgent = async (id: number) => {
    try {
      // In a real implementation, this would be an API call
      // await fetch(`/api/crew/agents/${id}`, { method: 'DELETE' })

      // Update local state
      setAgents(agents.filter((agent) => agent.id !== id))

      toast({
        title: "Agent deleted",
        description: "The agent has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting agent:", error)
      toast({
        title: "Error",
        description: "Failed to delete agent. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-1/2 mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-2" />
              <Skeleton className="h-4 w-4/6" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (agents.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>No Agents Found</CardTitle>
          <CardDescription>
            You haven't created any CrewAI agents yet. Get started by creating your first agent.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/crew/agents/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Agent
            </Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.map((agent) => (
        <Card key={agent.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{agent.name}</CardTitle>
                <CardDescription>{agent.role}</CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/crew/agents/${agent.id}`}>
                      <Play className="mr-2 h-4 w-4" />
                      Run
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/crew/agents/${agent.id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDeleteAgent(agent.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Goal</p>
                <p className="text-sm line-clamp-2">{agent.goal}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Model</p>
                <Badge variant="outline">{agent.model}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tools</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {agent.tools.length > 0 ? (
                    agent.tools.map((tool, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tool.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">No tools</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/crew/agents/${agent.id}`}>
                <Play className="mr-2 h-3 w-3" />
                Run
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/crew/workflows/new?agent=${agent.id}`}>
                <Users className="mr-2 h-3 w-3" />
                Add to Workflow
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
