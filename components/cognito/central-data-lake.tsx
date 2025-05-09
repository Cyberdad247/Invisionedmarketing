"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Database, RefreshCw, LinkIcon, AlertCircle } from "lucide-react"

export default function CentralDataLake() {
  // Sample data sources
  const [dataSources, setDataSources] = useState([
    {
      id: 1,
      name: "Google Ads",
      type: "google_ads",
      status: "connected",
      lastSync: "2023-10-16T14:30:00Z",
      metrics: {
        campaigns: 12,
        adGroups: 48,
        ads: 156,
      },
    },
    {
      id: 2,
      name: "Meta Ads",
      type: "meta",
      status: "connected",
      lastSync: "2023-10-16T12:15:00Z",
      metrics: {
        campaigns: 8,
        adSets: 24,
        ads: 96,
      },
    },
    {
      id: 3,
      name: "LinkedIn Ads",
      type: "linkedin",
      status: "error",
      lastSync: "2023-10-15T09:45:00Z",
      error: "Authentication token expired",
    },
    {
      id: 4,
      name: "Twitter Ads",
      type: "twitter",
      status: "disconnected",
      lastSync: null,
    },
    {
      id: 5,
      name: "CRM System",
      type: "custom",
      status: "connected",
      lastSync: "2023-10-16T10:30:00Z",
      metrics: {
        contacts: 1250,
        deals: 48,
        activities: 356,
      },
    },
  ])

  // Sample datasets
  const [datasets, setDatasets] = useState([
    {
      id: 1,
      name: "Campaign Performance",
      description: "Aggregated performance metrics across all ad platforms",
      lastUpdated: "2023-10-16T15:30:00Z",
      size: "24.5 MB",
      records: 15680,
    },
    {
      id: 2,
      name: "Customer Segments",
      description: "Customer segmentation based on behavior and demographics",
      lastUpdated: "2023-10-15T11:45:00Z",
      size: "8.2 MB",
      records: 5240,
    },
    {
      id: 3,
      name: "Content Performance",
      description: "Performance metrics for all content pieces",
      lastUpdated: "2023-10-16T09:15:00Z",
      size: "12.7 MB",
      records: 8920,
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Central Data Lake (Nexus)</h2>
          <p className="text-muted-foreground">Centralized data repository for all marketing data</p>
        </div>
      </div>

      <Tabs defaultValue="sources" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sources">Data Sources</TabsTrigger>
          <TabsTrigger value="datasets">Datasets</TabsTrigger>
          <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Connected Data Sources</h3>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Data Source
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dataSources.map((source) => (
              <Card key={source.id} className={source.status === "error" ? "border-red-300" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      {source.name}
                    </CardTitle>
                    <div
                      className={`px-2 py-1 rounded-full text-xs ${
                        source.status === "connected"
                          ? "bg-green-100 text-green-800"
                          : source.status === "error"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {source.status.charAt(0).toUpperCase() + source.status.slice(1)}
                    </div>
                  </div>
                  <CardDescription>
                    {source.type
                      .split("_")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}{" "}
                    Integration
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  {source.status === "connected" && source.metrics && (
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">
                        Last synced: {new Date(source.lastSync!).toLocaleString()}
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {Object.entries(source.metrics).map(([key, value]) => (
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
                  {source.status === "error" && (
                    <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                      <AlertCircle className="h-4 w-4" />
                      {source.error}
                    </div>
                  )}
                  {source.status === "disconnected" && (
                    <div className="text-sm text-muted-foreground mt-2">
                      Not connected. Click connect to set up this data source.
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  {source.status === "connected" && (
                    <Button variant="outline" size="sm" className="w-full">
                      <RefreshCw className="h-3 w-3 mr-2" />
                      Sync Now
                    </Button>
                  )}
                  {source.status === "error" && (
                    <Button variant="outline" size="sm" className="w-full">
                      <RefreshCw className="h-3 w-3 mr-2" />
                      Retry Connection
                    </Button>
                  )}
                  {source.status === "disconnected" && (
                    <Button variant="outline" size="sm" className="w-full">
                      <LinkIcon className="h-3 w-3 mr-2" />
                      Connect
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="datasets" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Available Datasets</h3>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Dataset
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {datasets.map((dataset) => (
              <Card key={dataset.id}>
                <CardHeader>
                  <CardTitle className="text-base">{dataset.name}</CardTitle>
                  <CardDescription>{dataset.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <div className="text-xs text-muted-foreground">Last Updated</div>
                      <div className="text-sm">{new Date(dataset.lastUpdated).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Size</div>
                      <div className="text-sm">{dataset.size}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Records</div>
                      <div className="text-sm">{dataset.records.toLocaleString()}</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    View Data
                  </Button>
                  <Button variant="outline" size="sm">
                    Export
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="visualizations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Data Visualizations</h3>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Visualization
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Campaign Performance Dashboard</CardTitle>
                <CardDescription>Key metrics across all marketing campaigns</CardDescription>
              </CardHeader>
              <CardContent className="h-64 bg-gray-100 flex items-center justify-center">
                <p className="text-muted-foreground">Dashboard Visualization</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Open Dashboard
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Customer Journey Analysis</CardTitle>
                <CardDescription>Visualization of customer touchpoints and conversion paths</CardDescription>
              </CardHeader>
              <CardContent className="h-64 bg-gray-100 flex items-center justify-center">
                <p className="text-muted-foreground">Journey Visualization</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Open Dashboard
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
