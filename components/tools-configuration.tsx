"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Trash2, Database, Globe, Calculator, FileText, MessageSquare } from "lucide-react"
import { uploadFile } from "@/lib/blob"

type Tool = {
  id: string
  name: string
  type: string
  description: string
  icon: React.ElementType
  enabled: boolean
  config?: Record<string, string>
}

interface ToolsConfigurationProps {
  value: Tool[]
  onChange: (value: Tool[]) => void
}

export default function ToolsConfiguration({ value, onChange }: ToolsConfigurationProps) {
  const [tools, setTools] = useState<Tool[]>(
    value.length > 0
      ? value
      : [
          {
            id: "web-search",
            name: "Web Search",
            type: "builtin",
            description: "Search the web for up-to-date information",
            icon: Globe,
            enabled: true,
          },
          {
            id: "calculator",
            name: "Calculator",
            type: "builtin",
            description: "Perform mathematical calculations",
            icon: Calculator,
            enabled: false,
          },
          {
            id: "database",
            name: "Database",
            type: "integration",
            description: "Query your database for information",
            icon: Database,
            enabled: false,
            config: {
              connectionString: "",
            },
          },
          {
            id: "document-retrieval",
            name: "Document Retrieval",
            type: "integration",
            description: "Retrieve information from your documents",
            icon: FileText,
            enabled: false,
            config: {
              vectorStoreUrl: "",
            },
          },
          {
            id: "chat-history",
            name: "Chat History",
            type: "integration",
            description: "Access previous conversations with users",
            icon: MessageSquare,
            enabled: false,
          },
        ],
  )

  const [customTools, setCustomTools] = useState<Tool[]>([])
  const [newToolName, setNewToolName] = useState("")
  const [newToolDescription, setNewToolDescription] = useState("")
  const [newToolApiUrl, setNewToolApiUrl] = useState("")
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    onChange([...tools, ...customTools])
  }, [tools, customTools, onChange])

  const toggleTool = (id: string) => {
    setTools(tools.map((tool) => (tool.id === id ? { ...tool, enabled: !tool.enabled } : tool)))
  }

  const toggleCustomTool = (id: string) => {
    setCustomTools(customTools.map((tool) => (tool.id === id ? { ...tool, enabled: !tool.enabled } : tool)))
  }

  const updateToolConfig = (id: string, key: string, value: string) => {
    setTools(
      tools.map((tool) =>
        tool.id === id
          ? {
              ...tool,
              config: { ...(tool.config || {}), [key]: value },
            }
          : tool,
      ),
    )
  }

  const addCustomTool = () => {
    if (newToolName.trim() === "") return

    const newTool: Tool = {
      id: `custom-${Date.now()}`,
      name: newToolName,
      type: "custom",
      description: newToolDescription,
      icon: Globe,
      enabled: true,
      config: {
        apiUrl: newToolApiUrl,
      },
    }

    setCustomTools([...customTools, newTool])
    setNewToolName("")
    setNewToolDescription("")
    setNewToolApiUrl("")
  }

  const removeCustomTool = (id: string) => {
    setCustomTools(customTools.filter((tool) => tool.id !== id))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, toolId: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    setDocumentFile(file)
    setIsUploading(true)

    try {
      // Upload the file to the blob store
      const result = await uploadFile(file, toolId)

      // Update the tool config with the file URL
      updateToolConfig(toolId, "documentUrl", result.url)

      // Show success message
      alert("File uploaded successfully!")
    } catch (error) {
      console.error("Error uploading file:", error)
      alert("Failed to upload file. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Agent Tools</h3>
        <p className="text-sm text-muted-foreground">Enable tools to give your agent additional capabilities.</p>
      </div>

      <Tabs defaultValue="available">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="available">Available Tools</TabsTrigger>
          <TabsTrigger value="custom">Custom Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {tools.map((tool) => (
              <Card key={tool.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <tool.icon className="h-5 w-5 text-muted-foreground" />
                      <CardTitle className="text-base">{tool.name}</CardTitle>
                    </div>
                    <Checkbox
                      checked={tool.enabled}
                      onCheckedChange={() => toggleTool(tool.id)}
                      id={`enable-${tool.id}`}
                    />
                  </div>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                {tool.enabled && tool.config && (
                  <CardContent>
                    {Object.entries(tool.config).map(([key, value]) => (
                      <div key={key} className="mt-2">
                        <Label htmlFor={`${tool.id}-${key}`} className="text-xs capitalize">
                          {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                        </Label>

                        {key === "documentUrl" ? (
                          <div className="mt-1">
                            <Input
                              id={`${tool.id}-file-upload`}
                              type="file"
                              onChange={(e) => handleFileUpload(e, tool.id)}
                              className="mt-1"
                            />
                            {isUploading && <p className="text-xs text-muted-foreground mt-1">Uploading...</p>}
                            {value && (
                              <p className="text-xs text-muted-foreground mt-1 truncate">
                                Current file: {value.split("/").pop()}
                              </p>
                            )}
                          </div>
                        ) : (
                          <Input
                            id={`${tool.id}-${key}`}
                            value={value}
                            onChange={(e) => updateToolConfig(tool.id, key, e.target.value)}
                            placeholder={`Enter ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                            className="mt-1"
                          />
                        )}
                      </div>
                    ))}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Add Custom Tool</CardTitle>
              <CardDescription>Create a custom tool by providing an API endpoint.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="tool-name">Tool Name</Label>
                <Input
                  id="tool-name"
                  value={newToolName}
                  onChange={(e) => setNewToolName(e.target.value)}
                  placeholder="E.g., Weather API"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="tool-description">Description</Label>
                <Input
                  id="tool-description"
                  value={newToolDescription}
                  onChange={(e) => setNewToolDescription(e.target.value)}
                  placeholder="What this tool does"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="tool-api-url">API URL</Label>
                <Input
                  id="tool-api-url"
                  value={newToolApiUrl}
                  onChange={(e) => setNewToolApiUrl(e.target.value)}
                  placeholder="https://api.example.com/endpoint"
                  className="mt-1"
                />
              </div>
              <Button onClick={addCustomTool} disabled={!newToolName.trim()} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Tool
              </Button>
            </CardContent>
          </Card>

          {customTools.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {customTools.map((tool) => (
                <Card key={tool.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <tool.icon className="h-5 w-5 text-muted-foreground" />
                        <CardTitle className="text-base">{tool.name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={tool.enabled}
                          onCheckedChange={() => toggleCustomTool(tool.id)}
                          id={`enable-${tool.id}`}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCustomTool(tool.id)}
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  {tool.enabled && tool.config && (
                    <CardContent>
                      {Object.entries(tool.config).map(([key, value]) => (
                        <div key={key} className="mt-2">
                          <Label htmlFor={`${tool.id}-${key}`} className="text-xs capitalize">
                            {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                          </Label>
                          <Input
                            id={`${tool.id}-${key}`}
                            value={value}
                            onChange={(e) => {
                              const updatedTools = customTools.map((t) =>
                                t.id === tool.id
                                  ? {
                                      ...t,
                                      config: { ...(t.config || {}), [key]: e.target.value },
                                    }
                                  : t,
                              )
                              setCustomTools(updatedTools)
                            }}
                            placeholder={`Enter ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                            className="mt-1"
                          />
                        </div>
                      ))}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
