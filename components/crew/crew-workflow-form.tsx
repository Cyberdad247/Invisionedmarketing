"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Trash2, MoveVertical } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

interface Agent {
  id: number
  name: string
  role: string
}

const workflowFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  process: z.enum(["sequential", "hierarchical"]),
  verbose: z.boolean().default(true),
  agents: z.array(z.number()).min(1, {
    message: "At least one agent must be selected.",
  }),
  tasks: z
    .array(
      z.object({
        description: z.string().min(5, {
          message: "Description must be at least 5 characters.",
        }),
        agent_index: z.number(),
        expected_output: z.string().optional(),
      }),
    )
    .min(1, {
      message: "At least one task must be defined.",
    }),
})

type WorkflowFormValues = z.infer<typeof workflowFormSchema>

interface TaskItemProps {
  index: number
  task: any
  agents: Agent[]
  moveTask: (dragIndex: number, hoverIndex: number) => void
  updateTask: (index: number, task: any) => void
  removeTask: (index: number) => void
}

const TaskItem = ({ index, task, agents, moveTask, updateTask, removeTask }: TaskItemProps) => {
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: "TASK",
    hover: (item: { index: number }, monitor) => {
      if (item.index !== index) {
        moveTask(item.index, index)
        item.index = index
      }
    },
  })

  return (
    <div ref={(node) => drag(drop(node))} className={`p-4 border rounded-md mb-4 ${isDragging ? "opacity-50" : ""}`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <MoveVertical className="h-4 w-4 mr-2 cursor-move text-muted-foreground" />
          <h4 className="font-medium">Task {index + 1}</h4>
        </div>
        <Button type="button" variant="ghost" size="icon" onClick={() => removeTask(index)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <FormLabel htmlFor={`task-${index}-description`}>Description</FormLabel>
          <Textarea
            id={`task-${index}-description`}
            value={task.description}
            onChange={(e) => updateTask(index, { ...task, description: e.target.value })}
            placeholder="What should the agent do?"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <FormLabel htmlFor={`task-${index}-agent`}>Assigned Agent</FormLabel>
          <Select
            value={task.agent_index.toString()}
            onValueChange={(value) => updateTask(index, { ...task, agent_index: Number(value) })}
          >
            <SelectTrigger id={`task-${index}-agent`}>
              <SelectValue placeholder="Select an agent" />
            </SelectTrigger>
            <SelectContent>
              {agents.map((agent, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {agent.name} ({agent.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <FormLabel htmlFor={`task-${index}-output`}>Expected Output (Optional)</FormLabel>
          <Textarea
            id={`task-${index}-output`}
            value={task.expected_output || ""}
            onChange={(e) => updateTask(index, { ...task, expected_output: e.target.value })}
            placeholder="What should the output of this task look like?"
            rows={2}
          />
        </div>
      </div>
    </div>
  )
}

interface CrewWorkflowFormProps {
  initialData?: Partial<WorkflowFormValues>
  workflowId?: number
}

export function CrewWorkflowForm({ initialData, workflowId }: CrewWorkflowFormProps = {}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("basic")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availableAgents, setAvailableAgents] = useState<Agent[]>([])
  const [selectedAgents, setSelectedAgents] = useState<Agent[]>([])

  // Get agent ID from query params if available
  const agentIdFromQuery = searchParams.get("agent")

  const defaultValues: Partial<WorkflowFormValues> = {
    name: "",
    description: "",
    process: "sequential",
    verbose: true,
    agents: agentIdFromQuery ? [Number(agentIdFromQuery)] : [],
    tasks: [],
    ...initialData,
  }

  const form = useForm<WorkflowFormValues>({
    resolver: zodResolver(workflowFormSchema),
    defaultValues,
  })

  useEffect(() => {
    // Fetch available agents
    const fetchAgents = async () => {
      try {
        // In a real implementation, this would be an API call
        // const response = await fetch('/api/crew/agents')
        // const data = await response.json()

        // Simulated data for demonstration
        const data = [
          {
            id: 1,
            name: "Research Assistant",
            role: "Researcher",
          },
          {
            id: 2,
            name: "Content Writer",
            role: "Writer",
          },
          {
            id: 3,
            name: "Data Analyst",
            role: "Analyst",
          },
          {
            id: 4,
            name: "Editor",
            role: "Editor",
          },
        ]

        setAvailableAgents(data)

        // If agent ID from query, pre-select that agent
        if (agentIdFromQuery) {
          const agent = data.find((a) => a.id === Number(agentIdFromQuery))
          if (agent) {
            setSelectedAgents([agent])
          }
        } else if (initialData?.agents) {
          // For editing existing workflow
          const selected = initialData.agents.map((id) => data.find((a) => a.id === id)).filter(Boolean) as Agent[]
          setSelectedAgents(selected)
        }
      } catch (error) {
        console.error("Error fetching agents:", error)
        toast({
          title: "Error",
          description: "Failed to load available agents. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchAgents()
  }, [agentIdFromQuery, initialData, toast])

  const onSubmit = async (data: WorkflowFormValues) => {
    try {
      setIsSubmitting(true)

      // In a real implementation, this would be an API call
      // const response = await fetch(workflowId ? `/api/crew/workflows/${workflowId}` : '/api/crew/workflows', {
      //   method: workflowId ? 'PUT' : 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // })

      // if (!response.ok) throw new Error('Failed to save workflow')

      console.log("Workflow data:", data)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: workflowId ? "Workflow updated" : "Workflow created",
        description: workflowId
          ? "Your workflow has been updated successfully."
          : "Your new workflow has been created successfully.",
      })

      router.push("/crew")
    } catch (error) {
      console.error("Error saving workflow:", error)
      toast({
        title: "Error",
        description: "Failed to save workflow. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAgentSelection = (agentId: number) => {
    const currentAgents = form.getValues("agents") || []

    if (currentAgents.includes(agentId)) {
      // Remove agent
      const updatedAgents = currentAgents.filter((id) => id !== agentId)
      form.setValue("agents", updatedAgents)
      setSelectedAgents(selectedAgents.filter((agent) => agent.id !== agentId))
    } else {
      // Add agent
      const updatedAgents = [...currentAgents, agentId]
      form.setValue("agents", updatedAgents)
      const agent = availableAgents.find((a) => a.id === agentId)
      if (agent) {
        setSelectedAgents([...selectedAgents, agent])
      }
    }
  }

  const addTask = () => {
    const currentTasks = form.getValues("tasks") || []
    const selectedAgentIds = form.getValues("agents") || []

    if (selectedAgentIds.length === 0) {
      toast({
        title: "No agents selected",
        description: "Please select at least one agent before adding tasks.",
        variant: "destructive",
      })
      return
    }

    form.setValue("tasks", [
      ...currentTasks,
      {
        description: "",
        agent_index: 0, // Default to first agent
        expected_output: "",
      },
    ])
  }

  const updateTask = (index: number, updatedTask: any) => {
    const currentTasks = form.getValues("tasks") || []
    const updatedTasks = [...currentTasks]
    updatedTasks[index] = updatedTask
    form.setValue("tasks", updatedTasks)
  }

  const removeTask = (index: number) => {
    const currentTasks = form.getValues("tasks") || []
    form.setValue(
      "tasks",
      currentTasks.filter((_, i) => i !== index),
    )
  }

  const moveTask = (dragIndex: number, hoverIndex: number) => {
    const currentTasks = form.getValues("tasks") || []
    const dragTask = currentTasks[dragIndex]

    const updatedTasks = [...currentTasks]
    updatedTasks.splice(dragIndex, 1)
    updatedTasks.splice(hoverIndex, 0, dragTask)

    form.setValue("tasks", updatedTasks)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="agents">Agents</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6 pt-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workflow Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Content Creation Pipeline" {...field} />
                    </FormControl>
                    <FormDescription>A descriptive name for your workflow.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="What does this workflow do?" className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormDescription>A brief description of the workflow's purpose.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="process"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Process Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a process type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sequential">Sequential</SelectItem>
                          <SelectItem value="hierarchical">Hierarchical</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>How agents will collaborate in this workflow.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="verbose"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Verbose Mode</FormLabel>
                        <FormDescription>Enable detailed logging of workflow execution.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            <TabsContent value="agents" className="space-y-6 pt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Select Agents</h3>
                <p className="text-sm text-muted-foreground">
                  Choose the agents that will participate in this workflow.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableAgents.map((agent) => (
                    <Card
                      key={agent.id}
                      className={`cursor-pointer transition-colors ${
                        form.watch("agents").includes(agent.id) ? "border-primary" : "hover:border-primary/50"
                      }`}
                      onClick={() => handleAgentSelection(agent.id)}
                    >
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{agent.name}</h4>
                          <p className="text-sm text-muted-foreground">{agent.role}</p>
                        </div>
                        <Switch
                          checked={form.watch("agents").includes(agent.id)}
                          onCheckedChange={() => handleAgentSelection(agent.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {form.formState.errors.agents && (
                  <p className="text-sm font-medium text-destructive">{form.formState.errors.agents.message}</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="tasks" className="space-y-6 pt-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">Define Tasks</h3>
                    <p className="text-sm text-muted-foreground">Create tasks and assign them to specific agents.</p>
                  </div>
                  <Button type="button" onClick={addTask} disabled={form.watch("agents").length === 0}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Task
                  </Button>
                </div>

                {form.watch("tasks").length > 0 ? (
                  <div className="space-y-4">
                    {form.watch("tasks").map((task, index) => (
                      <TaskItem
                        key={index}
                        index={index}
                        task={task}
                        agents={selectedAgents}
                        moveTask={moveTask}
                        updateTask={updateTask}
                        removeTask={removeTask}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center rounded-lg border border-dashed p-8">
                    <div className="text-center">
                      <h4 className="text-sm font-semibold">No tasks defined</h4>
                      <p className="text-sm text-muted-foreground mt-1">Add tasks to define your workflow.</p>
                    </div>
                  </div>
                )}

                {form.formState.errors.tasks && (
                  <p className="text-sm font-medium text-destructive">{form.formState.errors.tasks.message}</p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.push("/crew")} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : workflowId ? "Update Workflow" : "Create Workflow"}
            </Button>
          </div>
        </form>
      </Form>
    </DndProvider>
  )
}
