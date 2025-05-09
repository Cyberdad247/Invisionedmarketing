"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Play, RefreshCw, Download } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Agent {
  id: number
  name: string
  role: string
}

interface Task {
  description: string
  agent_index: number
  expected_output?: string
}

interface Workflow {
  id: number
  name: string
  description: string
  process: string
  agents: Agent[]
  tasks: Task[]
}

export function CrewWorkflowVisualizer({ workflowId }: { workflowId: string }) {
  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("graph")
  const [isRunning, setIsRunning] = useState(false)
  const [executionLogs, setExecutionLogs] = useState<string[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Fetch workflow data
    const fetchWorkflow = async () => {
      try {
        setLoading(true)
        // In a real implementation, this would be an API call
        // const response = await fetch(`/api/crew/workflows/${workflowId}`)
        // const data = await response.json()

        // Simulated data for demonstration
        const data = {
          id: Number.parseInt(workflowId),
          name: "Content Creation Pipeline",
          description: "Research, write, and edit content automatically",
          process: "sequential",
          agents: [
            { id: 1, name: "Research Assistant", role: "Researcher" },
            { id: 2, name: "Content Writer", role: "Writer" },
            { id: 3, name: "Editor", role: "Editor" },
          ],
          tasks: [
            {
              description: "Research the topic thoroughly",
              agent_index: 0,
              expected_output: "Comprehensive research notes",
            },
            {
              description: "Write initial draft based on research",
              agent_index: 1,
              expected_output: "First draft of content",
            },
            { description: "Edit and improve the content", agent_index: 2, expected_output: "Polished final content" },
          ],
        }

        setWorkflow(data)
      } catch (error) {
        console.error("Error fetching workflow:", error)
        toast({
          title: "Error",
          description: "Failed to load workflow data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchWorkflow()
  }, [workflowId, toast])

  useEffect(() => {
    if (!canvasRef.current || !workflow) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw agents and connections
    const agentRadius = 50
    const padding = 100
    const centerY = canvas.height / 2

    // Calculate positions based on number of agents
    const agentPositions = workflow.agents.map((_, index) => {
      const x = padding + index * ((canvas.width - padding * 2) / (workflow.agents.length - 1 || 1))
      return { x, y: centerY }
    })

    // Draw connections between agents based on tasks
    ctx.strokeStyle = "#888"
    ctx.lineWidth = 2

    if (workflow.process === "sequential") {
      // Draw sequential connections
      for (let i = 0; i < workflow.agents.length - 1; i++) {
        const start = agentPositions[i]
        const end = agentPositions[i + 1]

        ctx.beginPath()
        ctx.moveTo(start.x + agentRadius, start.y)
        ctx.lineTo(end.x - agentRadius, end.y)
        ctx.stroke()

        // Draw arrow
        const arrowSize = 10
        const angle = Math.atan2(end.y - start.y, end.x - start.x)
        ctx.beginPath()
        ctx.moveTo(end.x - agentRadius, end.y)
        ctx.lineTo(
          end.x - agentRadius - arrowSize * Math.cos(angle - Math.PI / 6),
          end.y - arrowSize * Math.sin(angle - Math.PI / 6),
        )
        ctx.lineTo(
          end.x - agentRadius - arrowSize * Math.cos(angle + Math.PI / 6),
          end.y - arrowSize * Math.sin(angle + Math.PI / 6),
        )
        ctx.closePath()
        ctx.fillStyle = "#888"
        ctx.fill()
      }
    } else if (workflow.process === "hierarchical") {
      // Draw hierarchical connections (first agent connects to all others)
      for (let i = 1; i < workflow.agents.length; i++) {
        const start = agentPositions[0]
        const end = agentPositions[i]

        ctx.beginPath()
        ctx.moveTo(start.x + agentRadius, start.y)
        ctx.lineTo(end.x - agentRadius, end.y)
        ctx.stroke()

        // Draw arrow
        const arrowSize = 10
        const angle = Math.atan2(end.y - start.y, end.x - start.x)
        ctx.beginPath()
        ctx.moveTo(end.x - agentRadius, end.y)
        ctx.lineTo(
          end.x - agentRadius - arrowSize * Math.cos(angle - Math.PI / 6),
          end.y - arrowSize * Math.sin(angle - Math.PI / 6),
        )
        ctx.lineTo(
          end.x - agentRadius - arrowSize * Math.cos(angle + Math.PI / 6),
          end.y - arrowSize * Math.sin(angle + Math.PI / 6),
        )
        ctx.closePath()
        ctx.fillStyle = "#888"
        ctx.fill()
      }
    }

    // Draw agents
    workflow.agents.forEach((agent, index) => {
      const { x, y } = agentPositions[index]

      // Draw circle
      ctx.beginPath()
      ctx.arc(x, y, agentRadius, 0, Math.PI * 2)
      ctx.fillStyle = "#f3f4f6"
      ctx.fill()
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw agent icon
      ctx.fillStyle = "#6b7280"
      ctx.font = "24px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(agent.name.charAt(0).toUpperCase(), x, y)

      // Draw agent name below
      ctx.font = "14px sans-serif"
      ctx.fillText(agent.name, x, y + agentRadius + 20)

      // Draw role below name
      ctx.font = "12px sans-serif"
      ctx.fillStyle = "#9ca3af"
      ctx.fillText(agent.role, x, y + agentRadius + 40)
    })
  }, [workflow])

  const runWorkflow = async () => {
    if (!workflow) return

    setIsRunning(true)
    setExecutionLogs([])
    setActiveTab("execution")

    try {
      // In a real implementation, this would be an API call
      // const response = await fetch(`/api/crew/workflows/${workflowId}/run`, { method: 'POST' })
      // const data = await response.json()

      // Simulate execution with logs
      addExecutionLog(`Starting workflow execution: ${workflow.name}`)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate agent execution
      for (let i = 0; i < workflow.tasks.length; i++) {
        const task = workflow.tasks[i]
        const agent = workflow.agents[task.agent_index]

        addExecutionLog(`Task ${i + 1}: ${task.description}`)
        addExecutionLog(`Agent ${agent.name} (${agent.role}) is working on the task...`)

        // Simulate thinking time
        await new Promise((resolve) => setTimeout(resolve, 2000))

        addExecutionLog(`Agent ${agent.name} completed the task.`)
        if (task.expected_output) {
          addExecutionLog(`Output: ${task.expected_output}`)
        }

        if (i < workflow.tasks.length - 1) {
          addExecutionLog(`Passing results to next task...`)
          await new Promise((resolve) => setTimeout(resolve, 500))
        }
      }

      // Simulate final result
      await new Promise((resolve) => setTimeout(resolve, 1000))
      addExecutionLog(`Workflow execution completed successfully.`)

      toast({
        title: "Execution Complete",
        description: "The workflow has been executed successfully.",
      })
    } catch (error) {
      console.error("Error running workflow:", error)
      addExecutionLog(`Error: Workflow execution failed.`)

      toast({
        title: "Error",
        description: "Failed to execute workflow. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRunning(false)
    }
  }

  const addExecutionLog = (message: string) => {
    setExecutionLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
  }

  const downloadWorkflowDiagram = () => {
    if (!canvasRef.current) return

    const link = document.createElement("a")
    link.download = `workflow-${workflowId}.png`
    link.href = canvasRef.current.toDataURL("image/png")
    link.click()
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-24" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!workflow) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Workflow Not Found</CardTitle>
          <CardDescription>The requested workflow could not be found.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/crew">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{workflow.name}</h2>
          <p className="text-muted-foreground">{workflow.description}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/crew">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <Button onClick={runWorkflow} disabled={isRunning}>
            {isRunning ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Run Workflow
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="graph">Workflow Graph</TabsTrigger>
          <TabsTrigger value="execution">Execution Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="graph" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Workflow Visualization</CardTitle>
                <CardDescription>Visual representation of agent collaboration</CardDescription>
              </div>
              <Badge variant="outline" className="capitalize">
                {workflow.process}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-[400px]">
                <canvas ref={canvasRef} className="w-full h-full" />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={downloadWorkflowDiagram}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Task Flow</CardTitle>
              <CardDescription>Sequence of tasks in this workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflow.tasks.map((task, index) => (
                  <div key={index} className="flex items-start p-4 border rounded-md">
                    <div className="flex-shrink-0 mr-4 p-2 bg-primary/10 rounded-full">
                      <span className="font-bold text-primary">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <Badge variant="secondary" className="mr-2">
                          {workflow.agents[task.agent_index].name}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{workflow.agents[task.agent_index].role}</span>
                      </div>
                      <p className="font-medium">{task.description}</p>
                      {task.expected_output && (
                        <p className="text-sm text-muted-foreground mt-1">Expected output: {task.expected_output}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="execution" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Execution Logs</CardTitle>
              <CardDescription>Real-time logs of workflow execution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-md p-4 h-[400px] overflow-y-auto font-mono text-sm">
                {executionLogs.length > 0 ? (
                  executionLogs.map((log, index) => (
                    <div key={index} className="mb-1">
                      {log}
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <p>No execution logs yet. Run the workflow to see logs.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
