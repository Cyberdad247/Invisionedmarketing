"use client"

import { useState, useEffect } from "react"
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
import { Slider } from "@/components/ui/slider"
import { createCognitoAgent } from "@/app/actions/cognito-actions"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Agent name must be at least 2 characters.",
  }),
  role: z.string().min(2, {
    message: "Role must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  activationTrigger: z.string().min(2, {
    message: "Activation trigger must be at least 2 characters.",
  }),
  autonomyLevel: z.string({
    required_error: "Please select an autonomy level.",
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

interface AgentTemplateFormProps {
  templateId: string
}

export default function AgentTemplateForm({ templateId }: AgentTemplateFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [coreSkills, setCoreSkills] = useState<
    { name: string; description: string; category: string; searchable: boolean }[]
  >([])
  const [hitlReviewPoints, setHitlReviewPoints] = useState<{ name: string; description: string; required: boolean }[]>(
    [],
  )
  const { toast } = useToast()

  // Template data for each agent type
  const templates: Record<string, any> = {
    strategos: {
      name: "Strategos",
      role: "Strategic Planning",
      description: "Handles market analysis, goal setting, and audience definition for marketing campaigns.",
      activationTrigger: "/plan",
      autonomyLevel: "medium",
      model: "gpt-4o",
      systemPrompt:
        "You are Strategos, an AI specialized in strategic marketing planning. You analyze markets, set goals, and define target audiences. Always consider business objectives and ROI in your recommendations.",
      maxTokens: 2048,
      temperature: 0.7,
      streaming: true,
      coreSkills: [
        {
          name: "Market Analysis",
          description: "Analyze market trends and competitive landscape",
          category: "analysis",
          searchable: true,
        },
        {
          name: "Goal Setting",
          description: "Define SMART marketing goals aligned with business objectives",
          category: "strategy",
          searchable: true,
        },
        {
          name: "Audience Definition",
          description: "Create detailed audience personas and segments",
          category: "strategy",
          searchable: true,
        },
      ],
      hitlReviewPoints: [
        { name: "Strategy Approval", description: "Review and approve overall marketing strategy", required: true },
        { name: "Budget Allocation", description: "Review and approve budget allocations", required: true },
      ],
    },
    lexica: {
      name: "Lexica",
      role: "Content Creation (Text)",
      description: "Creates blog posts, ad copy, and social media content with brand-aligned messaging.",
      activationTrigger: "/write",
      autonomyLevel: "medium",
      model: "gpt-4o",
      systemPrompt:
        "You are Lexica, an AI specialized in creating written marketing content. You write blog posts, ad copy, and social media content. Always maintain brand voice and focus on engaging the target audience.",
      maxTokens: 4096,
      temperature: 0.8,
      streaming: true,
      coreSkills: [
        {
          name: "Blog Writing",
          description: "Create SEO-optimized blog content",
          category: "content",
          searchable: true,
        },
        {
          name: "Ad Copy",
          description: "Write compelling ad copy for various platforms",
          category: "content",
          searchable: true,
        },
        {
          name: "Social Media Posts",
          description: "Create engaging social media content",
          category: "content",
          searchable: true,
        },
      ],
      hitlReviewPoints: [
        { name: "Key Content Approval", description: "Review and approve important content pieces", required: true },
        { name: "Brand Voice Check", description: "Ensure content aligns with brand voice", required: true },
      ],
    },
    visio: {
      name: "Visio",
      role: "Content Creation (Visual)",
      description: "Generates images and basic graphic designs for marketing materials and social media.",
      activationTrigger: "/design",
      autonomyLevel: "low",
      model: "claude-3-opus",
      systemPrompt:
        "You are Visio, an AI specialized in creating visual marketing content. You generate images and basic graphic designs. Always adhere to brand guidelines and focus on visual appeal and message clarity.",
      maxTokens: 2048,
      temperature: 0.7,
      streaming: true,
      coreSkills: [
        {
          name: "Image Generation",
          description: "Create images for marketing materials",
          category: "visual",
          searchable: true,
        },
        {
          name: "Basic Graphic Design",
          description: "Design simple graphics and layouts",
          category: "visual",
          searchable: true,
        },
      ],
      hitlReviewPoints: [
        { name: "Brand-Sensitive Visual Approval", description: "Review visuals for brand alignment", required: true },
      ],
    },
    optimus: {
      name: "Optimus",
      role: "Media Buying & Optimization",
      description: "Manages ad platforms and controls budgets for optimal campaign performance.",
      activationTrigger: "/optimize",
      autonomyLevel: "medium",
      model: "gpt-4o",
      systemPrompt:
        "You are Optimus, an AI specialized in media buying and campaign optimization. You manage ad platforms and control budgets. Always focus on maximizing ROI and performance metrics.",
      maxTokens: 2048,
      temperature: 0.5,
      streaming: true,
      coreSkills: [
        {
          name: "Ad Platform Management",
          description: "Manage campaigns across ad platforms",
          category: "advertising",
          searchable: true,
        },
        {
          name: "Budget Control",
          description: "Optimize budget allocation for maximum ROI",
          category: "advertising",
          searchable: true,
        },
      ],
      hitlReviewPoints: [
        { name: "Budget Limits", description: "Review when approaching budget thresholds", required: true },
        { name: "Campaign Changes", description: "Review significant campaign modifications", required: true },
      ],
    },
    connecta: {
      name: "Connecta",
      role: "Social Media Management",
      description: "Handles post scheduling and engagement across social media platforms.",
      activationTrigger: "/social",
      autonomyLevel: "high",
      model: "gpt-4o",
      systemPrompt:
        "You are Connecta, an AI specialized in social media management. You handle post scheduling and engagement. Always maintain brand voice and focus on building community and engagement.",
      maxTokens: 2048,
      temperature: 0.8,
      streaming: true,
      coreSkills: [
        {
          name: "Post Scheduling",
          description: "Schedule posts for optimal engagement",
          category: "social",
          searchable: true,
        },
        { name: "Engagement", description: "Respond to comments and messages", category: "social", searchable: true },
      ],
      hitlReviewPoints: [
        { name: "Crisis Response", description: "Review responses during PR issues", required: true },
        { name: "High-Impact Initiatives", description: "Review major social campaigns", required: true },
      ],
    },
    crawler: {
      name: "Crawler",
      role: "SEO Audit",
      description: "Analyzes websites and researches keywords to improve search engine visibility.",
      activationTrigger: "/audit",
      autonomyLevel: "high",
      model: "gpt-4o",
      systemPrompt:
        "You are Crawler, an AI specialized in SEO auditing. You analyze websites and research keywords. Always focus on improving search visibility and following SEO best practices.",
      maxTokens: 4096,
      temperature: 0.5,
      streaming: true,
      coreSkills: [
        {
          name: "Website Analysis",
          description: "Analyze website structure and content for SEO",
          category: "technical",
          searchable: true,
        },
        {
          name: "Keyword Research",
          description: "Identify valuable keywords and search trends",
          category: "technical",
          searchable: true,
        },
      ],
      hitlReviewPoints: [
        {
          name: "Major Technical SEO Changes",
          description: "Review significant technical recommendations",
          required: true,
        },
      ],
    },
    fixer: {
      name: "Fixer",
      role: "Technical Optimization",
      description: "Makes code adjustments and schema markup to improve website performance.",
      activationTrigger: "/fix",
      autonomyLevel: "low",
      model: "gpt-4o",
      systemPrompt:
        "You are Fixer, an AI specialized in technical website optimization. You make code adjustments and schema markup. Always focus on performance, accessibility, and SEO best practices.",
      maxTokens: 4096,
      temperature: 0.3,
      streaming: true,
      coreSkills: [
        {
          name: "Code Adjustments",
          description: "Make technical code improvements",
          category: "technical",
          searchable: true,
        },
        {
          name: "Schema Markup",
          description: "Implement structured data for SEO",
          category: "technical",
          searchable: true,
        },
      ],
      hitlReviewPoints: [
        { name: "Significant Website Modifications", description: "Review major code changes", required: true },
      ],
    },
    insight: {
      name: "Insight",
      role: "Analytics & Reporting",
      description: "Analyzes data and tracks KPIs to provide actionable marketing insights.",
      activationTrigger: "/analyze",
      autonomyLevel: "high",
      model: "gpt-4o",
      systemPrompt:
        "You are Insight, an AI specialized in marketing analytics and reporting. You analyze data and track KPIs. Always focus on actionable insights and clear data visualization.",
      maxTokens: 4096,
      temperature: 0.4,
      streaming: true,
      coreSkills: [
        {
          name: "Data Analysis",
          description: "Analyze marketing performance data",
          category: "analytics",
          searchable: true,
        },
        {
          name: "KPI Tracking",
          description: "Monitor and report on key performance indicators",
          category: "analytics",
          searchable: true,
        },
      ],
      hitlReviewPoints: [
        { name: "Complex Report Interpretation", description: "Review complex data interpretations", required: true },
      ],
    },
    converse: {
      name: "Converse",
      role: "Client Communication",
      description: "Handles automated updates and meeting scheduling with clients.",
      activationTrigger: "/communicate",
      autonomyLevel: "medium",
      model: "gpt-4o",
      systemPrompt:
        "You are Converse, an AI specialized in client communication. You handle automated updates and meeting scheduling. Always maintain a professional tone and focus on clear, concise communication.",
      maxTokens: 2048,
      temperature: 0.7,
      streaming: true,
      coreSkills: [
        {
          name: "Automated Updates",
          description: "Send regular client updates",
          category: "communication",
          searchable: true,
        },
        {
          name: "Meeting Scheduling",
          description: "Coordinate and schedule client meetings",
          category: "communication",
          searchable: true,
        },
      ],
      hitlReviewPoints: [
        { name: "Onboarding", description: "Review client onboarding communications", required: true },
        { name: "Strategic Discussions", description: "Review communications about strategy", required: true },
      ],
    },
    sentinel: {
      name: "Sentinel",
      role: "Error Handling",
      description: "Analyzes logs and performs system checks to identify and resolve issues.",
      activationTrigger: "/monitor",
      autonomyLevel: "high",
      model: "gpt-4o",
      systemPrompt:
        "You are Sentinel, an AI specialized in error handling and system monitoring. You analyze logs and perform system checks. Always focus on proactive issue identification and clear error reporting.",
      maxTokens: 2048,
      temperature: 0.3,
      streaming: true,
      coreSkills: [
        {
          name: "Log Analysis",
          description: "Analyze system logs for issues",
          category: "technical",
          searchable: true,
        },
        {
          name: "System Checks",
          description: "Perform regular system health checks",
          category: "technical",
          searchable: true,
        },
      ],
      hitlReviewPoints: [
        { name: "Complex Error Escalation", description: "Review complex error situations", required: true },
      ],
    },
    nexuslink: {
      name: "NexusLink",
      role: "Human Interface",
      description: "Presents data and handles interventions between AI systems and human operators.",
      activationTrigger: "/interface",
      autonomyLevel: "low",
      model: "gpt-4o",
      systemPrompt:
        "You are NexusLink, an AI specialized in human-AI interaction. You present data and handle interventions. Always focus on clear communication and effective collaboration between AI systems and human operators.",
      maxTokens: 2048,
      temperature: 0.7,
      streaming: true,
      coreSkills: [
        {
          name: "Data Presentation",
          description: "Present complex data clearly to humans",
          category: "interface",
          searchable: true,
        },
        {
          name: "Intervention Handling",
          description: "Manage human interventions in AI processes",
          category: "interface",
          searchable: true,
        },
      ],
      hitlReviewPoints: [
        { name: "All human interactions", description: "All interactions require human review", required: true },
      ],
    },
  }

  // Load template data
  useEffect(() => {
    if (templateId && templates[templateId]) {
      const template = templates[templateId]
      form.reset({
        name: template.name,
        role: template.role,
        description: template.description,
        activationTrigger: template.activationTrigger,
        autonomyLevel: template.autonomyLevel,
        model: template.model,
        systemPrompt: template.systemPrompt,
        maxTokens: template.maxTokens,
        temperature: template.temperature,
        streaming: template.streaming,
      })
      setCoreSkills(template.coreSkills)
      setHitlReviewPoints(template.hitlReviewPoints)
    }
  }, [templateId])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      role: "",
      description: "",
      activationTrigger: "",
      autonomyLevel: "medium",
      model: "gpt-4o",
      systemPrompt: "",
      maxTokens: 2048,
      temperature: 0.7,
      streaming: true,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)

      // Create the agent
      const result = await createCognitoAgent({
        name: values.name,
        role: values.role,
        description: values.description,
        activationTrigger: values.activationTrigger,
        autonomyLevel: values.autonomyLevel,
        coreSkills: coreSkills,
        hitlReviewPoints: hitlReviewPoints,
      })

      toast({
        title: "Agent created",
        description: "Your specialized agent has been successfully created.",
      })

      router.push("/cognito")
    } catch (error) {
      console.error("Error creating agent:", error)
      toast({
        title: "Error",
        description: "Failed to create agent. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="model">Model Settings</TabsTrigger>
            <TabsTrigger value="skills">Core Skills</TabsTrigger>
            <TabsTrigger value="hitl">HITL Points</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agent Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>A descriptive name for your agent.</FormDescription>
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
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>The specialized role of this agent.</FormDescription>
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
                    <Textarea className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormDescription>Describe what your agent does and its purpose.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="activationTrigger"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activation Trigger</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Command or phrase that activates this agent (e.g., /write, /analyze).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="autonomyLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Autonomy Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select autonomy level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low - Significant human oversight</SelectItem>
                      <SelectItem value="medium">Medium - Regular review at key points</SelectItem>
                      <SelectItem value="high">High - Minimal intervention</SelectItem>
                      <SelectItem value="full">Full - Autonomous operation</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Determines how much human oversight is required.</FormDescription>
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
                    <Textarea className="min-h-[150px]" {...field} />
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
                    <FormLabel>Temperature: {field.value}</FormLabel>
                    <FormControl>
                      <Slider
                        defaultValue={[field.value]}
                        min={0}
                        max={2}
                        step={0.1}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
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
          </TabsContent>

          <TabsContent value="skills" className="space-y-6 pt-4">
            <div>
              <h3 className="text-lg font-medium mb-4">Core Skills</h3>
              <div className="space-y-4">
                {coreSkills.map((skill, index) => (
                  <div key={index} className="border p-4 rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                      <div>
                        <label className="block text-sm font-medium mb-1">Skill Name</label>
                        <Input
                          value={skill.name}
                          onChange={(e) => {
                            const newSkills = [...coreSkills]
                            newSkills[index].name = e.target.value
                            setCoreSkills(newSkills)
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <Input
                          value={skill.category}
                          onChange={(e) => {
                            const newSkills = [...coreSkills]
                            newSkills[index].category = e.target.value
                            setCoreSkills(newSkills)
                          }}
                        />
                      </div>
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <Textarea
                        value={skill.description}
                        onChange={(e) => {
                          const newSkills = [...coreSkills]
                          newSkills[index].description = e.target.value
                          setCoreSkills(newSkills)
                        }}
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`searchable-${index}`}
                        checked={skill.searchable}
                        onChange={(e) => {
                          const newSkills = [...coreSkills]
                          newSkills[index].searchable = e.target.checked
                          setCoreSkills(newSkills)
                        }}
                        className="mr-2"
                      />
                      <label htmlFor={`searchable-${index}`} className="text-sm">
                        Searchable (can be discovered by other agents)
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setCoreSkills([...coreSkills, { name: "", description: "", category: "", searchable: true }])
                }}
              >
                Add Skill
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="hitl" className="space-y-6 pt-4">
            <div>
              <h3 className="text-lg font-medium mb-4">Human-in-the-Loop Review Points</h3>
              <div className="space-y-4">
                {hitlReviewPoints.map((point, index) => (
                  <div key={index} className="border p-4 rounded-md">
                    <div className="mb-2">
                      <label className="block text-sm font-medium mb-1">Review Point Name</label>
                      <Input
                        value={point.name}
                        onChange={(e) => {
                          const newPoints = [...hitlReviewPoints]
                          newPoints[index].name = e.target.value
                          setHitlReviewPoints(newPoints)
                        }}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <Textarea
                        value={point.description}
                        onChange={(e) => {
                          const newPoints = [...hitlReviewPoints]
                          newPoints[index].description = e.target.value
                          setHitlReviewPoints(newPoints)
                        }}
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`required-${index}`}
                        checked={point.required}
                        onChange={(e) => {
                          const newPoints = [...hitlReviewPoints]
                          newPoints[index].required = e.target.checked
                          setHitlReviewPoints(newPoints)
                        }}
                        className="mr-2"
                      />
                      <label htmlFor={`required-${index}`} className="text-sm">
                        Required (cannot be bypassed)
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setHitlReviewPoints([...hitlReviewPoints, { name: "", description: "", required: true }])
                }}
              >
                Add Review Point
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.push("/cognito/agents/portfolio")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                Creating...
              </>
            ) : (
              "Create Agent"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
