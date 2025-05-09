import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import AgentTemplateForm from "@/components/cognito/agent-template-form"

interface AgentTemplatePageProps {
  params: {
    id: string
  }
}

export default function AgentTemplatePage({ params }: AgentTemplatePageProps) {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Link
          href="/cognito/agents/portfolio"
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Agent Portfolio
        </Link>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Create Agent from Template</h1>
          <p className="text-muted-foreground mt-1">Customize and deploy a specialized AI agent</p>
        </div>
      </div>

      <Card className="p-6">
        <AgentTemplateForm templateId={params.id} />
      </Card>
    </div>
  )
}
