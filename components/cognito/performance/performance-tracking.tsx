"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Download, Filter, RefreshCw, Bot, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function PerformanceTracking() {
  const [timeRange, setTimeRange] = useState("30d")
  const [agentFilter, setAgentFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  // Sample performance data
  const performanceData = [
    { date: "2023-09-01", successRate: 78, interventionRate: 22, taskCount: 45 },
    { date: "2023-09-08", successRate: 82, interventionRate: 18, taskCount: 52 },
    { date: "2023-09-15", successRate: 85, interventionRate: 15, taskCount: 63 },
    { date: "2023-09-22", successRate: 88, interventionRate: 12, taskCount: 58 },
    { date: "2023-09-29", successRate: 86, interventionRate: 14, taskCount: 67 },
    { date: "2023-10-06", successRate: 90, interventionRate: 10, taskCount: 72 },
    { date: "2023-10-13", successRate: 91, interventionRate: 9, taskCount: 81 },
  ]

  // Sample agent performance data
  const agentPerformanceData = [
    { name: "Strategos", successRate: 92, interventionRate: 8, taskCount: 124, avgResponseTime: 1.2 },
    { name: "Lexica", successRate: 88, interventionRate: 12, taskCount: 256, avgResponseTime: 0.8 },
    { name: "Visio", successRate: 76, interventionRate: 24, taskCount: 189, avgResponseTime: 2.1 },
    { name: "Optimus", successRate: 94, interventionRate: 6, taskCount: 145, avgResponseTime: 0.9 },
    { name: "Connecta", successRate: 85, interventionRate: 15, taskCount: 312, avgResponseTime: 1.5 },
    { name: "Crawler", successRate: 96, interventionRate: 4, taskCount: 178, avgResponseTime: 1.1 },
    { name: "Fixer", successRate: 82, interventionRate: 18, taskCount: 134, avgResponseTime: 1.8 },
  ]

  // Sample intervention reasons data
  const interventionReasonsData = [
    { name: "Content Quality", value: 42 },
    { name: "Brand Alignment", value: 28 },
    { name: "Factual Accuracy", value: 15 },
    { name: "Compliance Issues", value: 10 },
    { name: "Other", value: 5 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

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
          <h2 className="text-xl font-bold">Performance Tracking</h2>
          <p className="text-muted-foreground">Monitor agent success rates and intervention frequency</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Success Rate</CardTitle>
            <CardDescription>Average across all agents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-green-600">87%</div>
              <Badge className="bg-green-500/15 text-green-600">+3.2%</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Intervention Rate</CardTitle>
            <CardDescription>Human intervention required</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-amber-600">13%</div>
              <Badge className="bg-green-500/15 text-green-600">-3.2%</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total Tasks</CardTitle>
            <CardDescription>Tasks processed in period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">1,438</div>
              <Badge className="bg-green-500/15 text-green-600">+12.5%</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agents">Agent Performance</TabsTrigger>
          <TabsTrigger value="interventions">Intervention Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Success and intervention rates over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="successRate"
                      name="Success Rate (%)"
                      stroke="#10b981"
                      activeDot={{ r: 8 }}
                    />
                    <Line type="monotone" dataKey="interventionRate" name="Intervention Rate (%)" stroke="#f59e0b" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Agent Performance Comparison</CardTitle>
                <CardDescription>Success rates and intervention frequency by agent</CardDescription>
              </div>
              <Select value={agentFilter} onValueChange={setAgentFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by agent type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Agents</SelectItem>
                  <SelectItem value="content">Content Creation</SelectItem>
                  <SelectItem value="analytics">Analytics</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={agentPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="successRate" name="Success Rate (%)" fill="#10b981" />
                    <Bar dataKey="interventionRate" name="Intervention Rate (%)" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Agent</th>
                      <th className="text-center py-2 px-4">Success Rate</th>
                      <th className="text-center py-2 px-4">Intervention Rate</th>
                      <th className="text-center py-2 px-4">Tasks</th>
                      <th className="text-center py-2 px-4">Avg Response Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agentPerformanceData.map((agent, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 px-4 flex items-center gap-2">
                          <Bot className="h-4 w-4" />
                          {agent.name}
                        </td>
                        <td className="text-center py-2 px-4">
                          <span
                            className={`font-medium ${agent.successRate > 85 ? "text-green-600" : agent.successRate > 75 ? "text-amber-600" : "text-red-600"}`}
                          >
                            {agent.successRate}%
                          </span>
                        </td>
                        <td className="text-center py-2 px-4">
                          <span
                            className={`font-medium ${agent.interventionRate < 10 ? "text-green-600" : agent.interventionRate < 20 ? "text-amber-600" : "text-red-600"}`}
                          >
                            {agent.interventionRate}%
                          </span>
                        </td>
                        <td className="text-center py-2 px-4">{agent.taskCount}</td>
                        <td className="text-center py-2 px-4">{agent.avgResponseTime}s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="interventions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Intervention Reasons</CardTitle>
                <CardDescription>Why human intervention was required</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={interventionReasonsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {interventionReasonsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Interventions</CardTitle>
                <CardDescription>Latest human interventions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <div>
                          <p className="text-sm font-medium">Content Quality Issue</p>
                          <p className="text-xs text-muted-foreground">Lexica Agent - Blog Post</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">2 hours ago</span>
                    </div>
                    <p className="text-xs mt-2">
                      Human editor improved clarity and fixed grammatical errors in the introduction paragraph.
                    </p>
                  </div>

                  <div className="border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <div>
                          <p className="text-sm font-medium">Brand Alignment Rejection</p>
                          <p className="text-xs text-muted-foreground">Visio Agent - Social Media Image</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">5 hours ago</span>
                    </div>
                    <p className="text-xs mt-2">
                      Image rejected due to incorrect brand colors and logo placement. Human designer provided
                      corrections.
                    </p>
                  </div>

                  <div className="border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <div>
                          <p className="text-sm font-medium">Minor Edit & Approval</p>
                          <p className="text-xs text-muted-foreground">Connecta Agent - Social Post</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">Yesterday</span>
                    </div>
                    <p className="text-xs mt-2">
                      Small edits to hashtags and posting time, then approved for publication.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Interventions
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
