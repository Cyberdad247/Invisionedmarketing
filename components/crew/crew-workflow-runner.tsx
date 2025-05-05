"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Play, RefreshCw, Download, Eye } from "lucide-react"
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

export function CrewWorkflowRunner({ workflowId }: { workflowId: string }) {
  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRunning, setIsRunning] = useState(false)
  const [executionLogs, setExecutionLogs] = useState<string[]>([])
  const [result, setResult] = useState("")
  const [input, setInput] = useState("")
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

  const runWorkflow = async () => {
    if (!workflow) return

    setIsRunning(true)
    setExecutionLogs([])
    setResult("")

    try {
      // In a real implementation, this would be an API call
      // const response = await fetch(`/api/crew/workflows/${workflowId}/run`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ input }),
      // })
      // const data = await response.json()

      // Simulate execution with logs
      addExecutionLog(`Starting workflow execution: ${workflow.name}`)
      if (input) {
        addExecutionLog(`Input: ${input}`)
      }
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

      // Generate a sample result based on the workflow and input
      const topic = input || "artificial intelligence"
      const sampleResult = `# Comprehensive Guide to ${topic.charAt(0).toUpperCase() + topic.slice(1)}

## Introduction
${topic.charAt(0).toUpperCase() + topic.slice(1)} is transforming industries and creating new opportunities for innovation. This guide explores the key aspects, trends, and applications of ${topic}.

## Key Concepts
1. Understanding the fundamentals of ${topic}
2. Historical development and evolution
3. Current state of technology
4. Future trends and predictions

## Applications
- Business applications
- Consumer use cases
- Research opportunities
- Ethical considerations

## Conclusion
As ${topic} continues to evolve, staying informed about the latest developments will be crucial for professionals and organizations looking to leverage its potential.

*This content was created by the CrewAI Content Creation Pipeline, utilizing research, writing, and editing agents working collaboratively.*`

      setResult(sampleResult)

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

  const downloadResult = () => {
    if (!result) return

    const blob = new Blob([result], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.download = `workflow-result-${workflowId}.txt`
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
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
            <Skeleton className="h-[200px] w-full" />
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
          <Button variant="outline" asChild>
            <Link href={`/crew/workflows/${workflowId}/visualize`}>
              <Eye className="mr-2 h-4 w-4" />
              Visualize
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Run Workflow</CardTitle>
          <CardDescription>Execute this workflow with optional input</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="input" className="text-sm font-medium">
              Input (Optional)
            </label>
            <Textarea
              id="input"
              placeholder="Enter any input for the workflow..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Provide any context or instructions for the workflow to process.
            </p>
          </div>

          <div className="flex justify-end">
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
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="md:col-span-1">
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

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Result</CardTitle>
            <CardDescription>Final output from the workflow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-md p-4 h-[400px] overflow-y-auto">
              {result ? (
                <pre className="whitespace-pre-wrap text-sm">{result}</pre>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>No result yet. Run the workflow to see the output.</p>
                </div>
              )}
            </div>
          </CardContent>
          {result && (
            <CardFooter className="flex justify-end">
              <Button variant="outline" size="sm" onClick={downloadResult}>
                <Download className="mr-2 h-4 w-4" />
                Download Result
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}
