"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Edit, AlertTriangle, Bell, Eye, ThumbsUp, ThumbsDown, Bot } from "lucide-react"
import type { PendingReview, SystemAlert } from "@/types/cognito"

interface HumanInTheLoopInterfaceProps {
  initialPendingReviews: PendingReview[]
  initialSystemAlerts: SystemAlert[]
}

export default function HumanInTheLoopInterface({
  initialPendingReviews,
  initialSystemAlerts,
}: HumanInTheLoopInterfaceProps) {
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>(initialPendingReviews)
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>(initialSystemAlerts)
  const [globalAutonomy, setGlobalAutonomy] = useState<"manual" | "assisted" | "autonomous">("assisted")

  // Sample agent statuses
  const agentStatuses = [
    { name: "Strategos", status: "idle", lastActivity: "2023-10-16T14:30:00Z", tasks: 0 },
    { name: "Lexica", status: "active", lastActivity: "2023-10-16T15:45:00Z", tasks: 2 },
    { name: "Visio", status: "active", lastActivity: "2023-10-16T15:30:00Z", tasks: 1 },
    { name: "Optimus", status: "idle", lastActivity: "2023-10-16T13:15:00Z", tasks: 0 },
    { name: "Connecta", status: "active", lastActivity: "2023-10-16T15:40:00Z", tasks: 3 },
  ]

  // Sample performance metrics
  const performanceMetrics = {
    campaignsActive: 8,
    contentPieces: 24,
    leadsGenerated: 156,
    conversionRate: 3.2,
    roi: 420,
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500/15 text-red-600"
      case "high":
        return "bg-orange-500/15 text-orange-600"
      case "medium":
        return "bg-yellow-500/15 text-yellow-600"
      case "low":
        return "bg-blue-500/15 text-blue-600"
      default:
        return "bg-gray-500/15 text-gray-600"
    }
  }

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case "error":
        return "bg-red-500/15 text-red-600"
      case "warning":
        return "bg-orange-500/15 text-orange-600"
      case "info":
        return "bg-blue-500/15 text-blue-600"
      case "success":
        return "bg-green-500/15 text-green-600"
      default:
        return "bg-gray-500/15 text-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Human-in-the-Loop Interface (Oculus)</h2>
          <p className="text-muted-foreground">Command center for human oversight</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Global Autonomy:</span>
            <select
              value={globalAutonomy}
              onChange={(e) => setGlobalAutonomy(e.target.value as any)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="manual">Manual</option>
              <option value="assisted">Assisted</option>
              <option value="autonomous">Autonomous</option>
            </select>
          </div>
          <Button variant="outline" className="relative">
            <Bell className="h-4 w-4" />
            {systemAlerts.filter((a) => !a.read).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                {systemAlerts.filter((a) => !a.read).length}
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="reviews" className="space-y-4">
            <TabsList>
              <TabsTrigger value="reviews">Pending Reviews</TabsTrigger>
              <TabsTrigger value="agents">Agent Status</TabsTrigger>
              <TabsTrigger value="alerts">System Alerts</TabsTrigger>
            </TabsList>

            <TabsContent value="reviews" className="space-y-4">
              <h3 className="text-lg font-medium">Tasks Requiring Human Input</h3>

              {pendingReviews.length === 0 ? (
                <Card>
                  <CardContent className="py-6 text-center">
                    <p className="text-muted-foreground">No pending reviews at this time.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {pendingReviews.map((review) => (
                    <Card key={review.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base flex items-center gap-2">
                              <Badge variant="outline" className="bg-purple-500/15 text-purple-600">
                                {review.taskType}
                              </Badge>
                              <span>From {review.agentName}</span>
                            </CardTitle>
                            <CardDescription>Submitted {new Date(review.createdAt).toLocaleString()}</CardDescription>
                          </div>
                          <Badge className={getPriorityColor(review.priority)}>
                            {review.priority.charAt(0).toUpperCase() + review.priority.slice(1)} Priority
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {review.taskType === "Content Approval" && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">{review.content.title}</h4>
                            <p className="text-sm text-muted-foreground">{review.content.body.substring(0, 150)}...</p>
                          </div>
                        )}
                        {review.taskType === "Budget Allocation" && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Budget Change for {review.content.campaign}</h4>
                            <p className="text-sm text-muted-foreground">
                              Proposed budget: ${review.content.amount.toLocaleString()}
                            </p>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600">
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="agents" className="space-y-4">
              <h3 className="text-lg font-medium">Agent Status Monitor</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {agentStatuses.map((agent, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Bot className="h-4 w-4" />
                          {agent.name}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className={
                            agent.status === "active"
                              ? "bg-green-500/15 text-green-600"
                              : "bg-gray-500/15 text-gray-600"
                          }
                        >
                          {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-xs text-muted-foreground">Last Activity</div>
                          <div className="text-sm">{new Date(agent.lastActivity).toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Active Tasks</div>
                          <div className="text-sm">{agent.tasks}</div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Enabled</span>
                        <Switch checked={agent.status === "active"} />
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-4">
              <h3 className="text-lg font-medium">System Alerts</h3>

              {systemAlerts.length === 0 ? (
                <Card>
                  <CardContent className="py-6 text-center">
                    <p className="text-muted-foreground">No system alerts at this time.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {systemAlerts.map((alert) => (
                    <Card key={alert.id} className={!alert.read ? "border-l-4 border-l-amber-500" : ""}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base flex items-center gap-2">
                            {alert.type === "warning" && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                            {alert.type === "error" && <XCircle className="h-4 w-4 text-red-500" />}
                            {alert.type === "info" && <Bell className="h-4 w-4 text-blue-500" />}
                            {alert.type === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
                            <span>From {alert.source}</span>
                          </CardTitle>
                          <Badge className={getAlertTypeColor(alert.type)}>
                            {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                          </Badge>
                        </div>
                        <CardDescription>{new Date(alert.timestamp).toLocaleString()}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{alert.message}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-green-600">
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600">
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Performance Overview</CardTitle>
              <CardDescription>Key campaign metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-100 p-3 rounded">
                    <div className="text-xs text-muted-foreground">Active Campaigns</div>
                    <div className="text-xl font-medium">{performanceMetrics.campaignsActive}</div>
                  </div>
                  <div className="bg-gray-100 p-3 rounded">
                    <div className="text-xs text-muted-foreground">Content Pieces</div>
                    <div className="text-xl font-medium">{performanceMetrics.contentPieces}</div>
                  </div>
                  <div className="bg-gray-100 p-3 rounded">
                    <div className="text-xs text-muted-foreground">Leads Generated</div>
                    <div className="text-xl font-medium">{performanceMetrics.leadsGenerated}</div>
                  </div>
                  <div className="bg-gray-100 p-3 rounded">
                    <div className="text-xs text-muted-foreground">Conversion Rate</div>
                    <div className="text-xl font-medium">{performanceMetrics.conversionRate}%</div>
                  </div>
                </div>

                <div className="bg-gray-100 p-3 rounded">
                  <div className="text-xs text-muted-foreground">ROI</div>
                  <div className="text-2xl font-medium text-green-600">{performanceMetrics.roi}%</div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                View Full Analytics
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve All Pending Content
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Pause All Active Campaigns
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Bot className="h-4 w-4 mr-2" />
                Run Content Creation Workflow
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Eye className="h-4 w-4 mr-2" />
                Generate Performance Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
