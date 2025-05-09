"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Edit, Trash2, Play, Pause, Activity, Clock, BarChart, FileJson } from "lucide-react"

export default function EventProcessing() {
  // Sample event triggers
  const [eventTriggers, setEventTriggers] = useState([
    {
      id: "campaign-created",
      name: "Campaign Created",
      description: "Triggered when a new campaign is created on any platform",
      source: "Any",
      eventType: "campaign.created",
      status: "active",
      lastTriggered: "2023-10-16T14:30:00Z",
      count: 24,
      actions: [
        { type: "agent", target: "Strategos", action: "analyze_campaign" },
        { type: "notification", target: "slack", action: "send_notification" },
      ],
    },
    {
      id: "budget-threshold",
      name: "Budget Threshold Reached",
      description: "Triggered when a campaign reaches 80% of its budget",
      source: "Any",
      eventType: "campaign.budget.threshold",
      status: "active",
      lastTriggered: "2023-10-16T10:15:00Z",
      count: 12,
      actions: [
        { type: "agent", target: "Optimus", action: "optimize_budget" },
        { type: "notification", target: "email", action: "send_alert" },
      ],
    },
    {
      id: "performance-drop",
      name: "Performance Drop Detected",
      description: "Triggered when ad performance drops significantly",
      source: "Any",
      eventType: "ad.performance.drop",
      status: "active",
      lastTriggered: "2023-10-15T16:45:00Z",
      count: 8,
      actions: [
        { type: "agent", target: "Insight", action: "analyze_performance" },
        { type: "agent", target: "Optimus", action: "adjust_bidding" },
        { type: "notification", target: "slack", action: "send_alert" },
      ],
    },
    {
      id: "content-approved",
      name: "Content Approved",
      description: "Triggered when content is approved by human reviewer",
      source: "HITL Interface",
      eventType: "content.approved",
      status: "active",
      lastTriggered: "2023-10-16T11:30:00Z",
      count: 18,
      actions: [
        { type: "agent", target: "Connecta", action: "schedule_content" },
        { type: "workflow", target: "content-publishing", action: "start_workflow" },
      ],
    },
    {
      id: "negative-sentiment",
      name: "Negative Sentiment Detected",
      description: "Triggered when negative sentiment is detected in social media",
      source: "Connecta",
      eventType: "social.sentiment.negative",
      status: "inactive",
      lastTriggered: "2023-10-14T09:15:00Z",
      count: 3,
      actions: [
        { type: "agent", target: "NexusLink", action: "escalate_to_human" },
        { type: "notification", target: "slack", action: "send_urgent_alert" },
      ],
    },
  ])

  // Sample event streams
  const [eventStreams, setEventStreams] = useState([
    {
      id: "marketing-events",
      name: "Marketing Events",
      description: "Main event stream for all marketing-related events",
      status: "active",
      eventsPerMinute: 42,
      consumers: 5,
      retention: "7 days",
      eventTypes: ["campaign.*", "ad.*", "audience.*", "content.*"],
    },
    {
      id: "analytics-events",
      name: "Analytics Events",
      description: "Event stream for analytics and reporting events",
      status: "active",
      eventsPerMinute: 128,
      consumers: 3,
      retention: "30 days",
      eventTypes: ["impression.*", "click.*", "conversion.*", "engagement.*"],
    },
    {
      id: "system-events",
      name: "System Events",
      description: "Event stream for system and platform events",
      status: "active",
      eventsPerMinute: 15,
      consumers: 2,
      retention: "3 days",
      eventTypes: ["system.*", "error.*", "auth.*", "api.*"],
    },
  ])

  // Sample recent events
  const [recentEvents, setRecentEvents] = useState([
    {
      id: "evt-123456",
      type: "campaign.created",
      source: "Google Ads",
      timestamp: "2023-10-16T14:30:00Z",
      data: {
        campaignId: "camp-789012",
        name: "Fall Promotion 2023",
        budget: 5000,
        platform: "Google Ads",
      },
    },
    {
      id: "evt-123457",
      type: "ad.performance.drop",
      source: "Meta Ads",
      timestamp: "2023-10-16T14:15:00Z",
      data: {
        adId: "ad-345678",
        campaignId: "camp-901234",
        metric: "CTR",
        previousValue: 2.4,
        currentValue: 1.2,
        dropPercentage: 50,
      },
    },
    {
      id: "evt-123458",
      type: "content.approved",
      source: "HITL Interface",
      timestamp: "2023-10-16T14:00:00Z",
      data: {
        contentId: "cont-567890",
        type: "social_post",
        approvedBy: "john.doe@example.com",
        platform: "Instagram",
      },
    },
    {
      id: "evt-123459",
      type: "impression.recorded",
      source: "Analytics Service",
      timestamp: "2023-10-16T13:45:00Z",
      data: {
        adId: "ad-123456",
        campaignId: "camp-789012",
        platform: "Google Ads",
        count: 1250,
      },
    },
    {
      id: "evt-123460",
      type: "system.error",
      source: "API Gateway",
      timestamp: "2023-10-16T13:30:00Z",
      data: {
        errorCode: "RATE_LIMIT_EXCEEDED",
        service: "Meta Ads API",
        message: "Rate limit exceeded for endpoint /campaigns",
      },
    },
  ])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Real-time Processing</h2>
        <p className="text-muted-foreground">
          Event-driven architecture for immediate agent activation and real-time data processing.
        </p>
      </div>

      <Tabs defaultValue="triggers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="triggers">Event Triggers</TabsTrigger>
          <TabsTrigger value="streams">Event Streams</TabsTrigger>
          <TabsTrigger value="monitor">Event Monitor</TabsTrigger>
        </TabsList>

        <TabsContent value="triggers" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Event Triggers</h3>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Trigger
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {eventTriggers.map((trigger) => (
              <Card key={trigger.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{trigger.name}</CardTitle>
                    <Badge
                      className={
                        trigger.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }
                    >
                      {trigger.status.charAt(0).toUpperCase() + trigger.status.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription>{trigger.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Event Type:</span>
                      <span className="font-mono">{trigger.eventType}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Source:</span>
                      <span>{trigger.source}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last Triggered:</span>
                      <span>{new Date(trigger.lastTriggered).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Trigger Count:</span>
                      <span>{trigger.count}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px]">
                      <DialogHeader>
                        <DialogTitle>{trigger.name}</DialogTitle>
                        <DialogDescription>{trigger.description}</DialogDescription>
                      </DialogHeader>

                      <div className="mt-4 space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Trigger Configuration</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-xs text-muted-foreground">Event Type</Label>
                              <div className="font-mono">{trigger.eventType}</div>
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Source</Label>
                              <div>{trigger.source}</div>
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Status</Label>
                              <div>{trigger.status.charAt(0).toUpperCase() + trigger.status.slice(1)}</div>
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Trigger Count</Label>
                              <div>{trigger.count}</div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">Actions</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Target</TableHead>
                                <TableHead>Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {trigger.actions.map((action, index) => (
                                <TableRow key={index}>
                                  <TableCell className="font-medium">{action.type}</TableCell>
                                  <TableCell>{action.target}</TableCell>
                                  <TableCell>{action.action}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">Event Filter (JSON)</h4>
                          <div className="bg-gray-100 p-3 rounded-md font-mono text-xs">
                            {`{
  "type": "${trigger.eventType}",
  "source": "${trigger.source === "Any" ? "*" : trigger.source}",
  "data": {
    // Additional filter conditions
  }
}`}
                          </div>
                        </div>
                      </div>

                      <DialogFooter className="flex justify-between items-center mt-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Play className="h-4 w-4 mr-1" />
                            Test Trigger
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={trigger.status === "active" ? "text-amber-600" : "text-green-600"}
                    >
                      {trigger.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="streams" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Event Streams</h3>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Stream
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventStreams.map((stream) => (
              <Card key={stream.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{stream.name}</CardTitle>
                    <Badge
                      className={
                        stream.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }
                    >
                      {stream.status.charAt(0).toUpperCase() + stream.status.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription>{stream.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Events/min:</span>
                      <span>{stream.eventsPerMinute}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Consumers:</span>
                      <span>{stream.consumers}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Retention:</span>
                      <span>{stream.retention}</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-xs text-muted-foreground">Event Types:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {stream.eventTypes.map((type, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    <Activity className="h-4 w-4 mr-1" />
                    Monitor
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={stream.status === "active" ? "text-amber-600" : "text-green-600"}
                    >
                      {stream.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="monitor" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Event Monitor</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-100 text-green-800">
                <div className="h-2 w-2 rounded-full bg-green-600 mr-1"></div>
                Live
              </Badge>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="campaign">Campaign Events</SelectItem>
                  <SelectItem value="ad">Ad Events</SelectItem>
                  <SelectItem value="content">Content Events</SelectItem>
                  <SelectItem value="system">System Events</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Events</CardTitle>
              <CardDescription>Live stream of events across all platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEvents.map((event) => (
                  <div key={event.id} className="border rounded-md p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {event.type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{event.source}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="bg-gray-100 p-2 rounded-md font-mono text-xs overflow-x-auto">
                      {JSON.stringify(event.data, null, 2)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                <Clock className="h-4 w-4 mr-1" />
                View History
              </Button>
              <Button variant="outline" size="sm">
                <FileJson className="h-4 w-4 mr-1" />
                Export Events
              </Button>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Event Volume</CardTitle>
              </CardHeader>
              <CardContent className="h-[200px] bg-gray-100 flex items-center justify-center">
                <BarChart className="h-8 w-8 text-muted-foreground" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Event Types</CardTitle>
              </CardHeader>
              <CardContent className="h-[200px] bg-gray-100 flex items-center justify-center">
                <BarChart className="h-8 w-8 text-muted-foreground" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Agent Activations</CardTitle>
              </CardHeader>
              <CardContent className="h-[200px] bg-gray-100 flex items-center justify-center">
                <BarChart className="h-8 w-8 text-muted-foreground" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
