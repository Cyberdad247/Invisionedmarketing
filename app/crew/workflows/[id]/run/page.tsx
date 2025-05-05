import type { Metadata } from "next"
import { CrewWorkflowRunner } from "@/components/crew/crew-workflow-runner"

export const metadata: Metadata = {
  title: "Run CrewAI Workflow",
  description: "Execute a collaborative AI workflow using CrewAI",
}

export default function RunCrewWorkflowPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Run Workflow</h1>
      <CrewWorkflowRunner workflowId={params.id} />
    </div>
  )
}
