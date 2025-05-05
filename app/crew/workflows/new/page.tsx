import type { Metadata } from "next"
import { CrewWorkflowForm } from "@/components/crew/crew-workflow-form"

export const metadata: Metadata = {
  title: "Create CrewAI Workflow",
  description: "Create a new collaborative AI workflow using CrewAI",
}

export default function CreateCrewWorkflowPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Create CrewAI Workflow</h1>
      <CrewWorkflowForm />
    </div>
  )
}
