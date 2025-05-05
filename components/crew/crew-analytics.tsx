"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function CrewAnalytics() {
  const [loading, setLoading] = useState(true)
  const [executionData, setExecutionData] = useState<any[]>([])
  const [modelUsageData, setModelUsageData] = useState<any[]>([])
  const [agentUsageData, setAgentUsageData] = useState<any[]>([])

  useEffect(() => {
    // Fetch analytics data
    const fetchData = async () => {
      try {
        setLoading(true)
        // In a real implementation, this would be API calls
        // const executionResponse = await fetch('/api/analytics/executions')
        // const executionData = await executionResponse.json()

        // Simulated data for demonstration
        const executionData = [
          { name: "Mon", executions: 12, successful: 10, failed: 2 },
          { name: "Tue", executions: 19, successful: 17, failed: 2 },
          { name: "Wed", executions: 15, successful: 13, failed: 2 },
          { name: "Thu", executions: 22, successful: 20, failed: 2 },
          { name: "Fri", executions: 28, successful: 25, failed: 3 },
          { name: "Sat", executions: 14, successful: 12, failed: 2 },
          { name: "Sun", executions: 8, successful: 7, failed: 1 },
        ]

        const modelUsageData = [
          { name: "gpt-4o", value: 45 },
          { name: "gpt-4-turbo", value: 25 },
          { name: "gpt-3.5-turbo", value: 20 },
          { name: "claude-3-opus", value: 10 },
        ]

        const agentUsageData = [
          { name: "Research Assistant", executions: 35 },
          { name: "Content Writer", executions: 28 },
          { name: "Data Analyst", executions: 22 },
          { name: "Editor", executions: 15 },
          { name: "Customer Support", executions: 10 },
        ]

        setExecutionData(executionData)
        setModelUsageData(modelUsageData)
        setAgentUsageData(agentUsageData)
      } catch (error) {
        console.error("Error fetching analytics data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[250px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[250px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Execution Metrics</CardTitle>
          <CardDescription>Number of agent and workflow executions over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={executionData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="successful" stackId="a" fill="#10b981" name="Successful" />
                <Bar dataKey="failed" stackId="a" fill="#ef4444" name="Failed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Model Usage</CardTitle>
            <CardDescription>Distribution of LLM models used in agent executions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={modelUsageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {modelUsageData.map((entry, index) => (
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
            <CardTitle>Agent Usage</CardTitle>
            <CardDescription>Most frequently executed agents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={agentUsageData}
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="executions" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
