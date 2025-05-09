import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, PlusCircle } from "lucide-react"
import Link from "next/link"
import AgentPortfolioCard from "@/components/cognito/agent-portfolio-card"

export default function AgentPortfolioPage() {
  // The 11 specialized AI agents with their details
  const agentPortfolio = [
    {
      id: "strategos",
      name: "Strategos",
      role: "Strategic Planning",
      description: "Handles market analysis, goal setting, and audience definition for marketing campaigns.",
      coreSkills: ["Market Analysis", "Goal Setting", "Audience Definition"],
      hitlPoints: ["Strategy Approval", "Budget Allocation"],
      autonomyLevel: "medium",
      color: "blue",
      icon: "📊",
    },
    {
      id: "lexica",
      name: "Lexica",
      role: "Content Creation (Text)",
      description: "Creates blog posts, ad copy, and social media content with brand-aligned messaging.",
      coreSkills: ["Blog Writing", "Ad Copy", "Social Media Posts"],
      hitlPoints: ["Key Content Approval", "Brand Voice Check"],
      autonomyLevel: "medium",
      color: "indigo",
      icon: "📝",
    },
    {
      id: "visio",
      name: "Visio",
      role: "Content Creation (Visual)",
      description: "Generates images and basic graphic designs for marketing materials and social media.",
      coreSkills: ["Image Generation", "Basic Graphic Design"],
      hitlPoints: ["Brand-Sensitive Visual Approval"],
      autonomyLevel: "low",
      color: "purple",
      icon: "🎨",
    },
    {
      id: "optimus",
      name: "Optimus",
      role: "Media Buying & Optimization",
      description: "Manages ad platforms and controls budgets for optimal campaign performance.",
      coreSkills: ["Ad Platform Management", "Budget Control"],
      hitlPoints: ["Budget Limits", "Campaign Changes"],
      autonomyLevel: "medium",
      color: "green",
      icon: "💰",
    },
    {
      id: "connecta",
      name: "Connecta",
      role: "Social Media Management",
      description: "Handles post scheduling and engagement across social media platforms.",
      coreSkills: ["Post Scheduling", "Engagement"],
      hitlPoints: ["Crisis Response", "High-Impact Initiatives"],
      autonomyLevel: "high",
      color: "cyan",
      icon: "🔄",
    },
    {
      id: "crawler",
      name: "Crawler",
      role: "SEO Audit",
      description: "Analyzes websites and researches keywords to improve search engine visibility.",
      coreSkills: ["Website Analysis", "Keyword Research"],
      hitlPoints: ["Major Technical SEO Changes"],
      autonomyLevel: "high",
      color: "amber",
      icon: "🔍",
    },
    {
      id: "fixer",
      name: "Fixer",
      role: "Technical Optimization",
      description: "Makes code adjustments and schema markup to improve website performance.",
      coreSkills: ["Code Adjustments", "Schema Markup"],
      hitlPoints: ["Significant Website Modifications"],
      autonomyLevel: "low",
      color: "orange",
      icon: "🔧",
    },
    {
      id: "insight",
      name: "Insight",
      role: "Analytics & Reporting",
      description: "Analyzes data and tracks KPIs to provide actionable marketing insights.",
      coreSkills: ["Data Analysis", "KPI Tracking"],
      hitlPoints: ["Complex Report Interpretation"],
      autonomyLevel: "high",
      color: "sky",
      icon: "📈",
    },
    {
      id: "converse",
      name: "Converse",
      role: "Client Communication",
      description: "Handles automated updates and meeting scheduling with clients.",
      coreSkills: ["Automated Updates", "Meeting Scheduling"],
      hitlPoints: ["Onboarding", "Strategic Discussions"],
      autonomyLevel: "medium",
      color: "pink",
      icon: "💬",
    },
    {
      id: "sentinel",
      name: "Sentinel",
      role: "Error Handling",
      description: "Analyzes logs and performs system checks to identify and resolve issues.",
      coreSkills: ["Log Analysis", "System Checks"],
      hitlPoints: ["Complex Error Escalation"],
      autonomyLevel: "high",
      color: "red",
      icon: "🛡️",
    },
    {
      id: "nexuslink",
      name: "NexusLink",
      role: "Human Interface",
      description: "Presents data and handles interventions between AI systems and human operators.",
      coreSkills: ["Data Presentation", "Intervention Handling"],
      hitlPoints: ["All human interactions"],
      autonomyLevel: "low",
      color: "violet",
      icon: "🔗",
    },
  ]

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/cognito">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">AI Agent Portfolio</h1>
            <p className="text-muted-foreground">11 specialized AI agents for marketing automation</p>
          </div>
        </div>
        <Link href="/cognito/agents/create">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Create Agent
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="all">All Agents</TabsTrigger>
          <TabsTrigger value="content">Content Creation</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agentPortfolio.map((agent) => (
              <AgentPortfolioCard key={agent.id} agent={agent} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agentPortfolio
              .filter((agent) => ["lexica", "visio"].includes(agent.id))
              .map((agent) => (
                <AgentPortfolioCard key={agent.id} agent={agent} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="technical" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agentPortfolio
              .filter((agent) => ["crawler", "fixer", "sentinel"].includes(agent.id))
              .map((agent) => (
                <AgentPortfolioCard key={agent.id} agent={agent} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agentPortfolio
              .filter((agent) => ["insight", "strategos"].includes(agent.id))
              .map((agent) => (
                <AgentPortfolioCard key={agent.id} agent={agent} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agentPortfolio
              .filter((agent) => ["optimus", "connecta"].includes(agent.id))
              .map((agent) => (
                <AgentPortfolioCard key={agent.id} agent={agent} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="communication" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agentPortfolio
              .filter((agent) => ["converse", "nexuslink"].includes(agent.id))
              .map((agent) => (
                <AgentPortfolioCard key={agent.id} agent={agent} />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Symbolect Visual Language</h2>
        <p className="text-muted-foreground mb-6">
          The Symbolect visual language simplifies complex workflow creation by using intuitive symbols:
        </p>

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
