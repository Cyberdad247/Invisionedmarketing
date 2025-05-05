import { getWorkflows } from "@/app/actions/cognito-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Play, Edit, Share2 } from "lucide-react"
import Link from "next/link"

interface WorkflowDetailPageProps {
  params: {
    id: string
  }
}

export default async function WorkflowDetailPage({ params }: WorkflowDetailPageProps) {
  const workflows = await getWorkflows()
  const workflow = workflows.find((w) => w.id === Number.parseInt(params.id))

  if (!workflow) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Workflow not found</h1>
        <Link href="/cognito/workflows">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Workflows
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/cognito/workflows">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{workflow.name}</h1>
            <p className="text-muted-foreground">{workflow.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Link href={`/cognito/workflows/${workflow.id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button>
            <Play className="h-4 w-4 mr-2" />
            Run
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Diagram</CardTitle>
              <CardDescription>Visual representation of the workflow</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px] bg-gray-100 flex items-center justify-center">
              <p className="text-muted-foreground">Workflow visualization would be displayed here</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                <p className="font-medium">{workflow.status || "Draft"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                <p>{new Date(workflow.created_at).toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                <p>{new Date(workflow.updated_at).toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Nodes</h3>
                <p>{workflow.nodes.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Agents Involved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {workflow.nodes
                  .filter((node) => node.type === "agent")
                  .map((node, index) => (
                    <div key={index} className="p-2 border rounded flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span>{node.data.agentName || "Unknown Agent"}</span>
                    </div>
                  ))}

                {workflow.nodes.filter((node) => node.type === "agent").length === 0 && (
                  <p className="text-muted-foreground">No agents in this workflow</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Human Review Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {workflow.nodes
                  .filter((node) => node.type === "hitl")
                  .map((node, index) => (
                    <div key={index} className="p-2 border rounded flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                      <div>
                        <div className="font-medium">{node.data.reviewType || "Approval"}</div>
                        <div className="text-xs text-muted-foreground">
                          {node.data.instructions || "No instructions"}
                        </div>
                      </div>
                    </div>
                  ))}

                {workflow.nodes.filter((node) => node.type === "hitl").length === 0 && (
                  <p className="text-muted-foreground">No human review points in this workflow</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
