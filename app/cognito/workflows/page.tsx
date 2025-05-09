import { getWorkflows } from "@/app/actions/cognito-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Share2, Play, Pause, Edit, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function WorkflowsPage() {
  const workflows = await getWorkflows()

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/cognito">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Workflow Automation Engine (Synapse)</h1>
            <p className="text-muted-foreground">Create and manage marketing workflows</p>
          </div>
        </div>
        <Link href="/cognito/workflows/create">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Create Workflow
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workflows.length > 0 ? (
          workflows.map((workflow) => (
            <Card key={workflow.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{workflow.name}</CardTitle>
                  <div
                    className={`px-2 py-1 rounded-full text-xs ${
                      workflow.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {workflow.status === "active" ? "Active" : "Draft"}
                  </div>
                </div>
                <CardDescription>{workflow.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium">Agents Involved</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {workflow.nodes
                        .filter((node) => node.type === "agent")
                        .map((node, index) => (
                          <div key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            {node.data.agentName || "Unknown Agent"}
                          </div>
                        ))}

                      {workflow.nodes.filter((node) => node.type === "agent").length === 0 && (
                        <div className="text-xs text-muted-foreground">No agents in this workflow</div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Last Updated</h4>
                    <p className="text-sm text-muted-foreground">{new Date(workflow.updated_at).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/cognito/workflows/${workflow.id}`}>
                    <Share2 className="h-4 w-4 mr-1" />
                    View
                  </Link>
                </Button>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/cognito/workflows/${workflow.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  {workflow.status === "active" ? (
                    <Button size="sm" variant="outline" className="text-amber-600">
                      <Pause className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="text-green-600">
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-2 text-center py-10">
            <h3 className="text-lg font-medium">No workflows found</h3>
            <p className="text-muted-foreground mt-1">Create your first workflow to get started</p>
            <Button className="mt-4" asChild>
              <Link href="/cognito/workflows/create">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Workflow
              </Link>
            </Button>
          </div>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Symbolect Visual Language</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4 flex flex-col items-center">
              <div className="text-3xl mb-2">👤</div>
              <h4 className="text-sm font-medium">Human Review</h4>
              <p className="text-xs text-center text-muted-foreground">Human review required</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center">
              <div className="text-3xl mb-2">✅</div>
              <h4 className="text-sm font-medium">Approval Point</h4>
              <p className="text-xs text-center text-muted-foreground">Requires approval to proceed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center">
              <div className="text-3xl mb-2">❌</div>
              <h4 className="text-sm font-medium">Rejection Point</h4>
              <p className="text-xs text-center text-muted-foreground">Stop point if rejected</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center">
              <div className="text-3xl mb-2">✏️</div>
              <h4 className="text-sm font-medium">Edit Task</h4>
              <p className="text-xs text-center text-muted-foreground">Modify the current task</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center">
              <div className="text-3xl mb-2">📈</div>
              <h4 className="text-sm font-medium">Performance Check</h4>
              <p className="text-xs text-center text-muted-foreground">Evaluate performance metrics</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
