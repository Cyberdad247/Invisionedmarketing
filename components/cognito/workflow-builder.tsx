"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Save,
  Play,
  ArrowLeft,
  Plus,
  Bot,
  GitBranch,
  Clock,
  UserCheck,
  BarChart,
  HelpCircle,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  Trash2,
} from "lucide-react"
import { createWorkflow } from "@/app/actions/cognito-actions"
import { useRouter } from "next/navigation"
import type { CognitoAgent } from "@/types/cognito"
import type {
  WorkflowNode,
  WorkflowEdge,
  NodeType,
  Position,
  AgentNode,
  ConditionNode,
  TriggerNode,
  HITLNode,
  MetricNode,
} from "@/types/workflow"

type EdgeType = "default" | "success" | "failure" | "condition" | "approval" | "rejection"

interface WorkflowBuilderProps {
  agents: CognitoAgent[]
}

export default function WorkflowBuilder({ agents }: WorkflowBuilderProps) {
  const router = useRouter()
  const [workflowName, setWorkflowName] = useState("")
  const [workflowDescription, setWorkflowDescription] = useState("")
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    {
      id: "start",
      type: "start",
      position: { x: 250, y: 50 },
      data: { workflowName: "New Workflow" },
    },
    {
      id: "end",
      type: "end",
      position: { x: 250, y: 500 },
      data: { message: "Workflow completed" },
    },
  ])
  const [edges, setEdges] = useState<WorkflowEdge[]>([])
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<WorkflowEdge | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [draggedNode, setDraggedNode] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 })
  const [isCreatingEdge, setIsCreatingEdge] = useState(false)
  const [edgeStart, setEdgeStart] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState<Position>({ x: 0, y: 0 })
  const [canvasSize, setCanvasSize] = useState({ width: 2000, height: 1000 })

  // Node templates for each type
  const nodeTemplates: Record<NodeType, (position: Position) => WorkflowNode> = {
    agent: (position) => ({
      id: `agent-${Date.now()}`,
      type: "agent",
      position,
      data: { agentId: 0, agentName: "Select Agent", role: "", action: "" },
    }),
    condition: (position) => ({
      id: `condition-${Date.now()}`,
      type: "condition",
      position,
      data: { condition: "", comparator: "equals", value: "" },
    }),
    trigger: (position) => ({
      id: `trigger-${Date.now()}`,
      type: "trigger",
      position,
      data: { triggerType: "manual", schedule: "", event: "" },
    }),
    hitl: (position) => ({
      id: `hitl-${Date.now()}`,
      type: "hitl",
      position,
      data: { reviewType: "approval", instructions: "", timeout: 24 },
    }),
    metric: (position) => ({
      id: `metric-${Date.now()}`,
      type: "metric",
      position,
      data: { metricName: "", threshold: 0, operator: "above" },
    }),
    decision: (position) => ({
      id: `decision-${Date.now()}`,
      type: "decision",
      position,
      data: { question: "", options: ["Yes", "No"] },
    }),
    start: (position) => ({
      id: `start-${Date.now()}`,
      type: "start",
      position,
      data: { workflowName: workflowName || "New Workflow" },
    }),
    end: (position) => ({
      id: `end-${Date.now()}`,
      type: "end",
      position,
      data: { message: "Workflow completed" },
    }),
  }

  // Handle node drag start
  const handleNodeDragStart = (e: React.MouseEvent, nodeId: string) => {
    if (isCreatingEdge) return

    const node = nodes.find((n) => n.id === nodeId)
    if (!node) return

    setIsDragging(true)
    setDraggedNode(nodeId)

    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / zoom - node.position.x
      const y = (e.clientY - rect.top) / zoom - node.position.y
      setDragOffset({ x, y })
    }

    e.stopPropagation()
  }

  // Handle node drag
  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isDragging && draggedNode && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / zoom - dragOffset.x
      const y = (e.clientY - rect.top) / zoom - dragOffset.y

      setNodes((prev) => prev.map((node) => (node.id === draggedNode ? { ...node, position: { x, y } } : node)))
    }

    if (isCreatingEdge && edgeStart && canvasRef.current) {
      // Handle edge creation preview if needed
    }
  }

  // Handle node drag end
  const handleCanvasMouseUp = () => {
    setIsDragging(false)
    setDraggedNode(null)

    if (isCreatingEdge) {
      setIsCreatingEdge(false)
      setEdgeStart(null)
    }
  }

  // Handle node selection
  const handleNodeClick = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation()

    if (isCreatingEdge) {
      if (edgeStart && edgeStart !== nodeId) {
        // Create new edge
        const newEdge: WorkflowEdge = {
          id: `edge-${Date.now()}`,
          source: edgeStart,
          target: nodeId,
          type: "default",
          animated: false,
        }

        setEdges((prev) => [...prev, newEdge])
        setIsCreatingEdge(false)
        setEdgeStart(null)
      } else {
        setEdgeStart(nodeId)
      }
      return
    }

    const node = nodes.find((n) => n.id === nodeId)
    if (node) {
      setSelectedNode(node)
      setSelectedEdge(null)
    }
  }

  // Handle edge selection
  const handleEdgeClick = (e: React.MouseEvent, edgeId: string) => {
    e.stopPropagation()

    const edge = edges.find((e) => e.id === edgeId)
    if (edge) {
      setSelectedEdge(edge)
      setSelectedNode(null)
    }
  }

  // Handle canvas click (deselect)
  const handleCanvasClick = () => {
    setSelectedNode(null)
    setSelectedEdge(null)
  }

  // Add new node to canvas
  const addNode = (type: NodeType) => {
    const centerX = canvasSize.width / 2 - pan.x
    const centerY = canvasSize.height / 2 - pan.y

    const newNode = nodeTemplates[type]({ x: centerX, y: centerY })
    setNodes((prev) => [...prev, newNode])
    setSelectedNode(newNode)
  }

  // Delete selected node or edge
  const deleteSelected = () => {
    if (selectedNode) {
      // Don't allow deleting start or end nodes
      if (selectedNode.type === "start" || selectedNode.type === "end") return

      setNodes((prev) => prev.filter((node) => node.id !== selectedNode.id))
      // Also delete connected edges
      setEdges((prev) => prev.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id))
      setSelectedNode(null)
    }

    if (selectedEdge) {
      setEdges((prev) => prev.filter((edge) => edge.id !== selectedEdge.id))
      setSelectedEdge(null)
    }
  }

  // Update node data
  const updateNodeData = (data: Record<string, any>) => {
    if (!selectedNode) return

    setNodes((prev) =>
      prev.map((node) => (node.id === selectedNode.id ? { ...node, data: { ...node.data, ...data } } : node)),
    )

    setSelectedNode((prev) => (prev ? { ...prev, data: { ...prev.data, ...data } } : null))
  }

  // Update edge data
  const updateEdgeData = (data: Partial<WorkflowEdge>) => {
    if (!selectedEdge) return

    setEdges((prev) => prev.map((edge) => (edge.id === selectedEdge.id ? { ...edge, ...data } : edge)))

    setSelectedEdge((prev) => (prev ? { ...prev, ...data } : null))
  }

  // Start edge creation mode
  const startEdgeCreation = () => {
    setIsCreatingEdge(true)
    setEdgeStart(selectedNode?.id || null)
  }

  // Save workflow
  const saveWorkflow = async () => {
    if (!workflowName) {
      alert("Please enter a workflow name")
      return
    }

    try {
      const result = await createWorkflow({
        name: workflowName,
        description: workflowDescription,
        nodes,
        edges,
      })

      if (result.id) {
        router.push(`/cognito/workflows/${result.id}`)
      }
    } catch (error) {
      console.error("Error saving workflow:", error)
      alert("Failed to save workflow")
    }
  }

  // Render node based on type
  const renderNode = (node: WorkflowNode) => {
    const isSelected = selectedNode?.id === node.id
    const nodeStyle: React.CSSProperties = {
      position: "absolute",
      left: `${node.position.x}px`,
      top: `${node.position.y}px`,
      transform: "translate(-50%, -50%)",
      cursor: isDragging && draggedNode === node.id ? "grabbing" : "grab",
      zIndex: isSelected ? 10 : 1,
      userSelect: "none",
    }

    const baseNodeClasses = `
      flex items-center justify-center rounded-lg shadow-md border-2
      ${isSelected ? "border-primary" : "border-gray-200"}
      transition-all duration-200
    `

    switch (node.type) {
      case "start":
        return (
          <div
            className={`${baseNodeClasses} bg-green-100 w-32 h-16`}
            style={nodeStyle}
            onMouseDown={(e) => handleNodeDragStart(e, node.id)}
            onClick={(e) => handleNodeClick(e, node.id)}
          >
            <div className="text-center">
              <div className="font-medium">Start</div>
            </div>
          </div>
        )

      case "end":
        return (
          <div
            className={`${baseNodeClasses} bg-red-100 w-32 h-16`}
            style={nodeStyle}
            onMouseDown={(e) => handleNodeDragStart(e, node.id)}
            onClick={(e) => handleNodeClick(e, node.id)}
          >
            <div className="text-center">
              <div className="font-medium">End</div>
            </div>
          </div>
        )

      case "agent":
        return (
          <div
            className={`${baseNodeClasses} bg-blue-100 w-48 h-24`}
            style={nodeStyle}
            onMouseDown={(e) => handleNodeDragStart(e, node.id)}
            onClick={(e) => handleNodeClick(e, node.id)}
          >
            <div className="text-center p-2">
              <Bot className="h-4 w-4 mx-auto mb-1" />
              <div className="font-medium">{(node as AgentNode).data.agentName}</div>
              <div className="text-xs text-gray-600">{(node as AgentNode).data.action || "No action"}</div>
            </div>
          </div>
        )

      case "condition":
        return (
          <div
            className={`${baseNodeClasses} bg-yellow-100 w-48 h-24`}
            style={nodeStyle}
            onMouseDown={(e) => handleNodeDragStart(e, node.id)}
            onClick={(e) => handleNodeClick(e, node.id)}
          >
            <div className="text-center p-2">
              <GitBranch className="h-4 w-4 mx-auto mb-1" />
              <div className="font-medium">Condition</div>
              <div className="text-xs text-gray-600">{(node as ConditionNode).data.condition || "No condition"}</div>
            </div>
          </div>
        )

      case "trigger":
        return (
          <div
            className={`${baseNodeClasses} bg-purple-100 w-48 h-24`}
            style={nodeStyle}
            onMouseDown={(e) => handleNodeDragStart(e, node.id)}
            onClick={(e) => handleNodeClick(e, node.id)}
          >
            <div className="text-center p-2">
              <Clock className="h-4 w-4 mx-auto mb-1" />
              <div className="font-medium">Trigger</div>
              <div className="text-xs text-gray-600">{(node as TriggerNode).data.triggerType || "Manual trigger"}</div>
            </div>
          </div>
        )

      case "hitl":
        return (
          <div
            className={`${baseNodeClasses} bg-pink-100 w-48 h-24`}
            style={nodeStyle}
            onMouseDown={(e) => handleNodeDragStart(e, node.id)}
            onClick={(e) => handleNodeClick(e, node.id)}
          >
            <div className="text-center p-2">
              <UserCheck className="h-4 w-4 mx-auto mb-1" />
              <div className="font-medium">Human Review</div>
              <div className="text-xs text-gray-600">{(node as HITLNode).data.reviewType || "Approval"}</div>
            </div>
          </div>
        )

      case "metric":
        return (
          <div
            className={`${baseNodeClasses} bg-cyan-100 w-48 h-24`}
            style={nodeStyle}
            onMouseDown={(e) => handleNodeDragStart(e, node.id)}
            onClick={(e) => handleNodeClick(e, node.id)}
          >
            <div className="text-center p-2">
              <BarChart className="h-4 w-4 mx-auto mb-1" />
              <div className="font-medium">Metric Check</div>
              <div className="text-xs text-gray-600">{(node as MetricNode).data.metricName || "No metric"}</div>
            </div>
          </div>
        )

      case "decision":
        return (
          <div
            className={`${baseNodeClasses} bg-amber-100 w-48 h-24`}
            style={nodeStyle}
            onMouseDown={(e) => handleNodeDragStart(e, node.id)}
            onClick={(e) => handleNodeClick(e, node.id)}
          >
            <div className="text-center p-2">
              <HelpCircle className="h-4 w-4 mx-auto mb-1" />
              <div className="font-medium">Decision</div>
              <div className="text-xs text-gray-600">{node.data.question || "No question"}</div>
            </div>
          </div>
        )

      default:
        return (
          <div
            className={`${baseNodeClasses} bg-gray-100 w-32 h-16`}
            style={nodeStyle}
            onMouseDown={(e) => handleNodeDragStart(e, node.id)}
            onClick={(e) => handleNodeClick(e, node.id)}
          >
            <div className="text-center">
              <div className="font-medium">{node.type}</div>
            </div>
          </div>
        )
    }
  }

  // Render edge between nodes
  const renderEdge = (edge: WorkflowEdge) => {
    const sourceNode = nodes.find((n) => n.id === edge.source)
    const targetNode = nodes.find((n) => n.id === edge.target)

    if (!sourceNode || !targetNode) return null

    const isSelected = selectedEdge?.id === edge.id

    // Calculate edge path
    const startX = sourceNode.position.x
    const startY = sourceNode.position.y
    const endX = targetNode.position.x
    const endY = targetNode.position.y

    // Add some curvature to the path
    const midX = (startX + endX) / 2
    const midY = (startY + endY) / 2
    const offset = 30

    // Create a curved path
    const path = `M ${startX} ${startY} Q ${midX} ${midY - offset}, ${endX} ${endY}`

    // Determine edge color based on type
    let strokeColor = "#9ca3af" // Default gray
    if (edge.type === "success") strokeColor = "#10b981" // Green
    if (edge.type === "failure") strokeColor = "#ef4444" // Red
    if (edge.type === "condition") strokeColor = "#f59e0b" // Amber
    if (edge.type === "approval") strokeColor = "#8b5cf6" // Purple
    if (edge.type === "rejection") strokeColor = "#ec4899" // Pink

    // Calculate position for the label
    const labelX = midX
    const labelY = midY - offset - 10

    return (
      <g key={edge.id} onClick={(e) => handleEdgeClick(e, edge.id)}>
        <path
          d={path}
          stroke={isSelected ? "#3b82f6" : strokeColor}
          strokeWidth={isSelected ? 3 : 2}
          fill="none"
          strokeDasharray={edge.animated ? "5,5" : "none"}
          markerEnd="url(#arrowhead)"
        />

        {edge.label && (
          <g transform={`translate(${labelX}, ${labelY})`}>
            <rect x="-20" y="-10" width="40" height="20" rx="4" fill="white" stroke={strokeColor} />
            <text textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#374151">
              {edge.label}
            </text>
          </g>
        )}
      </g>
    )
  }

  // Render node properties panel
  const renderNodeProperties = () => {
    if (!selectedNode) return null

    switch (selectedNode.type) {
      case "agent":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Agent</label>
              <select
                className="w-full p-2 border rounded"
                value={(selectedNode as AgentNode).data.agentId}
                onChange={(e) =>
                  updateNodeData({
                    agentId: Number.parseInt(e.target.value),
                    agentName: agents.find((a) => a.id === Number.parseInt(e.target.value))?.name || "Unknown Agent",
                    role: agents.find((a) => a.id === Number.parseInt(e.target.value))?.role || "",
                  })
                }
              >
                <option value={0}>Select Agent</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Action</label>
              <Input
                value={(selectedNode as AgentNode).data.action || ""}
                onChange={(e) => updateNodeData({ action: e.target.value })}
                placeholder="e.g., Generate content, Analyze data"
              />
            </div>
          </div>
        )

      case "condition":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Condition</label>
              <Input
                value={(selectedNode as ConditionNode).data.condition || ""}
                onChange={(e) => updateNodeData({ condition: e.target.value })}
                placeholder="e.g., status, approval, metric"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Comparator</label>
              <select
                className="w-full p-2 border rounded"
                value={(selectedNode as ConditionNode).data.comparator}
                onChange={(e) =>
                  updateNodeData({
                    comparator: e.target.value,
                  })
                }
              >
                <option value="equals">Equals</option>
                <option value="not_equals">Not Equals</option>
                <option value="greater_than">Greater Than</option>
                <option value="less_than">Less Than</option>
                <option value="contains">Contains</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Value</label>
              <Input
                value={(selectedNode as ConditionNode).data.value || ""}
                onChange={(e) => updateNodeData({ value: e.target.value })}
                placeholder="Value to compare against"
              />
            </div>
          </div>
        )

      case "trigger":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Trigger Type</label>
              <select
                className="w-full p-2 border rounded"
                value={(selectedNode as TriggerNode).data.triggerType}
                onChange={(e) =>
                  updateNodeData({
                    triggerType: e.target.value,
                  })
                }
              >
                <option value="manual">Manual</option>
                <option value="schedule">Schedule</option>
                <option value="event">Event</option>
                <option value="api">API</option>
              </select>
            </div>

            {(selectedNode as TriggerNode).data.triggerType === "schedule" && (
              <div>
                <label className="block text-sm font-medium mb-1">Schedule (cron)</label>
                <Input
                  value={(selectedNode as TriggerNode).data.schedule || ""}
                  onChange={(e) => updateNodeData({ schedule: e.target.value })}
                  placeholder="e.g., 0 9 * * 1-5 (weekdays at 9am)"
                />
              </div>
            )}

            {(selectedNode as TriggerNode).data.triggerType === "event" && (
              <div>
                <label className="block text-sm font-medium mb-1">Event Name</label>
                <Input
                  value={(selectedNode as TriggerNode).data.event || ""}
                  onChange={(e) => updateNodeData({ event: e.target.value })}
                  placeholder="e.g., new_lead, campaign_end"
                />
              </div>
            )}
          </div>
        )

      case "hitl":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Review Type</label>
              <select
                className="w-full p-2 border rounded"
                value={(selectedNode as HITLNode).data.reviewType}
                onChange={(e) =>
                  updateNodeData({
                    reviewType: e.target.value,
                  })
                }
              >
                <option value="approval">Approval</option>
                <option value="edit">Edit</option>
                <option value="input">Input</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Instructions</label>
              <Textarea
                value={(selectedNode as HITLNode).data.instructions || ""}
                onChange={(e) => updateNodeData({ instructions: e.target.value })}
                placeholder="Instructions for the reviewer"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Timeout (hours)</label>
              <Input
                type="number"
                value={(selectedNode as HITLNode).data.timeout || 24}
                onChange={(e) => updateNodeData({ timeout: Number.parseInt(e.target.value) })}
                min={1}
              />
            </div>
          </div>
        )

      case "metric":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Metric Name</label>
              <Input
                value={(selectedNode as MetricNode).data.metricName || ""}
                onChange={(e) => updateNodeData({ metricName: e.target.value })}
                placeholder="e.g., conversion_rate, ctr, roi"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Operator</label>
              <select
                className="w-full p-2 border rounded"
                value={(selectedNode as MetricNode).data.operator}
                onChange={(e) =>
                  updateNodeData({
                    operator: e.target.value,
                  })
                }
              >
                <option value="above">Above</option>
                <option value="below">Below</option>
                <option value="equals">Equals</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Threshold</label>
              <Input
                type="number"
                value={(selectedNode as MetricNode).data.threshold || 0}
                onChange={(e) => updateNodeData({ threshold: Number.parseFloat(e.target.value) })}
                step={0.1}
              />
            </div>
          </div>
        )

      case "decision":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Question</label>
              <Input
                value={selectedNode.data.question || ""}
                onChange={(e) => updateNodeData({ question: e.target.value })}
                placeholder="e.g., Should we proceed with the campaign?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Options</label>
              {selectedNode.data.options?.map((option: string, index: number) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...selectedNode.data.options]
                      newOptions[index] = e.target.value
                      updateNodeData({ options: newOptions })
                    }}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const newOptions = selectedNode.data.options.filter((_: any, i: number) => i !== index)
                      updateNodeData({ options: newOptions })
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {
                  const newOptions = [...(selectedNode.data.options || []), ""]
                  updateNodeData({ options: newOptions })
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Option
              </Button>
            </div>
          </div>
        )

      case "start":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Workflow Name</label>
              <Input
                value={selectedNode.data.workflowName || ""}
                onChange={(e) => {
                  updateNodeData({ workflowName: e.target.value })
                  setWorkflowName(e.target.value)
                }}
                placeholder="Enter workflow name"
              />
            </div>
          </div>
        )

      case "end":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">End Message</label>
              <Input
                value={selectedNode.data.message || ""}
                onChange={(e) => updateNodeData({ message: e.target.value })}
                placeholder="e.g., Workflow completed successfully"
              />
            </div>
          </div>
        )

      default:
        return <div className="text-center py-4 text-gray-500">Select a node to edit its properties</div>
    }
  }

  // Render edge properties panel
  const renderEdgeProperties = () => {
    if (!selectedEdge) return null

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Edge Type</label>
          <select
            className="w-full p-2 border rounded"
            value={selectedEdge.type}
            onChange={(e) =>
              updateEdgeData({
                type: e.target.value as EdgeType,
              })
            }
          >
            <option value="default">Default</option>
            <option value="success">Success</option>
            <option value="failure">Failure</option>
            <option value="condition">Condition</option>
            <option value="approval">Approval</option>
            <option value="rejection">Rejection</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Label</label>
          <Input
            value={selectedEdge.label || ""}
            onChange={(e) => updateEdgeData({ label: e.target.value })}
            placeholder="e.g., Yes, No, If approved"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="animated"
            checked={selectedEdge.animated || false}
            onChange={(e) => updateEdgeData({ animated: e.target.checked })}
          />
          <label htmlFor="animated" className="text-sm">
            Animated
          </label>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push("/cognito/workflows")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <Input
              placeholder="Workflow Name"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="font-medium text-lg mb-1"
            />
            <Textarea
              placeholder="Workflow Description"
              value={workflowDescription}
              onChange={(e) => setWorkflowDescription(e.target.value)}
              className="text-sm"
              rows={2}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => console.log("Test workflow")}>
            <Play className="h-4 w-4 mr-2" />
            Test
          </Button>
          <Button onClick={saveWorkflow}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 flex-1">
        <div className="col-span-1 space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Add Node</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => addNode("agent")} className="justify-start">
                  <Bot className="h-4 w-4 mr-2" />
                  Agent
                </Button>
                <Button variant="outline" onClick={() => addNode("condition")} className="justify-start">
                  <GitBranch className="h-4 w-4 mr-2" />
                  Condition
                </Button>
                <Button variant="outline" onClick={() => addNode("trigger")} className="justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  Trigger
                </Button>
                <Button variant="outline" onClick={() => addNode("hitl")} className="justify-start">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Human Review
                </Button>
                <Button variant="outline" onClick={() => addNode("metric")} className="justify-start">
                  <BarChart className="h-4 w-4 mr-2" />
                  Metric
                </Button>
                <Button variant="outline" onClick={() => addNode("decision")} className="justify-start">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Decision
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Symbolect Symbols</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col items-center p-2 border rounded">
                  <div className="text-2xl mb-1">👤</div>
                  <div className="text-xs text-center">Human Review</div>
                </div>
                <div className="flex flex-col items-center p-2 border rounded">
                  <div className="text-2xl mb-1">✅</div>
                  <div className="text-xs text-center">Approval</div>
                </div>
                <div className="flex flex-col items-center p-2 border rounded">
                  <div className="text-2xl mb-1">❌</div>
                  <div className="text-xs text-center">Rejection</div>
                </div>
                <div className="flex flex-col items-center p-2 border rounded">
                  <div className="text-2xl mb-1">✏️</div>
                  <div className="text-xs text-center">Edit</div>
                </div>
                <div className="flex flex-col items-center p-2 border rounded">
                  <div className="text-2xl mb-1">📈</div>
                  <div className="text-xs text-center">Performance</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <Tabs defaultValue="properties">
                <TabsList className="w-full">
                  <TabsTrigger value="properties" className="flex-1">
                    Properties
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="flex-1">
                    Preview
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="properties" className="mt-4">
                  {selectedNode && (
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium">Node Properties</h3>
                        <div className="flex gap-2">
                          {selectedNode.type !== "start" && selectedNode.type !== "end" && (
                            <Button variant="outline" size="sm" onClick={deleteSelected} className="text-red-600">
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                          )}
                          <Button variant="outline" size="sm" onClick={startEdgeCreation}>
                            <ChevronRight className="h-3 w-3 mr-1" />
                            Connect
                          </Button>
                        </div>
                      </div>
                      {renderNodeProperties()}
                    </div>
                  )}

                  {selectedEdge && (
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium">Edge Properties</h3>
                        <Button variant="outline" size="sm" onClick={deleteSelected} className="text-red-600">
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                      {renderEdgeProperties()}
                    </div>
                  )}

                  {!selectedNode && !selectedEdge && (
                    <div className="text-center py-4 text-gray-500">Select a node or edge to edit its properties</div>
                  )}
                </TabsContent>

                <TabsContent value="preview" className="mt-4">
                  <div className="text-sm">
                    <h3 className="font-medium mb-2">Workflow Preview</h3>
                    <p className="text-gray-500 mb-4">This is a simplified view of your workflow.</p>

                    {nodes.length > 0 ? (
                      <div className="space-y-2">
                        {nodes.map((node, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 border rounded">
                            {node.type === "agent" && <Bot className="h-4 w-4" />}
                            {node.type === "condition" && <GitBranch className="h-4 w-4" />}
                            {node.type === "trigger" && <Clock className="h-4 w-4" />}
                            {node.type === "hitl" && <UserCheck className="h-4 w-4" />}
                            {node.type === "metric" && <BarChart className="h-4 w-4" />}
                            {node.type === "decision" && <HelpCircle className="h-4 w-4" />}
                            {node.type === "start" && <Play className="h-4 w-4" />}
                            {node.type === "end" && <CheckCircle className="h-4 w-4" />}
                            <span className="font-medium">
                              {node.type.charAt(0).toUpperCase() + node.type.slice(1)}
                            </span>
                            {node.type === "agent" && (
                              <span className="text-gray-500">{(node as AgentNode).data.agentName}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">No nodes in workflow</div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-3 border rounded-lg overflow-hidden bg-gray-50 relative">
          <div
            ref={canvasRef}
            className="w-full h-full overflow-auto"
            style={{
              position: "relative",
              cursor: isCreatingEdge ? "crosshair" : "default",
            }}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
          >
            <div
              style={{
                width: `${canvasSize.width}px`,
                height: `${canvasSize.height}px`,
                transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                transformOrigin: "0 0",
                position: "relative",
              }}
            >
              <svg
                width={canvasSize.width}
                height={canvasSize.height}
                style={{ position: "absolute", top: 0, left: 0 }}
              >
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#9ca3af" />
                  </marker>
                </defs>

                {/* Grid lines */}
                <g>
                  {Array.from({ length: Math.ceil(canvasSize.width / 50) }).map((_, i) => (
                    <line
                      key={`vl-${i}`}
                      x1={i * 50}
                      y1={0}
                      x2={i * 50}
                      y2={canvasSize.height}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                    />
                  ))}
                  {Array.from({ length: Math.ceil(canvasSize.height / 50) }).map((_, i) => (
                    <line
                      key={`hl-${i}`}
                      x1={0}
                      y1={i * 50}
                      x2={canvasSize.width}
                      y2={i * 50}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                    />
                  ))}
                </g>

                {/* Edges */}
                {edges.map((edge) => renderEdge(edge))}
              </svg>

              {/* Nodes */}
              {nodes.map((node) => renderNode(node))}
            </div>
          </div>

          {/* Canvas controls */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setZoom((prev) => Math.min(prev + 0.1, 2))}>
              +
            </Button>
            <Button variant="outline" size="sm" onClick={() => setZoom((prev) => Math.max(prev - 0.1, 0.5))}>
              -
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setZoom(1)
                setPan({ x: 0, y: 0 })
              }}
            >
              Reset
            </Button>
          </div>

          {/* Connection mode indicator */}
          {isCreatingEdge && (
            <div className="absolute top-4 left-4 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Connection Mode: Click on target node to connect
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
