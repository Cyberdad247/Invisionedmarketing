import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { getAgents } from "@/app/actions/agent-actions"
import AgentsList from "@/components/agents-list"

export default async function HomePage() {
  const agents = await getAgents()

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Agent Platform</h1>
          <p className="text-muted-foreground mt-1">Create, configure, and deploy AI agents</p>
        </div>
        <div className="flex gap-4">
          <Link href="/cognito">
            <Button variant="outline" className="flex items-center gap-2">
              Cognito Platform
            </Button>
          </Link>
          <Link href="/create">
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Agent
            </Button>
          </Link>
        </div>
      </div>

      <AgentsList initialAgents={agents} />
    </div>
  )
}
