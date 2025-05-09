"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function NewConnectionForm() {
  const router = useRouter()
  const [connectionType, setConnectionType] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/cognito/integrations")
    }, 1500)
  }

  // Available connection types
  const connectionTypes = [
    {
      id: "google-ads",
      name: "Google Ads",
      description: "Connect to Google Ads API for campaign management and data retrieval",
      icon: "/placeholder.svg?height=40&width=40",
      category: "advertising",
    },
    {
      id: "meta-ads",
      name: "Meta Ads",
      description: "Connect to Facebook & Instagram ads for campaign management",
      icon: "/placeholder.svg?height=40&width=40",
      category: "advertising",
    },
    {
      id: "linkedin-ads",
      name: "LinkedIn Ads",
      description: "Connect to LinkedIn Marketing API for B2B advertising",
      icon: "/placeholder.svg?height=40&width=40",
      category: "advertising",
    },
    {
      id: "twitter-ads",
      name: "Twitter Ads",
      description: "Connect to Twitter Ads API for campaign management",
      icon: "/placeholder.svg?height=40&width=40",
      category: "advertising",
    },
    {
      id: "tiktok-ads",
      name: "TikTok Ads",
      description: "Connect to TikTok Ads API for campaign management",
      icon: "/placeholder.svg?height=40&width=40",
      category: "advertising",
    },
    {
      id: "google-analytics",
      name: "Google Analytics",
      description: "Connect to Google Analytics for website analytics data",
      icon: "/placeholder.svg?height=40&width=40",
      category: "analytics",
    },
    {
      id: "adobe-analytics",
      name: "Adobe Analytics",
      description: "Connect to Adobe Analytics for website analytics data",
      icon: "/placeholder.svg?height=40&width=40",
      category: "analytics",
    },
    {
      id: "mailchimp",
      name: "Mailchimp",
      description: "Connect to Mailchimp for email marketing data",
      icon: "/placeholder.svg?height=40&width=40",
      category: "marketing",
    },
    {
      id: "hubspot",
      name: "HubSpot",
      description: "Connect to HubSpot for CRM and marketing data",
      icon: "/placeholder.svg?height=40&width=40",
      category: "marketing",
    },
    {
      id: "salesforce",
      name: "Salesforce",
      description: "Connect to Salesforce for CRM data",
      icon: "/placeholder.svg?height=40&width=40",
      category: "crm",
    },
    {
      id: "shopify",
      name: "Shopify",
      description: "Connect to Shopify for e-commerce data",
      icon: "/placeholder.svg?height=40&width=40",
      category: "ecommerce",
    },
    {
      id: "custom-api",
      name: "Custom API",
      description: "Connect to a custom API endpoint",
      icon: "/placeholder.svg?height=40&width=40",
      category: "custom",
    },
  ]

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-4">1. Select Connection Type</h3>
          <Tabs defaultValue="advertising" className="space-y-4">
            <TabsList className="flex flex-wrap">
              <TabsTrigger value="advertising">Advertising</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="marketing">Marketing</TabsTrigger>
              <TabsTrigger value="crm">CRM</TabsTrigger>
              <TabsTrigger value="ecommerce">E-Commerce</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>

            <TabsContent value="advertising" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {connectionTypes
                  .filter((type) => type.category === "advertising")
                  .map((type) => (
                    <Card
                      key={type.id}
                      className={`cursor-pointer transition-all hover:border-primary ${
                        connectionType === type.id ? "border-2 border-primary" : ""
                      }`}
                      onClick={() => setConnectionType(type.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <img src={type.icon || "/placeholder.svg"} alt={type.name} className="w-8 h-8" />
                          <div>
                            <h4 className="font-medium">{type.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              Advertising
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {connectionTypes
                  .filter((type) => type.category === "analytics")
                  .map((type) => (
                    <Card
                      key={type.id}
                      className={`cursor-pointer transition-all hover:border-primary ${
                        connectionType === type.id ? "border-2 border-primary" : ""
                      }`}
                      onClick={() => setConnectionType(type.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <img src={type.icon || "/placeholder.svg"} alt={type.name} className="w-8 h-8" />
                          <div>
                            <h4 className="font-medium">{type.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              Analytics
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            {/* Similar TabsContent for other categories */}
            <TabsContent value="marketing" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {connectionTypes
                  .filter((type) => type.category === "marketing")
                  .map((type) => (
                    <Card
                      key={type.id}
                      className={`cursor-pointer transition-all hover:border-primary ${
                        connectionType === type.id ? "border-2 border-primary" : ""
                      }`}
                      onClick={() => setConnectionType(type.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <img src={type.icon || "/placeholder.svg"} alt={type.name} className="w-8 h-8" />
                          <div>
                            <h4 className="font-medium">{type.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              Marketing
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {connectionTypes
                  .filter((type) => type.category === "custom")
                  .map((type) => (
                    <Card
                      key={type.id}
                      className={`cursor-pointer transition-all hover:border-primary ${
                        connectionType === type.id ? "border-2 border-primary" : ""
                      }`}
                      onClick={() => setConnectionType(type.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <img src={type.icon || "/placeholder.svg"} alt={type.name} className="w-8 h-8" />
                          <div>
                            <h4 className="font-medium">{type.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              Custom
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {connectionType && (
          <>
            <div>
              <h3 className="text-lg font-medium mb-4">2. Configure Connection</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="connection-name">Connection Name</Label>
                    <Input id="connection-name" placeholder="My Google Ads Connection" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="connection-id">Connection ID</Label>
                    <Input id="connection-id" placeholder="google-ads-main" />
                    <p className="text-xs text-muted-foreground">
                      Unique identifier for this connection. Use only lowercase letters, numbers, and hyphens.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="connection-description">Description</Label>
                  <Textarea
                    id="connection-description"
                    placeholder="Connection to our main Google Ads account"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Authentication Method</Label>
                  <Select defaultValue="oauth2">
                    <SelectTrigger>
                      <SelectValue placeholder="Select authentication method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                      <SelectItem value="apikey">API Key</SelectItem>
                      <SelectItem value="basic">Basic Auth</SelectItem>
                      <SelectItem value="jwt">JWT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4 border p-4 rounded-md">
                  <h4 className="font-medium">OAuth 2.0 Configuration</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="client-id">Client ID</Label>
                      <Input id="client-id" placeholder="Enter your client ID" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client-secret">Client Secret</Label>
                      <Input id="client-secret" type="password" placeholder="Enter your client secret" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="redirect-uri">Redirect URI</Label>
                    <Input
                      id="redirect-uri"
                      value="https://app.cognito-platform.com/oauth/callback"
                      readOnly
                      className="bg-gray-100"
                    />
                    <p className="text-xs text-muted-foreground">Use this URL in your OAuth application settings.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scopes">Scopes</Label>
                    <Input
                      id="scopes"
                      placeholder="ads.readonly profile.readonly"
                      defaultValue="ads.readonly profile.readonly"
                    />
                    <p className="text-xs text-muted-foreground">
                      Space-separated list of permission scopes required for this connection.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">3. Advanced Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-sync</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically sync data from this connection every 6 hours
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Event Stream Integration</Label>
                    <p className="text-sm text-muted-foreground">
                      Send events from this connection to the event stream
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Data Mapping</Label>
                    <p className="text-sm text-muted-foreground">Automatically map data to standardized schemas</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rate-limit">Rate Limit (requests per minute)</Label>
                  <Input id="rate-limit" type="number" defaultValue="60" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeout">Request Timeout (seconds)</Label>
                  <Input id="timeout" type="number" defaultValue="30" />
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.push("/cognito/integrations")}>
            Cancel
          </Button>
          <Button type="submit" disabled={!connectionType || isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                Creating...
              </>
            ) : (
              "Create Connection"
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
