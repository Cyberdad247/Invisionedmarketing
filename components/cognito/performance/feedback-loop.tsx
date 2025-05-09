"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Bot, Edit, CheckCircle, XCircle, ArrowUpRight, Lightbulb, BarChart3, RefreshCw, Search } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function FeedbackLoop() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [feedbackEnabled, setFeedbackEnabled] = useState(true)

  // Sample feedback data
  const feedbackData = [
    {
      id: 1,
      agentName: "Lexica",
      taskType: "Blog Post",
      originalContent: "Our product is the best in the market with many features.",
      editedContent: "Our product leads the market with innovative features that solve real customer problems.",
      feedbackCategory: "Content Quality",
      learningStatus: "applied",
      timestamp: "2023-10-15T14:30:00Z",
      improvementMetric: 28,
    },
    {
      id: 2,
      agentName: "Visio",
      taskType: "Social Media Image",
      originalContent: "Image with incorrect brand colors",
      editedContent: "Image with corrected brand colors and improved layout",
      feedbackCategory: "Brand Alignment",
      learningStatus: "applied",
      timestamp: "2023-10-14T11:15:00Z",
      improvementMetric: 42,
    },
    {
      id: 3,
      agentName: "Connecta",
      taskType: "Social Media Post",
      originalContent: "Check out our new product launch! #product #new",
      editedContent: "Excited to announce our revolutionary new product! #innovation #productlaunch #industrychange",
      feedbackCategory: "Engagement Optimization",
      learningStatus: "learning",
      timestamp: "2023-10-13T09:45:00Z",
      improvementMetric: 15,
    },
    {
      id: 4,
      agentName: "Strategos",
      taskType: "Campaign Strategy",
      originalContent: "Target all demographics with general messaging",
      editedContent: "Focus on millennials and Gen Z with personalized messaging highlighting sustainability",
      feedbackCategory: "Strategic Focus",
      learningStatus: "pending",
      timestamp: "2023-10-12T16:20:00Z",
      improvementMetric: 0,
    },
  ]

  // Sample learning progress data
  const learningProgressData = [
    { month: "Jan", contentQuality: 65, brandAlignment: 70, factualAccuracy: 80 },
    { month: "Feb", contentQuality: 68, brandAlignment: 72, factualAccuracy: 82 },
    { month: "Mar", contentQuality: 75, brandAlignment: 75, factualAccuracy: 85 },
    { month: "Apr", contentQuality: 80, brandAlignment: 78, factualAccuracy: 87 },
    { month: "May", contentQuality: 82, brandAlignment: 80, factualAccuracy: 88 },
    { month: "Jun", contentQuality: 85, brandAlignment: 83, factualAccuracy: 90 },
    { month: "Jul", contentQuality: 87, brandAlignment: 85, factualAccuracy: 91 },
  ]

  // Sample improvement metrics by agent
  const agentImprovementData = [
    { name: "Lexica", improvement: 32 },
    { name: "Visio", improvement: 28 },
    { name: "Connecta", improvement: 24 },
    { name: "Strategos", improvement: 18 },
    { name: "Optimus", improvement: 22 },
  ]

  const getLearningStatusBadge = (status) => {
    switch (status) {
      case "applied":
        return <Badge className="bg-green-500/15 text-green-600">Applied</Badge>
      case "learning":
        return <Badge className="bg-blue-500/15 text-blue-600">Learning</Badge>
      case "pending":
        return <Badge className="bg-amber-500/15 text-amber-600">Pending</Badge>
      default:
        return <Badge className="bg-gray-500/15 text-gray-600">Unknown</Badge>
    }
  }

  const refreshData = () => {
    setIsLoading(true)
    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Feedback Loop</h2>
          <p className="text-muted-foreground">Capture human edits to improve agent outputs over time</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch id="feedback-enabled" checked={feedbackEnabled} onCheckedChange={setFeedbackEnabled} />
            <label htmlFor="feedback-enabled" className="text-sm font-medium">
              Feedback Learning Enabled
            </label>
          </div>
          <Button variant="outline" size="icon" onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Feedback Collected</CardTitle>
            <CardDescription>Total human edits captured</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">1,248</div>
              <Badge className="bg-green-500/15 text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                18.5%
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Learning Applied</CardTitle>
            <CardDescription>Improvements from feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">876</div>
              <Badge className="bg-green-500/15 text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                12.3%
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Quality Improvement</CardTitle>
            <CardDescription>Overall output quality increase</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">24.8%</div>
              <Badge className="bg-green-500/15 text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                3.2%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="feedback" className="space-y-4">
        <TabsList>
          <TabsTrigger value="feedback">Recent Feedback</TabsTrigger>
          <TabsTrigger value="learning">Learning Progress</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Recent Human Edits</CardTitle>
                  <CardDescription>Feedback captured from human interventions</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search feedback..."
                    className="pl-8 w-full md:w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedbackData.map((feedback) => (
                  <Card key={feedback.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Bot className="h-4 w-4" />
                          <div>
                            <CardTitle className="text-base">
                              {feedback.agentName} - {feedback.taskType}
                            </CardTitle>
                            <CardDescription>{new Date(feedback.timestamp).toLocaleString()}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-purple-500/15 text-purple-600">
                            {feedback.feedbackCategory}
                          </Badge>
                          {getLearningStatusBadge(feedback.learningStatus)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                            <Bot className="h-3 w-3" />
                            <span>Original Output</span>
                          </div>
                          <div className="text-sm p-2 bg-muted rounded-md">{feedback.originalContent}</div>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                            <Edit className="h-3 w-3" />
                            <span>Human Edit</span>
                          </div>
                          <div className="text-sm p-2 bg-green-50 border border-green-100 rounded-m">
                            {feedback.editedContent}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Improvement:</span>
                        {feedback.improvementMetric > 0 ? (
                          <Badge className="bg-green-500/15 text-green-600">+{feedback.improvementMetric}%</Badge>
                        ) : (
                          <Badge className="bg-gray-500/15 text-gray-600">Pending</Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Apply Learning
                        </Button>
                        <Button variant="outline" size="sm">
                          <XCircle className="h-4 w-4 mr-1" />
                          Ignore
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Feedback
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="learning">
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress Over Time</CardTitle>
              <CardDescription>Improvement in agent performance based on feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={learningProgressData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="contentQuality"
                      name="Content Quality"
                      stroke="#10b981"
                      activeDot={{ r: 8 }}
                    />
                    <Line type="monotone" dataKey="brandAlignment" name="Brand Alignment" stroke="#8b5cf6" />
                    <Line type="monotone" dataKey="factualAccuracy" name="Factual Accuracy" stroke="#3b82f6" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Agent Improvement</CardTitle>
                <CardDescription>Quality improvement by agent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={agentImprovementData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="improvement" name="Improvement %" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Insights</CardTitle>
                <CardDescription>Key patterns identified from feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-500" />
                      <p className="text-sm font-medium">Content Structure Pattern</p>
                    </div>
                    <p className="text-xs mt-2">
                      Human editors consistently restructure blog posts to lead with key benefits rather than features.
                      This pattern has been applied to the Lexica agent.
                    </p>
                  </div>

                  <div className="border rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-500" />
                      <p className="text-sm font-medium">Brand Voice Consistency</p>
                    </div>
                    <p className="text-xs mt-2">
                      Feedback shows a preference for more conversational tone in social media content. Connecta agent
                      has adapted its language model accordingly.
                    </p>
                  </div>

                  <div className="border rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-500" />
                      <p className="text-sm font-medium">Visual Hierarchy Preference</p>
                    </div>
                    <p className="text-xs mt-2">
                      Human designers consistently adjust image layouts to emphasize certain elements. Visio agent has
                      incorporated these preferences.
                    </p>
                  </div>

                  <div className="border rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-blue-500" />
                      <p className="text-sm font-medium">Feedback Volume Analysis</p>
                    </div>
                    <p className="text-xs mt-2">
                      Content quality feedback has decreased by 32% over the past 3 months, indicating successful
                      learning and adaptation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Analysis</CardTitle>
              <CardDescription>Insights derived from human edits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-medium mb-2">Top Feedback Categories</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-medium">Content Quality</h4>
                        <Badge className="bg-blue-500/15 text-blue-600">42%</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Grammar, clarity, structure</p>
                    </div>
                    <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-medium">Brand Alignment</h4>
                        <Badge className="bg-purple-500/15 text-purple-600">28%</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Voice, tone, visual identity</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-medium">Factual Accuracy</h4>
                        <Badge className="bg-amber-500/15 text-amber-600">15%</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Data, claims, references</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-medium mb-2">Learning Recommendations</h3>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-amber-500" />
                        <p className="text-sm font-medium">Enhance Lexica's Content Structure</p>
                      </div>
                      <p className="text-xs mt-2">
                        Implement a new content template that prioritizes benefits over features based on consistent
                        human editor preferences.
                      </p>
                      <div className="flex justify-end mt-2">
                        <Button size="sm">Apply Recommendation</Button>
                      </div>
                    </div>

                    <div className="border rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-amber-500" />
                        <p className="text-sm font-medium">Update Visio's Brand Guidelines</p>
                      </div>
                      <p className="text-xs mt-2">
                        Refine the visual style guide with the latest brand color usage patterns identified from
                        designer edits.
                      </p>
                      <div className="flex justify-end mt-2">
                        <Button size="sm">Apply Recommendation</Button>
                      </div>
                    </div>

                    <div className="border rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-amber-500" />
                        <p className="text-sm font-medium">Improve Connecta's Hashtag Strategy</p>
                      </div>
                      <p className="text-xs mt-2">
                        Update hashtag selection algorithm based on patterns in human editor modifications to social
                        media posts.
                      </p>
                      <div className="flex justify-end mt-2">
                        <Button size="sm">Apply Recommendation</Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-medium mb-2">Custom Feedback Rule</h3>
                  <div className="border rounded-lg p-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Rule Name</label>
                        <Input placeholder="E.g., Brand Voice Enforcement" className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <Textarea placeholder="Describe what this feedback rule should enforce..." className="mt-1" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Apply to Agents</label>
                          <select className="w-full mt-1 border rounded-md p-2 text-sm">
                            <option value="all">All Agents</option>
                            <option value="lexica">Lexica</option>
                            <option value="visio">Visio</option>
                            <option value="connecta">Connecta</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Priority</label>
                          <select className="w-full mt-1 border rounded-md p-2 text-sm">
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button>Create Feedback Rule</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
