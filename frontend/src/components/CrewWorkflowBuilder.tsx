"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Trash2, MoveVertical } from "lucide-react"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

interface Agent {
  name: string
  role: string
  goal: string
  backstory: string
  model: string
  verbose: boolean
  allow_delegation: boolean
  tools: any[]
  temperature: number
  max_tokens: number
}

interface Task {
  description: string
  agent_index: number
  expected_output?: string
}

interface CrewWorkflowBuilderProps {
  onSubmit: (workflowData: any) => void
  agents: Agent[]
  initialData?: any
}

const TaskItem = ({
  task,
  index,
  agents,
  moveTask,
  updateTask,
  removeTask,
}: {
  task: Task
  index: number
  agents: Agent[]
  moveTask: (dragIndex: number, hoverIndex: number) => void
  updateTask: (index: number, task: Task) => void
  removeTask: (index: number) => void
}) => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    updateTask(index, { ...task, [name]: name === "agent_index" ? Number.parseInt(value) : value })
  }

  return (
    <div ref={(node) => drag(drop(node))} className={`p-4 border rounded-md mb-4 ${isDragging ? "opacity-50" : ""}`}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <MoveVertical className="h-4 w-4 mr-2 cursor-move" />
          <h4 className="font-medium">Task {index + 1}</h4>
        </div>
        <Button type="button" variant="ghost" size="icon" onClick={() => removeTask(index)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`task-${index}-description`}>Description</Label>
          <Textarea
            id={`task-${index}-description`}
            name="description"
            value={task.description}
            onChange={handleChange}
            placeholder="What should the agent do?"
            rows={2}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`task-${index}-agent`}>Assigned Agent</Label>
          <Select
            value={task.agent_index.toString()}
            onValueChange={(value) => updateTask(index, { ...task, agent_index: Number.parseInt(value) })}
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
          <Label htmlFor={`task-${index}-output`}>Expected Output</Label>
          <Textarea
            id={`task-${index}-output`}
            name="expected_output"
            value={task.expected_output || ""}
            onChange={handleChange}
            placeholder="What should the output of this task look like?"
            rows={2}
          />
        </div>
      </div>
    </div>
  )
}

export function CrewWorkflowBuilder({ onSubmit, agents, initialData }: CrewWorkflowBuilderProps) {
  const [workflowData, setWorkflowData] = useState({
    name: initialData?.name || "New Workflow",
    description: initialData?.description || "",
    process: initialData?.process || "sequential",
    verbose: initialData?.verbose !== undefined ? initialData.verbose : true,
    agents: initialData?.agents || agents,
    tasks: initialData?.tasks || [],
  })

  const [activeTab, setActiveTab] = useState("workflow")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setWorkflowData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setWorkflowData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setWorkflowData((prev) => ({ ...prev, [name]: checked }))
  }

  const addTask = () => {
    if (workflowData.agents.length === 0) {
      alert("Please add at least one agent before creating tasks.")
      return
    }

    setWorkflowData((prev) => ({
      ...prev,
      tasks: [
        ...prev.tasks,
        {
          description: "",
          agent_index: 0,
          expected_output: "",
        },
      ],
    }))
  }

  const updateTask = (index: number, updatedTask: Task) => {
    setWorkflowData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task, i) => (i === index ? updatedTask : task)),
    }))
  }

  const removeTask = (index: number) => {
    setWorkflowData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index),
    }))
  }

  const moveTask = (dragIndex: number, hoverIndex: number) => {
    const dragTask = workflowData.tasks[dragIndex]
    setWorkflowData((prev) => {
      const newTasks = [...prev.tasks]
      newTasks.splice(dragIndex, 1)
      newTasks.splice(hoverIndex, 0, dragTask)
      return { ...prev, tasks: newTasks }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(workflowData)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Workflow Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="workflow">Workflow Settings</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
              </TabsList>

              <TabsContent value="workflow" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Workflow Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={workflowData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Content Creation Pipeline"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={workflowData.description}
                    onChange={handleInputChange}
                    placeholder="What does this workflow do?"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="process">Process Type</Label>
                  <Select value={workflowData.process} onValueChange={(value) => handleSelectChange("process", value)}>
                    <SelectTrigger id="process">
                      <SelectValue placeholder="Select a process type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sequential">Sequential</SelectItem>
                      <SelectItem value="hierarchical">Hierarchical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="verbose"
                    checked={workflowData.verbose}
                    onCheckedChange={(checked) => handleSwitchChange("verbose", checked)}
                  />
                  <Label htmlFor="verbose">Verbose Mode</Label>
                </div>

                <div className="space-y-2">
                  <Label>Selected Agents</Label>
                  <div className="space-y-2">
                    {workflowData.agents.map((agent, index) => (
                      <div key={index} className="p-3 border rounded-md">
                        <div className="font-medium">{agent.name}</div>
                        <div className="text-sm text-gray-500">Role: {agent.role}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tasks" className="space-y-4 pt-4">
                {workflowData.tasks.map((task, index) => (
                  <TaskItem
                    key={index}
                    task={task}
                    index={index}
                    agents={workflowData.agents}
                    moveTask={moveTask}
                    updateTask={updateTask}
                    removeTask={removeTask}
                  />
                ))}

                <Button type="button" variant="outline" className="w-full" onClick={addTask}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </TabsContent>
            </Tabs>

            <Button type="submit" className="w-full">
              {initialData ? "Update Workflow" : "Create Workflow"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </DndProvider>
  )
}
