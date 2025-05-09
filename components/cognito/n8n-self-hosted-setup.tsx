"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Code } from "@/components/ui/code"
import { selfHostedSetupInstructions } from "@/lib/n8n/config"
import { testN8nConnection } from "@/app/actions/n8n-actions"
import { InfoCircledIcon, CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons"

export function N8nSelfHostedSetup() {
  const [n8nUrl, setN8nUrl] = useState("")
  const [n8nApiKey, setN8nApiKey] = useState("")
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "testing" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleTestConnection = async () => {
    setConnectionStatus("testing")
    try {
      const result = await testN8nConnection(n8nUrl, n8nApiKey)
      if (result.success) {
        setConnectionStatus("success")
      } else {
        setConnectionStatus("error")
        setErrorMessage(result.error || "Unknown error occurred")
      }
    } catch (error) {
      setConnectionStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred")
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Self-Hosted n8n Setup</CardTitle>
        <CardDescription>Configure your self-hosted n8n instance to work with Cognito</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="setup">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="setup">Setup Instructions</TabsTrigger>
            <TabsTrigger value="configure">Configure Connection</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-4">
            {selfHostedSetupInstructions.steps.map((step, index) => (
              <div key={index} className="space-y-2">
                <h3 className="text-lg font-medium">
                  Step {index + 1}: {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>

                {step.commands && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Commands:</p>
                    {step.commands.map((command, cmdIndex) => (
                      <Code key={cmdIndex} className="w-full">
                        {command}
                      </Code>
                    ))}
                  </div>
                )}

                {step.envVars && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Environment Variables:</p>
                    {step.envVars.map((envVar, envIndex) => (
                      <Code key={envIndex} className="w-full">
                        {envVar}
                      </Code>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Alert>
              <InfoCircledIcon className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                For production use, ensure your n8n instance is properly secured with authentication and runs behind a
                reverse proxy with HTTPS.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="configure" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="n8n-url">n8n URL</Label>
                <Input
                  id="n8n-url"
                  placeholder="http://your-n8n-instance:5678"
                  value={n8nUrl}
                  onChange={(e) => setN8nUrl(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="n8n-api-key">n8n API Key</Label>
                <Input
                  id="n8n-api-key"
                  type="password"
                  placeholder="Your n8n API key"
                  value={n8nApiKey}
                  onChange={(e) => setN8nApiKey(e.target.value)}
                />
              </div>

              {connectionStatus === "success" && (
                <Alert variant="success">
                  <CheckCircledIcon className="h-4 w-4" />
                  <AlertTitle>Connection Successful</AlertTitle>
                  <AlertDescription>
                    Successfully connected to your n8n instance. You can now use n8n workflows with Cognito.
                  </AlertDescription>
                </Alert>
              )}

              {connectionStatus === "error" && (
                <Alert variant="destructive">
                  <CrossCircledIcon className="h-4 w-4" />
                  <AlertTitle>Connection Failed</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleTestConnection} disabled={!n8nUrl || !n8nApiKey || connectionStatus === "testing"}>
          {connectionStatus === "testing" ? "Testing..." : "Test Connection"}
        </Button>
      </CardFooter>
    </Card>
  )
}
