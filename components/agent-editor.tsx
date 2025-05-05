"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import ToolsConfiguration from "@/components/tools-configuration"
import MemoryConfiguration from "@/components/memory-configuration"
import DeploymentOptions from "@/components/deployment-options"
import {
  getAgentById,
  updateAgent,
  saveAgentTools,
  saveMemoryConfig,
  saveDeploymentConfig,
} from "@/app/actions/agent-actions"
import { useToast } from "@/hooks/use-toast"
import { Database, Globe, Calculator, FileText, MessageSquare } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Agent name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  model: z.string({
    required_error: "Please select a model.",
  }),
  systemPrompt: z.string().min(10, {
    message: "System prompt must be at least 10 characters.",
  }),
  maxTokens: z.coerce.number().min(100).max(32000),
  temperature: z.coerce.number().min(0).max(2),
  streaming: z.boolean().default(true),
})

export default function AgentEditor({ agentId }: { agentId: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tools, setTools] = useState([])
  const [memoryConfig, setMemoryConfig] = useState({
    memoryType: "conversation",
    messageWindow: 10,
  })
  const [deploymentConfig, setDeploymentConfig] = useState({
    deploymentType: "vercel",
    region: "auto",
    environment: "production",
    webhookEnabled: false,
    webhookUrl: "",
    rateLimitingEnabled: true,
    fluidComputeEnabled: true,
  })
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      model: "",
      systemPrompt: "",
      maxTokens: 1024,
      temperature: 0.7,
      streaming: true,
    },
  })

  // Fetch agent data
  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        setIsLoading(true)
        const data = await getAgentById(Number.parseInt(agentId, 10))

        if (data) {
          // Set form values
          form.reset({
            name: data.agent.name,
            description: data.agent.description,
            model: data.agent.model,
            systemPrompt: data.agent.system_prompt,
            maxTokens: data.agent.max_tokens,
            temperature: data.agent.temperature,
            streaming: data.agent.streaming,
          })

          // Set tools
          if (data.tools && data.tools.length > 0) {
            setTools(
              data.tools.map((tool) => ({
                id: tool.id.toString(),
                name: tool.name,
                type: tool.type,
                description: tool.description,
                enabled: tool.enabled,
                icon: getIconForToolType(tool.type),
                config: tool.config || {},
              })),
            )
          }

          // Set memory config
          if (data.memoryConfig) {
            setMemoryConfig({
              memoryType: data.memoryConfig.memory_type,
              messageWindow: data.memoryConfig.message_window || 10,
            })
          }

          // Set deployment config
          if (data.deploymentConfig) {
            setDeploymentConfig({
              deploymentType: data.deploymentConfig.deployment_type,
              region: data.deploymentConfig.region,
              environment: data.deploymentConfig.environment,
              webhookEnabled: data.deploymentConfig.webhook_enabled,
              webhookUrl: data.deploymentConfig.webhook_url || "",
              rateLimitingEnabled: data.deploymentConfig.rate_limiting_enabled,
              fluidComputeEnabled: data.deploymentConfig.fluid_compute_enabled,
            })
          }
        }
      } catch (error) {
        console.error("Error fetching agent data:", error)
        toast({
          title: "Error",
          description: "Failed to load agent data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAgentData()
  }, [agentId, form, toast])

  // Helper function to get icon for tool type
  const getIconForToolType = (type: string) => {
    switch (type) {
      case "database":
        return Database
      case "web-search":
        return Globe
      case "calculator":
        return Calculator
      case "document-retrieval":
        return FileText
      case "chat-history":
        return MessageSquare
      default:
        return Globe
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)

      // Update the agent
      await updateAgent(Number.parseInt(agentId, 10), {
        name: values.name,
        description: values.description,
        model: values.model,
        system_prompt: values.systemPrompt,
        max_tokens: values.maxTokens,
        temperature: values.temperature,
        streaming: values.streaming,
      })

      // Save tools
      if (tools.length > 0) {
        await saveAgentTools(Number.parseInt(agentId, 10), tools)
      }

      // Save memory config
      await saveMemoryConfig(Number.parseInt(agentId, 10), {
        memory_type: memoryConfig.memoryType,
        message_window: memoryConfig.messageWindow,
      })

      // Save deployment config
      await saveDeploymentConfig(Number.parseInt(agentId, 10), {
        deployment_type: deploymentConfig.deploymentType,
        region: deploymentConfig.region,
        environment: deploymentConfig.environment,
        webhook_url: deploymentConfig.webhookUrl,
        webhook_enabled: deploymentConfig.webhookEnabled,
        rate_limiting_enabled: deploymentConfig.rateLimitingEnabled,
        fluid_compute_enabled: deploymentConfig.fluidComputeEnabled,
      })

      toast({
        title: "Agent updated",
        description: "Your agent has been successfully updated.",
      })

      router.push("/")
    } catch (error) {
      console.error("Error updating agent:", error)
      toast({
        title: "Error",
        description: "Failed to update agent. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
        <span className="ml-2">Loading agent data...</span>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="model">Model Settings</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agent Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Customer Support Agent" {...field} />
                  </FormControl>
                  <FormDescription>A descriptive name for your agent.</FormDescription>
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
                    <Textarea
                      placeholder="This agent helps customers with product inquiries and support issues."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Describe what your agent does and its purpose.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="model" className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AI Model</FormLabel>
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
                      <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Select the AI model that powers your agent.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="systemPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Prompt</FormLabel>
                  <FormControl>
                    <Textarea placeholder="You are a helpful AI assistant." className="min-h-[150px]" {...field} />
                  </FormControl>
                  <FormDescription>Instructions that define your agent's behavior and capabilities.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="maxTokens"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Tokens</FormLabel>
                    <FormControl>
                      <Input type="number" min={100} max={32000} {...field} />
                    </FormControl>
                    <FormDescription>Maximum length of the model's response.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temperature</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} max={2} step={0.1} {...field} />
                    </FormControl>
                    <FormDescription>Controls randomness (0 = deterministic, 2 = very random).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="streaming"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Streaming Responses</FormLabel>
                    <FormDescription>Enable token-by-token streaming for faster responses.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <MemoryConfiguration value={memoryConfig} onChange={setMemoryConfig} />
          </TabsContent>

          <TabsContent value="tools" className="pt-4">
            <ToolsConfiguration value={tools} onChange={setTools} />
          </TabsContent>

          <TabsContent value="deployment" className="pt-4">
            <DeploymentOptions value={deploymentConfig} onChange={setDeploymentConfig} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.push("/")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
