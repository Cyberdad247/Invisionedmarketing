import WorkflowBuilder from "@/components/cognito/workflow-builder"
import { getCognitoAgents } from "@/app/actions/cognito-actions"

export default async function CreateWorkflowPage() {
  const agents = await getCognitoAgents()

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Create Workflow</h1>
      <WorkflowBuilder agents={agents} />
    </div>
  )
}
