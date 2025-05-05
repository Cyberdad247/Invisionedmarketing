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
import { Slider } from "@/components/ui/slider"
import { PlusCircle, Trash2 } from "lucide-react"

interface Tool {
  name: string
  description: string
  function?: string
}

interface CrewAgentFormProps {
  onSubmit: (agentData: any) => void
  initialData?: any
}

export function CrewAgentForm({ onSubmit, initialData }: CrewAgentFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    role: initialData?.role || "",
    goal: initialData?.goal || "",
    backstory: initialData?.backstory || "",
    model: initialData?.model || "gpt-4o",
    verbose: initialData?.verbose !== undefined ? initialData.verbose : true,
    allow_delegation: initialData?.allow_delegation !== undefined ? initialData.allow_delegation : false,
    tools: initialData?.tools || [],
    temperature: initialData?.temperature || 0.7,
    max_tokens: initialData?.max_tokens || 1500,
  })

  const [newTool, setNewTool] = useState<Tool>({
    name: "",
    description: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSliderChange = (name: string, value: number[]) => {
    setFormData((prev) => ({ ...prev, [name]: value[0] }))
  }

  const handleToolInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewTool((prev) => ({ ...prev, [name]: value }))
  }

  const addTool = () => {
    if (newTool.name && newTool.description) {
      setFormData((prev) => ({
        ...prev,
        tools: [...prev.tools, { ...newTool }],
      }))
      setNewTool({ name: "", description: "" })
    }
  }

  const removeTool = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tools: prev.tools.filter((_: any, i: number) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Configure CrewAI Agent</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Agent Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Research Assistant"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  placeholder="e.g., Researcher"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal">Goal</Label>
              <Textarea
                id="goal"
                name="goal"
                value={formData.goal}
                onChange={handleInputChange}
                placeholder="What is the agent's primary goal?"
                rows={2}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="backstory">Backstory</Label>
              <Textarea
                id="backstory"
                name="backstory"
                value={formData.backstory}
                onChange={handleInputChange}
                placeholder="Provide context and background for the agent"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Select value={formData.model} onValueChange={(value) => handleSelectChange("model", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                    <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                    <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_tokens">Max Tokens</Label>
                <Input
                  id="max_tokens"
                  name="max_tokens"
                  type="number"
                  min="100"
                  max="4000"
                  value={formData.max_tokens}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature: {formData.temperature}</Label>
              <Slider
                id="temperature"
                min={0}
                max={1}
                step={0.1}
                value={[formData.temperature]}
                onValueChange={(value) => handleSliderChange("temperature", value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="verbose"
                checked={formData.verbose}
                onCheckedChange={(checked) => handleSwitchChange("verbose", checked)}
              />
              <Label htmlFor="verbose">Verbose Mode</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="allow_delegation"
                checked={formData.allow_delegation}
                onCheckedChange={(checked) => handleSwitchChange("allow_delegation", checked)}
              />
              <Label htmlFor="allow_delegation">Allow Delegation</Label>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Tools</Label>
              </div>

              <div className="space-y-4">
                {formData.tools.map((tool: Tool, index: number) => (
                  <div key={index} className="flex items-start space-x-2 p-3 border rounded-md">
                    <div className="flex-1 space-y-1">
                      <div className="font-medium">{tool.name}</div>
                      <div className="text-sm text-gray-500">{tool.description}</div>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeTool(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border rounded-md p-4">
                <div className="space-y-2">
                  <Label htmlFor="tool-name">Tool Name</Label>
                  <Input
                    id="tool-name"
                    name="name"
                    value={newTool.name}
                    onChange={handleToolInputChange}
                    placeholder="e.g., search_web"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tool-description">Tool Description</Label>
                  <Textarea
                    id="tool-description"
                    name="description"
                    value={newTool.description}
                    onChange={handleToolInputChange}
                    placeholder="Describe what the tool does"
                    rows={2}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={addTool}
                  disabled={!newTool.name || !newTool.description}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Tool
                </Button>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full">
            {initialData ? "Update Agent" : "Create Agent"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
