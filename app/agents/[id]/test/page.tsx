import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import AgentTestInterface from "@/components/agent-test-interface"

export default function TestAgentPage({ params }: { params: { id: string } }) {
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
          <h1 className="text-3xl font-bold">Test Agent</h1>
          <p className="text-muted-foreground mt-1">Test your agent's capabilities and behavior</p>
        </div>
      </div>

      <AgentTestInterface agentId={params.id} />
    </div>
  )
}
