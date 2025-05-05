import type { Metadata } from "next"
import { CrewAIDashboard } from "@/components/crew/crew-dashboard"

export const metadata: Metadata = {
  title: "CrewAI Dashboard",
  description: "Manage and orchestrate collaborative AI agents with CrewAI",
}

export default function CrewAIPage() {
  return (
    <div className="container mx-auto py-6">
      <CrewAIDashboard />
    </div>
  )
}
