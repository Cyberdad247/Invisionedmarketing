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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Edit, Trash2, ArrowRight, Download, Code, FileJson } from "lucide-react"

export default function DataMapping() {
  // Sample data schemas
  const [schemas, setSchemas] = useState([
    {
      id: "campaign",
      name: "Campaign",
      description: "Standardized schema for marketing campaigns across platforms",
      version: "1.2.0",
      lastUpdated: "2023-10-15T14:30:00Z",
      fields: [
        { name: "id", type: "string", required: true, description: "Unique identifier for the campaign" },
        { name: "name", type: "string", required: true, description: "Campaign name" },
        { name: "status", type: "enum", required: true, description: "Campaign status (active, paused, completed)" },
        { name: "startDate", type: "date", required: true, description: "Campaign start date" },
        { name: "endDate", type: "date", required: false, description: "Campaign end date" },
        { name: "budget", type: "number", required: true, description: "Campaign budget" },
        { name: "objective", type: "enum", required: true, description: "Campaign objective" },
        { name: "targetAudience", type: "object", required: false, description: "Target audience details" },
        { name: "platform", type: "string", required: true, description: "Advertising platform" },
        { name: "metrics", type: "object", required: false, description: "Campaign performance metrics" },
      ],
    },
    {
      id: "ad",
      name: "Ad",
      description: "Standardized schema for ads across platforms",
      version: "1.1.0",
      lastUpdated: "2023-10-14T11:45:00Z",
      fields: [
        { name: "id", type: "string", required: true, description: "Unique identifier for the ad" },
        { name: "campaignId", type: "string", required: true, description: "Associated campaign ID" },
        { name: "name", type: "string", required: true, description: "Ad name" },
        { name: "status", type: "enum", required: true, description: "Ad status (active, paused, rejected)" },
        { name: "type", type: "enum", required: true, description: "Ad type (image, video, carousel, etc.)" },
        { name: "headline", type: "string", required: false, description: "Ad headline" },
        { name: "description", type: "string", required: false, description: "Ad description" },
        { name: "imageUrl", type: "string", required: false, description: "URL to ad image" },
        { name: "videoUrl", type: "string", required: false, description: "URL to ad video" },
        { name: "destinationUrl", type: "string", required: true, description: "Ad destination URL" },
        { name: "metrics", type: "object", required: false, description: "Ad performance metrics" },
      ],
    },
    {
      id: "audience",
      name: "Audience",
      description: "Standardized schema for audience targeting across platforms",
      version: "1.0.5",
      lastUpdated: "2023-10-12T09:30:00Z",
      fields: [
        { name: "id", type: "string", required: true, description: "Unique identifier for the audience" },
        { name: "name", type: "string", required: true, description: "Audience name" },
        { name: "size", type: "number", required: false, description: "Estimated audience size" },
        { name: "demographics", type: "object", required: false, description: "Demographic targeting criteria" },
        { name: "interests", type: "array", required: false, description: "Interest targeting criteria" },
        { name: "behaviors", type: "array", required: false, description: "Behavior targeting criteria" },
        { name: "locations", type: "array", required: false, description: "Location targeting criteria" },
        { name: "customAudiences", type: "array", required: false, description: "Custom audience segments" },
        { name: "exclusions", type: "object", required: false, description: "Audience exclusion criteria" },
        { name: "platform", type: "string", required: true, description: "Advertising platform" },
      ],
    },
    {
      id: "creative",
      name: "Creative",
      description: "Standardized schema for creative assets across platforms",
      version: "1.0.2",
      lastUpdated: "2023-10-10T16:15:00Z",
      fields: [
        { name: "id", type: "string", required: true, description: "Unique identifier for the creative" },
        { name: "name", type: "string", required: true, description: "Creative name" },
        { name: "type", type: "enum", required: true, description: "Creative type (image, video, html, etc.)" },
        { name: "url", type: "string", required: true, description: "URL to the creative asset" },
        { name: "dimensions", type: "object", required: false, description: "Creative dimensions" },
        { name: "fileSize", type: "number", required: false, description: "File size in bytes" },
        { name: "duration", type: "number", required: false, description: "Duration in seconds (for video)" },
        { name: "tags", type: "array", required: false, description: "Tags associated with the creative" },
        { name: "createdAt", type: "date", required: true, description: "Creation date" },
        { name: "updatedAt", type: "date", required: true, description: "Last update date" },
      ],
    },
  ])

  // Sample data mappings
  const [mappings, setMappings] = useState([
    {
      id: "google-campaign",
      name: "Google Ads Campaign Mapping",
      sourceSystem: "Google Ads",
      targetSchema: "Campaign",
      lastUpdated: "2023-10-16T10:30:00Z",
      status: "active",
      mappings: [
        { source: "campaign_id", target: "id", transformation: null },
        { source: "campaign_name", target: "name", transformation: null },
        { source: "campaign_status", target: "status", transformation: "statusTransform" },
        { source: "start_date", target: "startDate", transformation: "dateTransform" },
        { source: "end_date", target: "endDate", transformation: "dateTransform" },
        { source: "budget.amount_micros", target: "budget", transformation: "microsToDollars" },
        { source: "campaign_objective", target: "objective", transformation: "objectiveTransform" },
        { source: "targeting_criteria", target: "targetAudience", transformation: "targetingTransform" },
        { source: "advertising_channel_type", target: "platform", transformation: null },
      ],
    },
    {
      id: "meta-campaign",
      name: "Meta Ads Campaign Mapping",
      sourceSystem: "Meta Ads",
      targetSchema: "Campaign",
      lastUpdated: "2023-10-15T14:45:00Z",
      status: "active",
      mappings: [
        { source: "id", target: "id", transformation: null },
        { source: "name", target: "name", transformation: null },
        { source: "status", target: "status", transformation: "fbStatusTransform" },
        { source: "start_time", target: "startDate", transformation: "isoDateTransform" },
        { source: "stop_time", target: "endDate", transformation: "isoDateTransform" },
        { source: "daily_budget", target: "budget", transformation: null },
        { source: "objective", target: "objective", transformation: "fbObjectiveTransform" },
        { source: "targeting", target: "targetAudience", transformation: "fbTargetingTransform" },
        { source: "platform", target: "platform", transformation: "constantValue('Facebook')" },
      ],
    },
    {
      id: "linkedin-campaign",
      name: "LinkedIn Campaign Mapping",
      sourceSystem: "LinkedIn Ads",
      targetSchema: "Campaign",
      lastUpdated: "2023-10-14T09:15:00Z",
      status: "inactive",
      mappings: [
        { source: "id", target: "id", transformation: null },
        { source: "name", target: "name", transformation: null },
        { source: "status", target: "status", transformation: "linkedinStatusTransform" },
        { source: "startDate", target: "startDate", transformation: "linkedinDateTransform" },
        { source: "endDate", target: "endDate", transformation: "linkedinDateTransform" },
        { source: "dailyBudget.amount", target: "budget", transformation: null },
        { source: "objective", target: "objective", transformation: "linkedinObjectiveTransform" },
        { source: "targeting", target: "targetAudience", transformation: "linkedinTargetingTransform" },
        { source: "platform", target: "platform", transformation: "constantValue('LinkedIn')" },
      ],
    },
  ])

  const [selectedSchema, setSelectedSchema] = useState<any>(null)
  const [selectedMapping, setSelectedMapping] = useState<any>(null)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Data Mapping</h2>
        <p className="text-muted-foreground">
          Create standardized data schemas and mappings for cross-platform compatibility.
        </p>
      </div>

      <Tabs defaultValue="schemas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schemas">Data Schemas</TabsTrigger>
          <TabsTrigger value="mappings">Data Mappings</TabsTrigger>
        </TabsList>

        <TabsContent value="schemas" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Standardized Data Schemas</h3>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Schema
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemas.map((schema) => (
              <Card key={schema.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{schema.name}</CardTitle>
                    <Badge>v{schema.version}</Badge>
                  </div>
                  <CardDescription>{schema.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-2">
                    Last updated: {new Date(schema.lastUpdated).toLocaleDateString()}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">{schema.fields.length}</span> fields defined
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        View Schema
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px]">
                      <DialogHeader>
                        <DialogTitle>
                          {schema.name} Schema <Badge className="ml-2">v{schema.version}</Badge>
                        </DialogTitle>
                        <DialogDescription>{schema.description}</DialogDescription>
                      </DialogHeader>

                      <div className="mt-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Field</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Required</TableHead>
                              <TableHead>Description</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {schema.fields.map((field, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{field.name}</TableCell>
                                <TableCell>{field.type}</TableCell>
                                <TableCell>{field.required ? "Yes" : "No"}</TableCell>
                                <TableCell>{field.description}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      <DialogFooter className="flex justify-between items-center mt-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Export
                          </Button>
                          <Button variant="outline" size="sm">
                            <Code className="h-4 w-4 mr-1" />
                            JSON Schema
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

                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mappings" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Data Mappings</h3>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Mapping
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mappings.map((mapping) => (
              <Card key={mapping.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{mapping.name}</CardTitle>
                    <Badge
                      className={
                        mapping.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }
                    >
                      {mapping.status.charAt(0).toUpperCase() + mapping.status.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription>
                    Maps {mapping.sourceSystem} data to {mapping.targetSchema} schema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-2">
                    Last updated: {new Date(mapping.lastUpdated).toLocaleDateString()}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">{mapping.mappings.length}</span> field mappings defined
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        View Mapping
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px]">
                      <DialogHeader>
                        <DialogTitle>{mapping.name}</DialogTitle>
                        <DialogDescription>
                          Maps {mapping.sourceSystem} data to {mapping.targetSchema} schema
                        </DialogDescription>
                      </DialogHeader>

                      <div className="mt-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Source Field</TableHead>
                              <TableHead></TableHead>
                              <TableHead>Target Field</TableHead>
                              <TableHead>Transformation</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {mapping.mappings.map((field, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{field.source}</TableCell>
                                <TableCell>
                                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                </TableCell>
                                <TableCell>{field.target}</TableCell>
                                <TableCell>
                                  {field.transformation ? (
                                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                      {field.transformation}
                                    </Badge>
                                  ) : (
                                    <span className="text-muted-foreground">None</span>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      <DialogFooter className="flex justify-between items-center mt-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <FileJson className="h-4 w-4 mr-1" />
                            Test Mapping
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
                      className={mapping.status === "active" ? "text-amber-600" : "text-green-600"}
                    >
                      {mapping.status === "active" ? "Disable" : "Enable"}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
