import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCognitoAgents, getPendingReviews, getSystemAlerts } from "@/app/actions/cognito-actions"
import AgentManagementModule from "@/components/cognito/agent-management-module"
import WorkflowAutomationEngine from "@/components/cognito/workflow-automation-engine"
import CentralDataLake from "@/components/cognito/central-data-lake"
import HumanInTheLoopInterface from "@/components/cognito/human-in-the-loop-interface"
import CognitoNavigation from "@/components/cognito/navigation"

export default async function CognitoDashboard() {
  const agents = await getCognitoAgents()
  const pendingReviews = await getPendingReviews()
  const systemAlerts = await getSystemAlerts()

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Cognito Platform</h1>
          <p className="text-muted-foreground mt-1">Semi-Autonomous Marketing System</p>
        </div>
      </div>

      <CognitoNavigation />

      <Tabs defaultValue="agents" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="agents">Agent Management</TabsTrigger>
          <TabsTrigger value="workflows">Workflow Automation</TabsTrigger>
          <TabsTrigger value="data">Central Data Lake</TabsTrigger>
          <TabsTrigger value="hitl">Human-in-the-Loop</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-6">
          <AgentManagementModule initialAgents={agents} />
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <WorkflowAutomationEngine />
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <CentralDataLake />
        </TabsContent>

        <TabsContent value="hitl" className="space-y-6">
          <HumanInTheLoopInterface initialPendingReviews={pendingReviews} initialSystemAlerts={systemAlerts} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
