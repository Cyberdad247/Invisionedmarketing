"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, AlertTriangle, Terminal, Copy, ExternalLink, Rocket } from "lucide-react"

export default function AgentDeployment({ agentId }: { agentId: string }) {
  const [isDeploying, setIsDeploying] = useState(false)
  const [isDeployed, setIsDeployed] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const handleDeploy = () => {
    setIsDeploying(true)

    // Simulate deployment process
    setTimeout(() => {
      setIsDeploying(false)
      setIsDeployed(true)
    }, 3000)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Deployment Configuration</CardTitle>
            <CardDescription>Review and configure your agent deployment settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="api">API</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="pt-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Agent Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="text-sm">Customer Support Agent</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Model</p>
                      <p className="text-sm">gpt-4o</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <Badge variant="outline" className="bg-amber-500/15 text-amber-600">
                        Ready to Deploy
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Deployment Type</p>
                      <p className="text-sm">Vercel</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Enabled Tools</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Web Search</Badge>
                    <Badge variant="secondary">Document Retrieval</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Pre-Deployment Checklist</h3>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <Checkbox id="check-1" defaultChecked />
                      <div className="grid gap-1.5">
                        <Label htmlFor="check-1" className="text-sm">
                          Agent configuration is complete
                        </Label>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Checkbox id="check-2" defaultChecked />
                      <div className="grid gap-1.5">
                        <Label htmlFor="check-2" className="text-sm">
                          Agent has been tested and works as expected
                        </Label>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Checkbox id="check-3" />
                      <div className="grid gap-1.5">
                        <Label htmlFor="check-3" className="text-sm">
                          API keys and environment variables are configured
                        </Label>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Checkbox id="check-4" />
                      <div className="grid gap-1.5">
                        <Label htmlFor="check-4" className="text-sm">
                          Rate limiting and security settings are configured
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>

                <Alert variant="warning" className="bg-amber-500/15 text-amber-600 border-amber-200">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Attention Required</AlertTitle>
                  <AlertDescription>
                    Please complete all items in the pre-deployment checklist before deploying.
                  </AlertDescription>
                </Alert>
              </TabsContent>

              <TabsContent value="settings" className="pt-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Environment Variables</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <Input placeholder="OPENAI_API_KEY" value="OPENAI_API_KEY" readOnly />
                      <Input placeholder="Value" type="password" value="sk-..." className="col-span-2" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Input placeholder="Key" value="VECTOR_DB_URL" readOnly />
                      <Input placeholder="Value" type="password" value="https://..." className="col-span-2" />
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">
                      Add Variable
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Deployment Region</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Primary Region</p>
                      <p className="text-sm">Auto (Recommended)</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Backup Region</p>
                      <p className="text-sm">None</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Rate Limiting</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Requests per minute</p>
                      <p className="text-sm">100</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Concurrent requests</p>
                      <p className="text-sm">10</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Scaling</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Min instances</p>
                      <p className="text-sm">1</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Max instances</p>
                      <p className="text-sm">10</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="api" className="pt-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">API Endpoint</h3>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy</span>
                    </Button>
                  </div>
                  <div className="bg-muted p-2 rounded-md font-mono text-xs">
                    https://api.agent-platform.com/v1/agents/{agentId}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Your agent is secured with API key authentication. Include the API key in the request headers.
                  </p>
                  <div className="bg-muted p-2 rounded-md font-mono text-xs">Authorization: Bearer YOUR_API_KEY</div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Example Request</h3>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy</span>
                    </Button>
                  </div>
                  <div className="bg-muted p-2 rounded-md font-mono text-xs overflow-x-auto">
                    <pre>{`curl -X POST \\
  https://api.agent-platform.com/v1/agents/${agentId} \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Hello, I need help with my order"
      }
    ]
  }'`}</pre>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">API Documentation</h3>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    View Full Documentation
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Save Draft</Button>
            <Button onClick={handleDeploy} disabled={isDeploying || isDeployed} className="flex items-center gap-2">
              {isDeploying ? (
                <>
                  <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  Deploying...
                </>
              ) : isDeployed ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Deployed
                </>
              ) : (
                <>
                  <Rocket className="h-4 w-4" />
                  Deploy Agent
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {isDeployed && (
          <Alert className="bg-green-500/15 text-green-600 border-green-200">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Deployment Successful</AlertTitle>
            <AlertDescription>
              Your agent has been successfully deployed and is now available at the API endpoint.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Deployment Status</CardTitle>
            <CardDescription>Current status of your agent deployment.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                {isDeployed ? (
                  <Badge className="bg-green-500/15 text-green-600">Active</Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-500/15 text-amber-600">
                    Not Deployed
                  </Badge>
                )}
              </div>

              {isDeployed && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Deployment ID</span>
                    <span className="text-sm text-muted-foreground">dep_12345abcde</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Deployed At</span>
                    <span className="text-sm text-muted-foreground">{new Date().toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Region</span>
                    <span className="text-sm text-muted-foreground">Auto (iad1)</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deployment Logs</CardTitle>
            <CardDescription>View logs from your agent deployment.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-black text-green-400 p-3 rounded-md font-mono text-xs h-[200px] overflow-y-auto">
              {isDeployed ? (
                <>
                  <p>[{new Date().toLocaleTimeString()}] Starting deployment...</p>
                  <p>[{new Date().toLocaleTimeString()}] Building agent...</p>
                  <p>[{new Date().toLocaleTimeString()}] Installing dependencies...</p>
                  <p>[{new Date().toLocaleTimeString()}] Configuring environment variables...</p>
                  <p>[{new Date().toLocaleTimeString()}] Setting up API endpoints...</p>
                  <p>[{new Date().toLocaleTimeString()}] Deploying to Vercel...</p>
                  <p>[{new Date().toLocaleTimeString()}] Deployment successful!</p>
                  <p>[{new Date().toLocaleTimeString()}] Agent is now online and ready to use.</p>
                </>
              ) : (
                <p>Logs will appear here after deployment.</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              View Full Logs
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
