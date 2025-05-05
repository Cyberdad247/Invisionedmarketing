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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RefreshCw, Settings, Trash2, AlertCircle, CheckCircle, ExternalLink } from "lucide-react"

export default function ApiConnectors() {
  // Sample connectors data
  const [connectors, setConnectors] = useState([
    {
      id: "google-ads",
      name: "Google Ads",
      description: "Connect to Google Ads API for campaign management and data retrieval",
      status: "connected",
      lastSync: "2023-10-16T14:30:00Z",
      icon: "/placeholder.svg?height=40&width=40",
      metrics: {
        campaigns: 12,
        adGroups: 48,
        ads: 156,
      },
      authType: "oauth2",
      endpoints: [
        { name: "Campaigns", path: "/campaigns", enabled: true },
        { name: "Ad Groups", path: "/adgroups", enabled: true },
        { name: "Ads", path: "/ads", enabled: true },
        { name: "Keywords", path: "/keywords", enabled: true },
      ],
    },
    {
      id: "meta-ads",
      name: "Meta Ads",
      description: "Connect to Facebook & Instagram ads for campaign management",
      status: "connected",
      lastSync: "2023-10-16T12:15:00Z",
      icon: "/placeholder.svg?height=40&width=40",
      metrics: {
        campaigns: 8,
        adSets: 24,
        ads: 96,
      },
      authType: "oauth2",
      endpoints: [
        { name: "Campaigns", path: "/campaigns", enabled: true },
        { name: "Ad Sets", path: "/adsets", enabled: true },
        { name: "Ads", path: "/ads", enabled: true },
        { name: "Insights", path: "/insights", enabled: true },
      ],
    },
    {
      id: "linkedin-ads",
      name: "LinkedIn Ads",
      description: "Connect to LinkedIn Marketing API for B2B advertising",
      status: "error",
      lastSync: "2023-10-15T09:45:00Z",
      icon: "/placeholder.svg?height=40&width=40",
      error: "Authentication token expired",
      authType: "oauth2",
      endpoints: [
        { name: "Campaigns", path: "/campaigns", enabled: true },
        { name: "Creatives", path: "/creatives", enabled: true },
        { name: "Analytics", path: "/analytics", enabled: true },
      ],
    },
    {
      id: "twitter-ads",
      name: "Twitter Ads",
      description: "Connect to Twitter Ads API for campaign management",
      status: "disconnected",
      lastSync: null,
      icon: "/placeholder.svg?height=40&width=40",
      authType: "oauth1",
      endpoints: [
        { name: "Campaigns", path: "/campaigns", enabled: true },
        { name: "Line Items", path: "/line_items", enabled: true },
        { name: "Promoted Tweets", path: "/promoted_tweets", enabled: true },
        { name: "Analytics", path: "/analytics", enabled: true },
      ],
    },
    {
      id: "tiktok-ads",
      name: "TikTok Ads",
      description: "Connect to TikTok Ads API for campaign management",
      status: "disconnected",
      lastSync: null,
      icon: "/placeholder.svg?height=40&width=40",
      authType: "oauth2",
      endpoints: [
        { name: "Campaigns", path: "/campaigns", enabled: true },
        { name: "Ad Groups", path: "/adgroups", enabled: true },
        { name: "Ads", path: "/ads", enabled: true },
        { name: "Reports", path: "/reports", enabled: true },
      ],
    },
  ])

  const [selectedConnector, setSelectedConnector] = useState<any>(null)

  const handleSync = (id: string) => {
    // Simulate sync process
    const updatedConnectors = connectors.map((connector) => {
      if (connector.id === id) {
        return {
          ...connector,
          lastSync: new Date().toISOString(),
          status: "connected",
          error: undefined,
        }
      }
      return connector
    })
    setConnectors(updatedConnectors)
  }

  const handleRetry = (id: string) => {
    // Simulate retry process
    handleSync(id)
  }

  const handleConnect = (id: string) => {
    // Simulate connect process
    const updatedConnectors = connectors.map((connector) => {
      if (connector.id === id) {
        return {
          ...connector,
          status: "connected",
          lastSync: new Date().toISOString(),
        }
      }
      return connector
    })
    setConnectors(updatedConnectors)
  }

  const handleDisconnect = (id: string) => {
    // Simulate disconnect process
    const updatedConnectors = connectors.map((connector) => {
      if (connector.id === id) {
        return {
          ...connector,
          status: "disconnected",
          lastSync: null,
        }
      }
      return connector
    })
    setConnectors(updatedConnectors)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800">Error</Badge>
      case "disconnected":
        return <Badge className="bg-gray-100 text-gray-800">Disconnected</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">API Connectors</h2>
        <p className="text-muted-foreground">
          Connect to advertising platforms and marketing tools to sync data and automate campaigns.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {connectors.map((connector) => (
          <Card key={connector.id} className={connector.status === "error" ? "border-red-300" : ""}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <img src={connector.icon || "/placeholder.svg"} alt={connector.name} className="w-8 h-8" />
                  <CardTitle className="text-base">{connector.name}</CardTitle>
                </div>
                {getStatusBadge(connector.status)}
              </div>
              <CardDescription>{connector.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              {connector.status === "connected" && connector.metrics && (
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">
                    Last synced: {new Date(connector.lastSync!).toLocaleString()}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {Object.entries(connector.metrics).map(([key, value]) => (
                      <div key={key} className="bg-gray-100 p-2 rounded">
                        <div className="text-xs text-muted-foreground">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </div>
                        <div className="text-sm font-medium">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {connector.status === "error" && (
                <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                  <AlertCircle className="h-4 w-4" />
                  {connector.error}
                </div>
              )}
              {connector.status === "disconnected" && (
                <div className="text-sm text-muted-foreground mt-2">
                  Not connected. Click connect to set up this integration.
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-1" />
                    Configure
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <img src={connector.icon || "/placeholder.svg"} alt={connector.name} className="w-6 h-6" />
                      {connector.name} Configuration
                    </DialogTitle>
                    <DialogDescription>Configure your {connector.name} API connection settings.</DialogDescription>
                  </DialogHeader>

                  <Tabs defaultValue="settings" className="mt-4">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="settings">Settings</TabsTrigger>
                      <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
                      <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    </TabsList>

                    <TabsContent value="settings" className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="client-id">Client ID</Label>
                        <Input id="client-id" placeholder="Enter your client ID" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="client-secret">Client Secret</Label>
                        <Input id="client-secret" type="password" placeholder="Enter your client secret" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="redirect-uri">Redirect URI</Label>
                        <Input id="redirect-uri" value="https://app.cognito-platform.com/oauth/callback" readOnly />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Auto-sync</Label>
                          <p className="text-sm text-muted-foreground">Automatically sync data every 6 hours</p>
                        </div>
                        <Switch checked={true} />
                      </div>
                    </TabsContent>

                    <TabsContent value="endpoints" className="py-4">
                      <div className="space-y-4">
                        {connector.endpoints.map((endpoint, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{endpoint.name}</p>
                              <p className="text-sm text-muted-foreground">{endpoint.path}</p>
                            </div>
                            <Switch checked={endpoint.enabled} />
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="advanced" className="py-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="rate-limit">Rate Limit (requests per minute)</Label>
                          <Input id="rate-limit" type="number" defaultValue="60" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="timeout">Request Timeout (seconds)</Label>
                          <Input id="timeout" type="number" defaultValue="30" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="retry-attempts">Retry Attempts</Label>
                          <Input id="retry-attempts" type="number" defaultValue="3" />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Debug Mode</Label>
                            <p className="text-sm text-muted-foreground">Enable detailed logging</p>
                          </div>
                          <Switch checked={false} />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <DialogFooter className="flex justify-between items-center">
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete Connection
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button>Save Changes</Button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {connector.status === "connected" && (
                <Button variant="outline" size="sm" onClick={() => handleSync(connector.id)}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Sync Now
                </Button>
              )}
              {connector.status === "error" && (
                <Button variant="outline" size="sm" onClick={() => handleRetry(connector.id)}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Retry
                </Button>
              )}
              {connector.status === "disconnected" && (
                <Button variant="outline" size="sm" onClick={() => handleConnect(connector.id)}>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Connect
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">API Documentation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connectors.map((connector) => (
            <Card key={`doc-${connector.id}`}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <img src={connector.icon || "/placeholder.svg"} alt={connector.name} className="w-6 h-6" />
                  <CardTitle className="text-base">{connector.name} API</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Official documentation for the {connector.name} API, including authentication, endpoints, and
                  examples.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View Documentation
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
