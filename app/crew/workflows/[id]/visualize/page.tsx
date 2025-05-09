import type { Metadata } from "next"
import { CrewWorkflowVisualizer } from "@/components/crew/crew-workflow-visualizer"

export const metadata: Metadata = {
  title: "Visualize CrewAI Workflow",
  description: "Visualize a collaborative AI workflow using CrewAI",
}

export default function VisualizeCrewWorkflowPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Workflow Visualization</h1>
      <CrewWorkflowVisualizer workflowId={params.id} />
    </div>
  )
}
