import type { Metadata } from "next"
import { CrewAgentForm } from "@/components/crew/crew-agent-form"

export const metadata: Metadata = {
  title: "Create CrewAI Agent",
  description: "Create a new collaborative AI agent using CrewAI",
}

export default function CreateCrewAgentPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Create CrewAI Agent</h1>
      <CrewAgentForm />
    </div>
  )
}
