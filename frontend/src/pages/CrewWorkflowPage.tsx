"use client"

import { useState } from "react"
import { CrewWorkflowBuilder } from "../components/CrewWorkflowBuilder"
import { CrewAgentVisualizer } from "../components/CrewAgentVisualizer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, RefreshCw } from "lucide-react"

// Sample agents for demonstration
const sampleAgents = [
  {
    name: "Researcher",
    role: "Research Specialist",
    goal: "Find accurate information",
    backstory: "You are an expert researcher with access to vast knowledge.",
    model: "gpt-4o",
    verbose: true,
    allow_delegation: false,
    tools: [
      {
        name: "search",
        description: "Search for information on the web.",
      },
    ],
    temperature: 0.7,
    max_tokens: 1500,
  },
  {
    name: "Writer",
    role: "Content Creator",
    goal: "Create engaging content",
    backstory: "You are a skilled writer who can create compelling content.",
    model: "gpt-4o",
    verbose: true,
    allow_delegation: false,
    tools: [],
    temperature: 0.8,
    max_tokens: 2000,
  },
  {
    name: "Editor",
    role: "Content Editor",
    goal: "Improve and refine content",
    backstory: "You are a meticulous editor who ensures content quality.",
    model: "gpt-4o",
    verbose: true,
    allow_delegation: false,
    tools: [],
    temperature: 0.4,
    max_tokens: 1500,
  },
]

export function CrewWorkflowPage() {
  const [workflow, setWorkflow] = useState(null)
  const [activeTab, setActiveTab] = useState("configure")
  const [isRunning, setIsRunning] = useState(false)
  const [executionLog, setExecutionLog] = useState<string[]>([])
  const [executionResult, setExecutionResult] = useState("")

  const handleWorkflowSubmit = async (workflowData: any) => {
    try {
      // In a real implementation, this would send the data to the backend
      console.log("Creating workflow:", workflowData)

      // Simulate API call
      setIsRunning(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setWorkflow(workflowData)
      setActiveTab("visualize")
      setIsRunning(false)
    } catch (error) {
      console.error("Error creating workflow:", error)
      setIsRunning(false)
    }
  }

  const runWorkflow = async () => {
    if (!workflow) return

    setIsRunning(true)
    setExecutionLog([])
    setExecutionResult("")

    try {
      // In a real implementation, this would send the request to the backend
      console.log("Running workflow:", workflow)

      // Simulate execution with logs
      setExecutionLog((prev) => [...prev, `Starting workflow execution: ${workflow.name}`])
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate agent execution
      for (let i = 0; i < workflow.tasks.length; i++) {
        const task = workflow.tasks[i]
        const agent = workflow.agents[task.agent_index]

        setExecutionLog((prev) => [...prev, `Task ${i + 1}: ${task.description}`])
        setExecutionLog((prev) => [...prev, `Agent ${agent.name} (${agent.role}) is working on the task...`])

        // Simulate thinking time
        await new Promise((resolve) => setTimeout(resolve, 2000))

        setExecutionLog((prev) => [...prev, `Agent ${agent.name} completed the task.`])

        if (i < workflow.tasks.length - 1) {
          setExecutionLog((prev) => [...prev, `Passing results to next task...`])
          await new Promise((resolve) => setTimeout(resolve, 500))
        }
      }

      // Simulate final result
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setExecutionLog((prev) => [...prev, `Workflow execution completed successfully.`])

      const result = `This is the final result of the workflow execution. In a real implementation, this would be the actual output from running the CrewAI workflow with the specified agents and tasks.

The workflow "${workflow.name}" has been executed using the ${workflow.process} process.

${workflow.tasks
  .map((task, i) => {
    const agent = workflow.agents[task.agent_index]
    return `Task ${i + 1}: ${task.description} (Completed by ${agent.name})`
  })
  .join("\n")}

Final output: The requested tasks have been completed successfully.`

      setExecutionResult(result)
    } catch (error) {
      console.error("Error running workflow:", error)
      setExecutionLog((prev) => [...prev, `Error: Workflow execution failed.`])
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">CrewAI Workflow</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="configure">Configure</TabsTrigger>
          <TabsTrigger value="visualize" disabled={!workflow}>
            Visualize
          </TabsTrigger>
          <TabsTrigger value="execute" disabled={!workflow}>
            Execute
          </TabsTrigger>
        </TabsList>

        <TabsContent value="configure" className="pt-4">
          <CrewWorkflowBuilder onSubmit={handleWorkflowSubmit} agents={sampleAgents} initialData={workflow} />
        </TabsContent>

        <TabsContent value="visualize" className="pt-4">
          {workflow && (
            <CrewAgentVisualizer agents={workflow.agents} tasks={workflow.tasks} process={workflow.process} />
          )}
        </TabsContent>

        <TabsContent value="execute" className="pt-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Workflow Execution</span>
                <Button onClick={runWorkflow} disabled={isRunning} className="flex items-center">
                  {isRunning ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Run Workflow
                    </>
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-md p-4 max-h-[300px] overflow-y-auto bg-gray-50">
                {executionLog.length === 0 ? (
                  <div className="flex items-center justify-center h-[200px] text-gray-500">
                    <p>Click "Run Workflow" to start execution</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {executionLog.map((log, index) => (
                      <div key={index} className="text-sm">
                        <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span> {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {executionResult && (
                <Card>
                  <CardHeader>
                    <CardTitle>Result</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md text-sm">{executionResult}</pre>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
