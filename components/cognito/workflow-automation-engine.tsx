"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Share2, Play, Pause, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

export default function WorkflowAutomationEngine() {
  // Sample workflows
  const [workflows, setWorkflows] = useState([
    {
      id: 1,
      name: "Content Creation Pipeline",
      description: "Automated workflow for creating and publishing blog content",
      status: "active",
      lastRun: "2023-10-15T14:30:00Z",
      agents: ["Strategos", "Lexica", "Visio", "Connecta"],
    },
    {
      id: 2,
      name: "Ad Campaign Optimization",
      description: "Continuous optimization of ad campaigns across platforms",
      status: "active",
      lastRun: "2023-10-16T09:15:00Z",
      agents: ["Optimus", "Insight", "NexusLink"],
    },
    {
      id: 3,
      name: "SEO Improvement Workflow",
      description: "Regular SEO audits and improvements",
      status: "inactive",
      lastRun: "2023-10-10T11:45:00Z",
      agents: ["Crawler", "Fixer", "Insight"],
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Workflow Automation Engine (Synapse)</h2>
          <p className="text-muted-foreground">Create and manage marketing workflows</p>
        </div>
        <Link href="/cognito/workflows/create">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Create Workflow
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workflows.map((workflow) => (
          <Card key={workflow.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{workflow.name}</CardTitle>
                <div
                  className={`px-2 py-1 rounded-full text-xs ${
                    workflow.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {workflow.status === "active" ? "Active" : "Inactive"}
                </div>
              </div>
              <CardDescription>{workflow.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium">Agents Involved</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {workflow.agents.map((agent, index) => (
                      <div key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {agent}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Last Run</h4>
                  <p className="text-sm text-muted-foreground">{new Date(workflow.lastRun).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/cognito/workflows/${workflow.id}`}>
                  <Share2 className="h-4 w-4 mr-1" />
                  View
                </Link>
              </Button>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
                {workflow.status === "active" ? (
                  <Button size="sm" variant="outline" className="text-amber-600">
                    <Pause className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" className="text-green-600">
                    <Play className="h-4 w-4" />
                  </Button>
                )}
                <Button size="sm" variant="outline" className="text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Symbolect Visual Language</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4 flex flex-col items-center">
              <div className="text-3xl mb-2">👤</div>
              <h4 className="text-sm font-medium">Human Review</h4>
              <p className="text-xs text-center text-muted-foreground">Human review required</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center">
              <div className="text-3xl mb-2">✅</div>
              <h4 className="text-sm font-medium">Approval Point</h4>
              <p className="text-xs text-center text-muted-foreground">Requires approval to proceed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center">
              <div className="text-3xl mb-2">❌</div>
              <h4 className="text-sm font-medium">Rejection Point</h4>
              <p className="text-xs text-center text-muted-foreground">Stop point if rejected</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center">
              <div className="text-3xl mb-2">✏️</div>
              <h4 className="text-sm font-medium">Edit Task</h4>
              <p className="text-xs text-center text-muted-foreground">Modify the current task</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center">
              <div className="text-3xl mb-2">📈</div>
              <h4 className="text-sm font-medium">Performance Check</h4>
              <p className="text-xs text-center text-muted-foreground">Evaluate performance metrics</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
