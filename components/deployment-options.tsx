"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { FormDescription } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { BellIcon as Vercel, Server, Globe } from "lucide-react"

interface DeploymentOptionsProps {
  value: {
    deploymentType: string
    region: string
    environment: string
    webhookEnabled: boolean
    webhookUrl: string
    rateLimitingEnabled: boolean
    fluidComputeEnabled: boolean
  }
  onChange: (value: any) => void
}

export default function DeploymentOptions({ value, onChange }: DeploymentOptionsProps) {
  const [deploymentType, setDeploymentType] = useState(value.deploymentType || "vercel")
  const [enableWebhook, setEnableWebhook] = useState(value.webhookEnabled || false)
  const [webhookUrl, setWebhookUrl] = useState(value.webhookUrl || "")
  const [region, setRegion] = useState(value.region || "auto")
  const [environment, setEnvironment] = useState(value.environment || "production")
  const [rateLimitingEnabled, setRateLimitingEnabled] = useState(value.rateLimitingEnabled || true)
  const [fluidComputeEnabled, setFluidComputeEnabled] = useState(value.fluidComputeEnabled || true)

  useEffect(() => {
    onChange({
      deploymentType,
      region,
      environment,
      webhookEnabled: enableWebhook,
      webhookUrl,
      rateLimitingEnabled,
      fluidComputeEnabled,
    })
  }, [
    deploymentType,
    region,
    environment,
    enableWebhook,
    webhookUrl,
    rateLimitingEnabled,
    fluidComputeEnabled,
    onChange,
  ])

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Deployment Options</h3>
        <p className="text-sm text-muted-foreground">Configure how and where your agent will be deployed.</p>
      </div>

      <RadioGroup
        value={deploymentType}
        onValueChange={setDeploymentType}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className={`cursor-pointer border-2 ${deploymentType === "vercel" ? "border-primary" : "border-border"}`}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <RadioGroupItem value="vercel" id="deployment-vercel" className="sr-only" />
              <Vercel className="h-6 w-6" />
            </div>
            <CardTitle className="text-base">Vercel</CardTitle>
            <CardDescription>Deploy to Vercel's serverless platform</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Recommended for most use cases. Automatic scaling and global edge network.
            </p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer border-2 ${deploymentType === "self-hosted" ? "border-primary" : "border-border"}`}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <RadioGroupItem value="self-hosted" id="deployment-self-hosted" className="sr-only" />
              <Server className="h-6 w-6" />
            </div>
            <CardTitle className="text-base">Self-Hosted</CardTitle>
            <CardDescription>Deploy to your own infrastructure</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Full control over your deployment. Requires Docker and server management.
            </p>
          </CardContent>
        </Card>

        <Card className={`cursor-pointer border-2 ${deploymentType === "api" ? "border-primary" : "border-border"}`}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <RadioGroupItem value="api" id="deployment-api" className="sr-only" />
              <Globe className="h-6 w-6" />
            </div>
            <CardTitle className="text-base">API Only</CardTitle>
            <CardDescription>Deploy as an API endpoint</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Integrate with existing applications via REST API. No UI included.
            </p>
          </CardContent>
        </Card>
      </RadioGroup>

      {deploymentType === "vercel" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="region">Deployment Region</Label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger id="region" className="mt-1">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto (Recommended)</SelectItem>
                  <SelectItem value="iad1">Washington, D.C. (iad1)</SelectItem>
                  <SelectItem value="sfo1">San Francisco (sfo1)</SelectItem>
                  <SelectItem value="dub1">Dublin (dub1)</SelectItem>
                  <SelectItem value="hnd1">Tokyo (hnd1)</SelectItem>
                  <SelectItem value="syd1">Sydney (syd1)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Where your agent will be deployed. Auto selects the closest region to your users.
              </FormDescription>
            </div>

            <div>
              <Label htmlFor="environment">Environment</Label>
              <Select value={environment} onValueChange={setEnvironment}>
                <SelectTrigger id="environment" className="mt-1">
                  <SelectValue placeholder="Select environment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="preview">Preview</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>The environment for your agent deployment.</FormDescription>
            </div>
          </div>

          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Fluid Compute</Label>
              <FormDescription>Enable Vercel's Fluid Compute for better performance and reliability.</FormDescription>
            </div>
            <Switch checked={fluidComputeEnabled} onCheckedChange={setFluidComputeEnabled} />
          </div>
        </div>
      )}

      {deploymentType === "self-hosted" && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="docker-image">Docker Image</Label>
            <Input id="docker-image" defaultValue="agent-platform/agent:latest" className="mt-1" />
            <FormDescription>The Docker image that will be used for deployment.</FormDescription>
          </div>

          <div>
            <Label htmlFor="deployment-instructions">Deployment Instructions</Label>
            <div className="mt-1 p-4 bg-muted rounded-md text-sm font-mono">
              <p>docker pull agent-platform/agent:latest</p>
              <p>docker run -p 3000:3000 -e API_KEY=your_api_key agent-platform/agent:latest</p>
            </div>
            <FormDescription>Instructions for deploying your agent to your own infrastructure.</FormDescription>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label className="text-base">Webhook Notifications</Label>
            <FormDescription>Send notifications to a webhook URL when your agent is invoked.</FormDescription>
          </div>
          <Switch checked={enableWebhook} onCheckedChange={setEnableWebhook} />
        </div>

        {enableWebhook && (
          <div>
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <Input
              id="webhook-url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://example.com/webhook"
              className="mt-1"
            />
            <FormDescription>The URL that will receive webhook notifications.</FormDescription>
          </div>
        )}
      </div>

      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label className="text-base">Rate Limiting</Label>
          <FormDescription>Limit the number of requests to your agent to prevent abuse.</FormDescription>
        </div>
        <Switch checked={rateLimitingEnabled} onCheckedChange={setRateLimitingEnabled} />
      </div>
    </div>
  )
}
