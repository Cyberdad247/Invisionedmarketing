"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, ArrowRight, MessageSquare } from "lucide-react"

interface Agent {
  name: string
  role: string
  goal: string
  tools: any[]
}

interface Task {
  description: string
  agent_index: number
  expected_output?: string
}

interface CrewAgentVisualizerProps {
  agents: Agent[]
  tasks: Task[]
  process: string
  executionLog?: string[]
}

export function CrewAgentVisualizer({ agents, tasks, process, executionLog = [] }: CrewAgentVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

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
    const agentPositions = agents.map((_, index) => {
      const x = padding + index * ((canvas.width - padding * 2) / (agents.length - 1 || 1))
      return { x, y: centerY }
    })

    // Draw connections between agents based on tasks
    ctx.strokeStyle = "#888"
    ctx.lineWidth = 2

    if (process === "sequential") {
      // Draw sequential connections
      for (let i = 0; i < agents.length - 1; i++) {
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
    } else if (process === "hierarchical") {
      // Draw hierarchical connections (first agent connects to all others)
      for (let i = 1; i < agents.length; i++) {
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
    agents.forEach((agent, index) => {
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
  }, [agents, tasks, process])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Agent Collaboration Visualization</span>
          <Badge variant="outline">{process === "sequential" ? "Sequential" : "Hierarchical"}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative w-full h-[300px]">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Task Flow</h3>
          <div className="space-y-2">
            {tasks.map((task, index) => (
              <div key={index} className="flex items-start p-3 border rounded-md">
                <div className="flex-shrink-0 mr-3">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-medium">{agents[task.agent_index]?.name}</span>
                    <ArrowRight className="h-4 w-4 mx-2 text-gray-400" />
                    <span className="text-sm">Task {index + 1}</span>
                  </div>
                  <p className="text-sm mt-1">{task.description}</p>
                  {task.expected_output && (
                    <p className="text-xs text-gray-500 mt-1">Expected: {task.expected_output}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {executionLog.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Execution Log</h3>
            <div className="max-h-[300px] overflow-y-auto border rounded-md p-3 bg-gray-50">
              {executionLog.map((log, index) => (
                <div key={index} className="flex items-start mb-2">
                  <MessageSquare className="h-4 w-4 mr-2 mt-1 text-gray-500" />
                  <p className="text-sm">{log}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
