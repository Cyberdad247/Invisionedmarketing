"use client"

import type React from "react"
import { useState } from "react"
import { CrewAgentForm } from "../components/CrewAgentForm"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

export function CrewAgentPage() {
  const [agent, setAgent] = useState(null)
  const [activeTab, setActiveTab] = useState("configure")
  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleAgentSubmit = async (agentData: any) => {
    try {
      // In a real implementation, this would send the data to the backend
      console.log("Creating agent:", agentData)

      // Simulate API call
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setAgent(agentData)
      setActiveTab("test")
      setIsLoading(false)
    } catch (error) {
      console.error("Error creating agent:", error)
      setIsLoading(false)
    }
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!chatInput.trim() || !agent) return

    const userMessage = { role: "user", content: chatInput }
    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")

    try {
      setIsLoading(true)

      // In a real implementation, this would send the message to the backend
      console.log("Sending message to agent:", chatInput)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate agent response
      const agentResponse = {
        role: "assistant",
        content: `[${agent.name} - ${agent.role}] I'm processing your request: "${chatInput}"\n\nBased on my goal to ${agent.goal}, here's my response: This is a simulated response from the CrewAI agent. In a real implementation, this would be the actual response from the agent.`,
      }

      setChatMessages((prev) => [...prev, agentResponse])
      setIsLoading(false)
    } catch (error) {
      console.error("Error sending message:", error)
      setIsLoading(false)

      // Add error message
      setChatMessages((prev) => [...prev, { role: "system", content: "Error: Failed to get response from agent." }])
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">CrewAI Agent</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="configure">Configure</TabsTrigger>
          <TabsTrigger value="test" disabled={!agent}>
            Test
          </TabsTrigger>
        </TabsList>

        <TabsContent value="configure" className="pt-4">
          <CrewAgentForm onSubmit={handleAgentSubmit} initialData={agent} />
        </TabsContent>

        <TabsContent value="test" className="pt-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Test Agent: {agent?.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-md p-4 h-[400px] overflow-y-auto bg-gray-50">
                {chatMessages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>Send a message to start chatting with the agent</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chatMessages.map((message, index) => (
                      <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.role === "user"
                              ? "bg-blue-500 text-white"
                              : message.role === "system"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-200 text-gray-800"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] p-3 rounded-lg bg-gray-200">
                          <div className="flex space-x-2">
                            <div
                              className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            ></div>
                            <div
                              className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            ></div>
                            <div
                              className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <form onSubmit={handleChatSubmit} className="flex space-x-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading || !chatInput.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
