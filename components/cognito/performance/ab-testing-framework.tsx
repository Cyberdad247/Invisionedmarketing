"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Play,
  Pause,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Bot,
  User,
  RefreshCw,
  Calendar,
  Clock,
  Zap,
  ChevronRight,
  Lightbulb,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export default function ABTestingFramework() {
  const [isLoading, setIsLoading] = useState(false)

  // Sample active tests data
  const activeTests = [
    {
      id: 1,
      name: "Blog Post Format Comparison",
      description: "Testing listicle vs. long-form blog post formats",
      status: "running",
      startDate: "2023-10-01T00:00:00Z",
      endDate: "2023-10-31T23:59:59Z",
      progress: 65,
      variants: [
        { name: "A: AI-Generated (Autonomous)", traffic: 33, conversionRate: 4.2, improvement: null },
        { name: "B: AI with Human Review", traffic: 33, conversionRate: 5.8, improvement: 38 },
        { name: "C: Human-Created", traffic: 34, conversionRate: 5.2, improvement: 24 },
      ],
    },
    {
      id: 2,
      name: "Ad Copy Optimization",
      description: "Testing different value propositions in ad headlines",
      status: "running",
      startDate: "2023-10-05T00:00:00Z",
      endDate: "2023-10-25T23:59:59Z",
      progress: 45,
      variants: [
        { name: "A: AI-Generated (Autonomous)", traffic: 50, conversionRate: 2.1, improvement: null },
        { name: "B: AI with Human Review", traffic: 50, conversionRate: 2.8, improvement: 33 },
      ],
    },
    {
      id: 3,
      name: "Social Media Image Style",
      description: "Testing illustrated vs. photo-based social media images",
      status: "paused",
      startDate: "2023-09-15T00:00:00Z",
      endDate: "2023-10-15T23:59:59Z",
      progress: 80,
      variants: [
        { name: "A: AI-Generated (Autonomous)", traffic: 50, conversionRate: 3.4, improvement: null },
        { name: "B: AI with Human Review", traffic: 50, conversionRate: 3.9, improvement: 15 },
      ],
    },
  ]

  // Sample completed tests data
  const completedTests = [
    {
      id: 4,
      name: "Email Subject Line Test",
      description: "Testing question vs. statement subject lines",
      status: "completed",
      startDate: "2023-08-01T00:00:00Z",
      endDate: "2023-08-31T23:59:59Z",
      winner: "B: AI with Human Review",
      improvement: 42,
      variants: [
        { name: "A: AI-Generated (Autonomous)", traffic: 50, conversionRate: 3.8, improvement: null },
        { name: "B: AI with Human Review", traffic: 50, conversionRate: 5.4, improvement: 42 },
      ],
    },
    {
      id: 5,
      name: "Landing Page Layout",
      description: "Testing different landing page layouts for lead generation",
      status: "completed",
      startDate: "2023-07-15T00:00:00Z",
      endDate: "2023-08-15T23:59:59Z",
      winner: "C: Human-Created",
      improvement: 28,
      variants: [
        { name: "A: AI-Generated (Autonomous)", traffic: 33, conversionRate: 5.2, improvement: null },
        { name: "B: AI with Human Review", traffic: 33, conversionRate: 6.1, improvement: 17 },
        { name: "C: Human-Created", traffic: 34, conversionRate: 6.7, improvement: 28 },
      ],
    },
  ]

  // Sample test results data for detailed view
  const testResultsData = [
    { day: "1", variantA: 3.2, variantB: 3.4, variantC: 3.3 },
    { day: "5", variantA: 3.5, variantB: 4.1, variantC: 3.7 },
    { day: "10", variantA: 3.8, variantB: 4.8, variantC: 4.2 },
    { day: "15", variantA: 4.0, variantB: 5.2, variantC: 4.6 },
    { day: "20", variantA: 4.2, variantB: 5.6, variantC: 5.0 },
    { day: "25", variantA: 4.3, variantB: 5.8, variantC: 5.2 },
    { day: "30", variantA: 4.2, variantB: 5.8, variantC: 5.2 },
  ]

  // Sample audience engagement data
  const audienceEngagementData = [
    { name: "Variant A", value: 35 },
    { name: "Variant B", value: 45 },
    { name: "Variant C", value: 20 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  const refreshData = () => {
    setIsLoading(true)
    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "running":
        return <Badge className="bg-green-500/15 text-green-600">Running</Badge>
      case "paused":
        return <Badge className="bg-amber-500/15 text-amber-600">Paused</Badge>
      case "completed":
        return <Badge className="bg-blue-500/15 text-blue-600">Completed</Badge>
      case "draft":
        return <Badge className="bg-gray-500/15 text-gray-600">Draft</Badge>
      default:
        return <Badge className="bg-gray-500/15 text-gray-600">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">A/B Testing Framework</h2>
          <p className="text-muted-foreground">Compare autonomous vs. human-guided campaign results</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Button>Create New Test</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Active Tests</CardTitle>
            <CardDescription>Currently running experiments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeTests.filter((t) => t.status === "running").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Completed Tests</CardTitle>
            <CardDescription>Finished experiments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedTests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Average Improvement</CardTitle>
            <CardDescription>Human-guided vs. autonomous</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">+27%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Tests</TabsTrigger>
          <TabsTrigger value="completed">Completed Tests</TabsTrigger>
          <TabsTrigger value="create">Create Test</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="space-y-6">
            {activeTests.map((test) => (
              <Card key={test.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{test.name}</CardTitle>
                      <CardDescription>{test.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(test.status)}
                      {test.status === "running" ? (
                        <Button variant="outline" size="icon">
                          <Pause className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button variant="outline" size="icon">
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {new Date(test.startDate).toLocaleDateString()} -{" "}
                          {new Date(test.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Progress: {test.progress}%</span>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: `${test.progress}%` }}></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      {test.variants.map((variant, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            {variant.name.includes("AI-Generated") ? (
                              <Bot className="h-4 w-4 text-blue-500" />
                            ) : variant.name.includes("Human") ? (
                              <User className="h-4 w-4 text-purple-500" />
                            ) : (
                              <Bot className="h-4 w-4 text-green-500" />
                            )}
                            <h4 className="text-sm font-medium">{variant.name}</h4>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <div className="text-xs text-muted-foreground">Traffic</div>
                              <div>{variant.traffic}%</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Conversion</div>
                              <div>{variant.conversionRate}%</div>
                            </div>
                          </div>
                          {variant.improvement && (
                            <div className="mt-2">
                              <Badge className="bg-green-500/15 text-green-600">+{variant.improvement}%</Badge>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    View Detailed Results
                  </Button>
                  <Button size="sm">End Test Early</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="space-y-6">
            {completedTests.map((test) => (
              <Card key={test.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{test.name}</CardTitle>
                      <CardDescription>{test.description}</CardDescription>
                    </div>
                    {getStatusBadge(test.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {new Date(test.startDate).toLocaleDateString()} -{" "}
                          {new Date(test.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>Winner: {test.winner}</span>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-amber-500" />
                          <span className="text-sm font-medium">Improvement over autonomous AI</span>
                        </div>
                        <Badge className="bg-green-500/15 text-green-600">+{test.improvement}%</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      {test.variants.map((variant, index) => (
                        <div
                          key={index}
                          className={`border rounded-lg p-3 ${variant.name === test.winner ? "border-green-500 bg-green-50" : ""}`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {variant.name.includes("AI-Generated") ? (
                              <Bot className="h-4 w-4 text-blue-500" />
                            ) : variant.name.includes("Human") ? (
                              <User className="h-4 w-4 text-purple-500" />
                            ) : (
                              <Bot className="h-4 w-4 text-green-500" />
                            )}
                            <h4 className="text-sm font-medium">
                              {variant.name}
                              {variant.name === test.winner && <span className="ml-2 text-green-600">(Winner)</span>}
                            </h4>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <div className="text-xs text-muted-foreground">Traffic</div>
                              <div>{variant.traffic}%</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Conversion</div>
                              <div>{variant.conversionRate}%</div>
                            </div>
                          </div>
                          {variant.improvement && (
                            <div className="mt-2">
                              <Badge className="bg-green-500/15 text-green-600">+{variant.improvement}%</Badge>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    View Detailed Results
                  </Button>
                  <Button size="sm">Create Similar Test</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New A/B Test</CardTitle>
              <CardDescription>Compare autonomous vs. human-guided campaign results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Test Name</label>
                  <Input placeholder="E.g., Summer Campaign Email Subject Lines" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea placeholder="Describe the purpose of this test..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Date</label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Date</label>
                    <Input type="date" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Test Type</label>
                  <select className="w-full border rounded-md p-2 text-sm">
                    <option value="content">Content Comparison</option>
                    <option value="design">Design Comparison</option>
                    <option value="strategy">Strategy Comparison</option>
                    <option value="workflow">Workflow Comparison</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Test Variants</label>
                    <Button variant="outline" size="sm">
                      Add Variant
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Bot className="h-4 w-4" />
                            Variant A: AI-Generated (Autonomous)
                          </CardTitle>
                          <Badge>Control</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Traffic Allocation</span>
                            <span className="text-sm font-medium">33%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Use autonomous AI output without human review</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Bot className="h-4 w-4" />
                          <User className="h-4 w-4" />
                          Variant B: AI with Human Review
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Traffic Allocation</span>
                            <span className="text-sm font-medium">33%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">AI output with human review and edits before publishing</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Variant C: Human-Created
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Traffic Allocation</span>
                            <span className="text-sm font-medium">34%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Completely human-created content without AI assistance</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Success Metrics</label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="metric-clicks" />
                      <label htmlFor="metric-clicks" className="text-sm">
                        Click-through Rate
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="metric-conversion" defaultChecked />
                      <label htmlFor="metric-conversion" className="text-sm">
                        Conversion Rate
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="metric-engagement" />
                      <label htmlFor="metric-engagement" className="text-sm">
                        Engagement Rate
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="metric-revenue" />
                      <label htmlFor="metric-revenue" className="text-sm">
                        Revenue per User
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Save as Draft</Button>
              <Button>Start Test</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Test Spotlight: Blog Post Format Comparison</CardTitle>
          <CardDescription>Detailed results for the current top-performing test</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={testResultsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" label={{ value: "Day", position: "insideBottomRight", offset: -10 }} />
                  <YAxis label={{ value: "Conversion Rate (%)", angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="variantA"
                    name="Variant A: AI-Generated"
                    stroke="#0088FE"
                    activeDot={{ r: 8 }}
                  />
                  <Line type="monotone" dataKey="variantB" name="Variant B: AI with Human Review" stroke="#00C49F" />
                  <Line type="monotone" dataKey="variantC" name="Variant C: Human-Created" stroke="#FFBB28" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-base font-medium mb-3">Key Insights</h3>
                <div className="space-y-3">
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <p className="text-sm font-medium">Human Review Improves Performance</p>
                    </div>
                    <p className="text-xs mt-2">
                      Variant B (AI with Human Review) consistently outperforms both fully autonomous AI and human-only
                      content, with a 38% improvement over the control.
                    </p>
                  </div>

                  <div className="border rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <p className="text-sm font-medium">Diminishing Returns After Day 20</p>
                    </div>
                    <p className="text-xs mt-2">
                      Performance metrics stabilize after day 20, suggesting the test could be concluded earlier in
                      future iterations.
                    </p>
                  </div>

                  <div className="border rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-blue-500" />
                      <p className="text-sm font-medium">Audience Segment Analysis</p>
                    </div>
                    <p className="text-xs mt-2">
                      New visitors respond better to Variant B, while returning visitors show similar engagement with
                      Variants B and C.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-medium mb-3">Audience Engagement</h3>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={audienceEngagementData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {audienceEngagementData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <h3 className="text-base font-medium mb-2">Recommended Actions</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 mt-0.5 text-blue-500" />
                  <span className="text-sm">
                    Implement human review workflow for all blog content based on Variant B's superior performance
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 mt-0.5 text-blue-500" />
                  <span className="text-sm">
                    Update AI training with patterns identified from human edits to improve autonomous performance
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 mt-0.5 text-blue-500" />
                  <span className="text-sm">
                    Create a hybrid workflow that uses AI for initial drafts with targeted human review for specific
                    content sections
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Apply Recommendations</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
