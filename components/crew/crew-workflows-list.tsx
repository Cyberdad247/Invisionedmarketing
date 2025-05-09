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
import { Edit, MoreVertical, Play, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface CrewWorkflow {
  id: number
  name: string
  description: string
  process: string
  agents: number[]
  tasks: any[]
  created_at: string
}

export function CrewWorkflowsList() {
  const [workflows, setWorkflows] = useState<CrewWorkflow[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Fetch workflows from API
    const fetchWorkflows = async () => {
      try {
        setLoading(true)
        // In a real implementation, this would be an API call
        // const response = await fetch('/api/crew/workflows')
        // const data = await response.json()

        // Simulated data for demonstration
        const data = [
          {
            id: 1,
            name: "Content Creation Pipeline",
            description: "Research, write, and edit content automatically",
            process: "sequential",
            agents: [1, 2, 3],
            tasks: [
              { description: "Research the topic", agent_index: 0 },
              { description: "Write initial draft", agent_index: 1 },
              { description: "Edit and improve content", agent_index: 2 },
            ],
            created_at: "2023-05-05T10:00:00Z",
          },
          {
            id: 2,
            name: "Market Analysis",
            description: "Analyze market trends and provide insights",
            process: "hierarchical",
            agents: [1, 3],
            tasks: [
              { description: "Gather market data", agent_index: 0 },
              { description: "Analyze trends and patterns", agent_index: 1 },
            ],
            created_at: "2023-05-06T14:30:00Z",
          },
        ]

        setWorkflows(data)
      } catch (error) {
        console.error("Error fetching workflows:", error)
        toast({
          title: "Error",
          description: "Failed to load workflows. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchWorkflows()
  }, [toast])

  const handleDeleteWorkflow = async (id: number) => {
    try {
      // In a real implementation, this would be an API call
      // await fetch(`/api/crew/workflows/${id}`, { method: 'DELETE' })

      // Update local state
      setWorkflows(workflows.filter((workflow) => workflow.id !== id))

      toast({
        title: "Workflow deleted",
        description: "The workflow has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting workflow:", error)
      toast({
        title: "Error",
        description: "Failed to delete workflow. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
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

  if (workflows.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>No Workflows Found</CardTitle>
          <CardDescription>
            You haven't created any CrewAI workflows yet. Get started by creating your first workflow.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/crew/workflows/new">
              <Play className="mr-2 h-4 w-4" />
              Create Workflow
            </Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {workflows.map((workflow) => (
        <Card key={workflow.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{workflow.name}</CardTitle>
                <CardDescription>{workflow.description}</CardDescription>
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
                    <Link href={`/crew/workflows/${workflow.id}/run`}>
                      <Play className="mr-2 h-4 w-4" />
                      Run
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/crew/workflows/${workflow.id}/visualize`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Visualize
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/crew/workflows/${workflow.id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDeleteWorkflow(workflow.id)}>
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
                <p className="text-sm font-medium text-muted-foreground">Process Type</p>
                <Badge variant="outline" className="capitalize">
                  {workflow.process}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Agents</p>
                <p className="text-sm">{workflow.agents.length} agents</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tasks</p>
                <p className="text-sm">{workflow.tasks.length} tasks</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/crew/workflows/${workflow.id}/run`}>
                <Play className="mr-2 h-3 w-3" />
                Run
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/crew/workflows/${workflow.id}/visualize`}>
                <Eye className="mr-2 h-3 w-3" />
                Visualize
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
