"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const agentFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  role: z.string().min(2, {
    message: "Role must be at least 2 characters.",
  }),
  goal: z.string().min(10, {
    message: "Goal must be at least 10 characters.",
  }),
  backstory: z.string().min(10, {
    message: "Backstory must be at least 10 characters.",
  }),
  model: z.string(),
  verbose: z.boolean().default(true),
  allow_delegation: z.boolean().default(false),
  temperature: z.number().min(0).max(1),
  max_tokens: z.number().min(100).max(4000),
  tools: z
    .array(
      z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        function: z.string().optional(),
        return_direct: z.boolean().default(false),
      }),
    )
    .default([]),
})

type AgentFormValues = z.infer<typeof agentFormSchema>

interface CrewAgentFormProps {
  initialData?: AgentFormValues
  agentId?: number
}

export function CrewAgentForm({ initialData, agentId }: CrewAgentFormProps = {}) {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("basic")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const defaultValues: Partial<AgentFormValues> = {
    name: "",
    role: "",
    goal: "",
    backstory: "",
    model: "gpt-4o",
    verbose: true,
    allow_delegation: false,
    temperature: 0.7,
    max_tokens: 1500,
    tools: [],
    ...initialData,
  }

  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    defaultValues,
  })

  const [newTool, setNewTool] = useState({
    name: "",
    description: "",
    function: "",
    return_direct: false,
  })

  const onSubmit = async (data: AgentFormValues) => {
    try {
      setIsSubmitting(true)

      // In a real implementation, this would be an API call
      // const response = await fetch(agentId ? `/api/crew/agents/${agentId}` : '/api/crew/agents', {
      //   method: agentId ? 'PUT' : 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // })

      // if (!response.ok) throw new Error('Failed to save agent')

      console.log("Agent data:", data)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: agentId ? "Agent updated" : "Agent created",
        description: agentId
          ? "Your agent has been updated successfully."
          : "Your new agent has been created successfully.",
      })

      router.push("/crew")
    } catch (error) {
      console.error("Error saving agent:", error)
      toast({
        title: "Error",
        description: "Failed to save agent. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const addTool = () => {
    if (newTool.name && newTool.description) {
      const currentTools = form.getValues("tools") || []
      form.setValue("tools", [...currentTools, { ...newTool }])
      setNewTool({
        name: "",
        description: "",
        function: "",
        return_direct: false,
      })
    }
  }

  const removeTool = (index: number) => {
    const currentTools = form.getValues("tools") || []
    form.setValue(
      "tools",
      currentTools.filter((_, i) => i !== index),
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Research Assistant" {...field} />
                    </FormControl>
                    <FormDescription>A unique name for your agent.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Researcher" {...field} />
                    </FormControl>
                    <FormDescription>The role this agent will perform.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What is the agent's primary goal?" className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormDescription>A clear description of what the agent aims to achieve.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="backstory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Backstory</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide context and background for the agent"
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Background information that helps define the agent's personality and expertise.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                        <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                        <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>The language model to use for this agent.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_tokens"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Tokens</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="100"
                        max="4000"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>Maximum number of tokens for model responses.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="temperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperature: {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={1}
                      step={0.1}
                      defaultValue={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                  <FormDescription>
                    Controls randomness: lower values are more deterministic, higher values more creative.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="verbose"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Verbose Mode</FormLabel>
                      <FormDescription>Enable detailed logging of agent actions.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="allow_delegation"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Allow Delegation</FormLabel>
                      <FormDescription>Allow this agent to delegate tasks to other agents.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6 pt-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Agent Tools</h3>
              <p className="text-sm text-muted-foreground">
                Tools provide your agent with capabilities to perform specific actions.
              </p>

              {form.watch("tools").length > 0 ? (
                <div className="space-y-4">
                  {form.watch("tools").map((tool, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-medium">{tool.name}</h4>
                            <p className="text-sm text-muted-foreground">{tool.description}</p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => removeTool(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        {tool.function && (
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground">Function:</p>
                            <pre className="text-xs bg-muted p-2 rounded-md overflow-x-auto">{tool.function}</pre>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center rounded-lg border border-dashed p-8">
                  <div className="text-center">
                    <h4 className="text-sm font-semibold">No tools added</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add tools to enhance your agent's capabilities.
                    </p>
                  </div>
                </div>
              )}

              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h4 className="font-medium">Add New Tool</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <FormLabel htmlFor="tool-name">Tool Name</FormLabel>
                      <Input
                        id="tool-name"
                        value={newTool.name}
                        onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
                        placeholder="e.g., search_web"
                      />
                    </div>

                    <div className="space-y-2">
                      <FormLabel htmlFor="tool-description">Description</FormLabel>
                      <Input
                        id="tool-description"
                        value={newTool.description}
                        onChange={(e) => setNewTool({ ...newTool, description: e.target.value })}
                        placeholder="What does this tool do?"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <FormLabel htmlFor="tool-function">Function (Optional)</FormLabel>
                    <Textarea
                      id="tool-function"
                      value={newTool.function}
                      onChange={(e) => setNewTool({ ...newTool, function: e.target.value })}
                      placeholder="Python function code or reference"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="return-direct"
                      checked={newTool.return_direct}
                      onCheckedChange={(checked) => setNewTool({ ...newTool, return_direct: checked })}
                    />
                    <FormLabel htmlFor="return-direct">Return Direct</FormLabel>
                  </div>

                  <Button
                    type="button"
                    onClick={addTool}
                    disabled={!newTool.name || !newTool.description}
                    className="w-full"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Tool
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.push("/crew")} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : agentId ? "Update Agent" : "Create Agent"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
