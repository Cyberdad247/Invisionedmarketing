"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Trash2, Save } from "lucide-react"

// This would be imported from your API client
interface Agent {
  id: string
  name: string
}

interface WorkflowStep {
  id: string
  name: string
  agentId: string
  inputs: Record<string, string>
  outputs: string[]
}

interface Workflow {
  id?: string
  name: string
  description: string
  steps: WorkflowStep[]
}

export default function WorkflowEditor({
  initialWorkflow,
  onSave,
}: {
  initialWorkflow?: Workflow
  onSave: (workflow: Workflow) => void
}) {
  const [workflow, setWorkflow] = useState<Workflow>(
    initialWorkflow || {
      name: "",
      description: "",
      steps: [],
    },
  )

  const [agents, setAgents] = useState<Agent[]>([])

  // Fetch agents from API
  useEffect(() => {
    // This would be replaced with your actual API call
    const fetchAgents = async () => {
      try {
        // const response = await fetch('/api/agents')
        // const data = await response.json()
        // setAgents(data)

        // Mock data for now
        setAgents([
          { id: "1", name: "Customer Support Agent" },
          { id: "2", name: "Marketing Content Creator" },
          { id: "3", name: "Data Analyst" },
        ])
      } catch (error) {
        console.error("Error fetching agents:", error)
      }
    }

    fetchAgents()
  }, [])

  const handleAddStep = () => {
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      name: `Step ${workflow.steps.length + 1}`,
      agentId: agents.length > 0 ? agents[0].id : "",
      inputs: {},
      outputs: ["output"],
    }

    setWorkflow({
      ...workflow,
      steps: [...workflow.steps, newStep],
    })
  }

  const handleRemoveStep = (stepId: string) => {
    setWorkflow({
      ...workflow,
      steps: workflow.steps.filter((step) => step.id !== stepId),
    })
  }

  const handleStepChange = (stepId: string, field: string, value: any) => {
    setWorkflow({
      ...workflow,
      steps: workflow.steps.map((step) => {
        if (step.id === stepId) {
          return { ...step, [field]: value }
        }
        return step
      }),
    })
  }

  const handleAddOutput = (stepId: string) => {
    setWorkflow({
      ...workflow,
      steps: workflow.steps.map((step) => {
        if (step.id === stepId) {
          return {
            ...step,
            outputs: [...step.outputs, `output-${step.outputs.length + 1}`],
          }
        }
        return step
      }),
    })
  }

  const handleRemoveOutput = (stepId: string, outputIndex: number) => {
    setWorkflow({
      ...workflow,
      steps: workflow.steps.map((step) => {
        if (step.id === stepId) {
          const newOutputs = [...step.outputs]
          newOutputs.splice(outputIndex, 1)
          return { ...step, outputs: newOutputs }
        }
        return step
      }),
    })
  }

  const handleSave = () => {
    onSave(workflow)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Workflow Details</CardTitle>
          <CardDescription>Define the basic information for your workflow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Workflow Name</Label>
              <Input
                id="name"
                value={workflow.name}
                onChange={(e) => setWorkflow({ ...workflow, name: e.target.value })}
                placeholder="Enter workflow name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={workflow.description}
                onChange={(e) => setWorkflow({ ...workflow, description: e.target.value })}
                placeholder="Describe what this workflow does"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Workflow Steps</CardTitle>
            <CardDescription>Define the steps in your workflow</CardDescription>
          </div>
          <Button onClick={handleAddStep} variant="outline" size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Step
          </Button>
        </CardHeader>
        <CardContent>
          {workflow.steps.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No steps added yet. Click "Add Step" to create your first workflow step.
            </div>
          ) : (
            <div className="space-y-6">
              {workflow.steps.map((step, index) => (
                <Card key={step.id} className="border border-muted">
                  <CardHeader className="flex flex-row items-center justify-between p-4">
                    <CardTitle className="text-base">Step {index + 1}</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveStep(step.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`step-${step.id}-name`}>Step Name</Label>
                      <Input
                        id={`step-${step.id}-name`}
                        value={step.name}
                        onChange={(e) => handleStepChange(step.id, "name", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`step-${step.id}-agent`}>Agent</Label>
                      <Select
                        value={step.agentId}
                        onValueChange={(value) => handleStepChange(step.id, "agentId", value)}
                      >
                        <SelectTrigger id={`step-${step.id}-agent`}>
                          <SelectValue placeholder="Select an agent" />
                        </SelectTrigger>
                        <SelectContent>
                          {agents.map((agent) => (
                            <SelectItem key={agent.id} value={agent.id}>
                              {agent.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Outputs</Label>
                      <div className="space-y-2">
                        {step.outputs.map((output, outputIndex) => (
                          <div key={outputIndex} className="flex items-center space-x-2">
                            <Input
                              value={output}
                              onChange={(e) => {
                                const newOutputs = [...step.outputs]
                                newOutputs[outputIndex] = e.target.value
                                handleStepChange(step.id, "outputs", newOutputs)
                              }}
                            />
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveOutput(step.id, outputIndex)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                        <Button variant="outline" size="sm" onClick={() => handleAddOutput(step.id)}>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add Output
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={!workflow.name}>
          <Save className="mr-2 h-4 w-4" />
          Save Workflow
        </Button>
      </div>
    </div>
  )
}
