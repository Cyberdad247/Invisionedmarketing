"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, Send, User, RefreshCw, Code, FileJson } from "lucide-react"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function AgentTestInterface({ agentId }: { agentId: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")

  const handleSend = () => {
    if (input.trim() === "") return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate agent response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getSimulatedResponse(input),
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const getSimulatedResponse = (userInput: string) => {
    const responses = [
      "I understand you're asking about " + userInput.substring(0, 20) + "... Let me help with that.",
      "Based on my knowledge, I can provide information about " + userInput.substring(0, 15) + ".",
      "That's an interesting question about " + userInput.substring(0, 10) + ". Here's what I know.",
      "I've analyzed your question about " + userInput.substring(0, 25) + " and here's my response.",
      "Let me search for information about " + userInput.substring(0, 20) + " for you.",
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }

  const resetConversation = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "Hello! I'm your AI assistant. How can I help you today?",
        timestamp: new Date(),
      },
    ])
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle>Chat Interface</CardTitle>
          <CardDescription>Test your agent by chatting with it directly.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[500px] flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="flex items-start gap-3 max-w-[80%]">
                    {message.role === "assistant" && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    {message.role === "user" && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-3 max-w-[80%]">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg px-4 py-2 bg-muted">
                      <div className="flex space-x-2">
                        <div className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-bounce"></div>
                        <div className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-bounce delay-75"></div>
                        <div className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-bounce delay-150"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend()
                }}
                className="flex items-center space-x-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={isLoading || input.trim() === ""}>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <Button variant="outline" onClick={resetConversation} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Reset Conversation
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Agent Details</CardTitle>
          <CardDescription>Information about the agent you're testing.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chat">
                <div className="flex items-center gap-1">
                  <Bot className="h-4 w-4" />
                  <span>Info</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="debug">
                <div className="flex items-center gap-1">
                  <Code className="h-4 w-4" />
                  <span>Debug</span>
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="pt-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium">Agent Name</h3>
                <p className="text-sm text-muted-foreground">Customer Support Agent</p>
              </div>

              <div>
                <h3 className="text-sm font-medium">Model</h3>
                <p className="text-sm text-muted-foreground">gpt-4o</p>
              </div>

              <div>
                <h3 className="text-sm font-medium">Active Tools</h3>
                <div className="mt-1 space-y-1">
                  <div className="text-xs bg-muted rounded-md px-2 py-1">Web Search</div>
                  <div className="text-xs bg-muted rounded-md px-2 py-1">Document Retrieval</div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium">System Prompt</h3>
                <p className="text-xs text-muted-foreground mt-1 bg-muted p-2 rounded-md">
                  You are a helpful customer support agent for our company. You have access to our product documentation
                  and can search the web for additional information. Always be polite and professional.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="debug" className="pt-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium">Request Logs</h3>
                <div className="mt-1 text-xs font-mono bg-muted p-2 rounded-md h-[200px] overflow-y-auto">
                  <p>[12:30:45] Request received: "Hello"</p>
                  <p>[12:30:46] Processing with model: gpt-4o</p>
                  <p>[12:30:47] Tokens: 5 input, 20 output</p>
                  <p>[12:30:48] Response generated in 1.2s</p>
                  <p>[12:31:20] Request received: "I need help with my order"</p>
                  <p>[12:31:21] Processing with model: gpt-4o</p>
                  <p>[12:31:22] Tool called: web-search</p>
                  <p>[12:31:24] Tokens: 12 input, 45 output</p>
                  <p>[12:31:25] Response generated in 2.5s</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium">Tool Calls</h3>
                <div className="mt-1">
                  <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                    <FileJson className="h-4 w-4" />
                    View JSON
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium">Performance</h3>
                <div className="mt-1 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Avg. Response Time</span>
                    <span>1.8s</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Avg. Tokens Used</span>
                    <span>32.5</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Tool Call Rate</span>
                    <span>25%</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
