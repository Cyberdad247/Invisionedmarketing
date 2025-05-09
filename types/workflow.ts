// Node types for the workflow
export type NodeType = "agent" | "condition" | "trigger" | "hitl" | "start" | "end" | "metric" | "decision"

// Connection types between nodes
export type EdgeType = "default" | "success" | "failure" | "condition" | "approval" | "rejection"

// Position in the canvas
export type Position = {
  x: number
  y: number
}

// Base node interface
export interface WorkflowNode {
  id: string
  type: NodeType
  position: Position
  data: Record<string, any>
}

// Agent node
export interface AgentNode extends WorkflowNode {
  type: "agent"
  data: {
    agentId: number
    agentName: string
    role: string
    action: string
  }
}

// Condition node
export interface ConditionNode extends WorkflowNode {
  type: "condition"
  data: {
    condition: string
    comparator: "equals" | "not_equals" | "greater_than" | "less_than" | "contains"
    value: string | number | boolean
  }
}

// Trigger node
export interface TriggerNode extends WorkflowNode {
  type: "trigger"
  data: {
    triggerType: "schedule" | "event" | "manual" | "api"
    schedule?: string
    event?: string
  }
}

// Human-in-the-loop node
export interface HITLNode extends WorkflowNode {
  type: "hitl"
  data: {
    reviewType: "approval" | "edit" | "input"
    instructions: string
    timeout?: number
  }
}

// Metric node
export interface MetricNode extends WorkflowNode {
  type: "metric"
  data: {
    metricName: string
    threshold: number
    operator: "above" | "below" | "equals"
  }
}

// Decision node
export interface DecisionNode extends WorkflowNode {
  type: "decision"
  data: {
    question: string
    options: string[]
  }
}

// Start node
export interface StartNode extends WorkflowNode {
  type: "start"
  data: {
    workflowName: string
  }
}

// End node
export interface EndNode extends WorkflowNode {
  type: "end"
  data: {
    message?: string
  }
}

// Edge connecting nodes
export interface WorkflowEdge {
  id: string
  source: string
  target: string
  type: EdgeType
  label?: string
  animated?: boolean
  style?: Record<string, any>
}

// Complete workflow
export interface Workflow {
  id: number
  name: string
  description: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  created_at: string
  updated_at: string
  status: "draft" | "active" | "inactive"
  createdBy: string
}

// Symbolect symbol
export interface SymbolectSymbol {
  id: string
  symbol: string
  name: string
  description: string
  type: "review" | "approval" | "rejection" | "edit" | "performance"
}
