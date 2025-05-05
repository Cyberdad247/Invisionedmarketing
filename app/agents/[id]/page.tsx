import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import AgentEditor from "@/components/agent-editor"

export default function EditAgentPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to dashboard
        </Link>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Edit Agent</h1>
          <p className="text-muted-foreground mt-1">Modify your agent's configuration</p>
        </div>
      </div>

      <Card className="p-6">
        <AgentEditor agentId={params.id} />
      </Card>
    </div>
  )
}
