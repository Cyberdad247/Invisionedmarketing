// Agent types
export type AutonomyLevel = "low" | "medium" | "high" | "full"

export type AgentSkill = {
  id: string
  name: string
  description: string
  category: string
  searchable: boolean
}

export type HITLReviewPoint = {
  id: string
  name: string
  description: string
  required: boolean
}

export type CognitoAgent = {
  id: number
  name: string
  role: string
  description: string
  activationTrigger: string
  autonomyLevel: AutonomyLevel
  coreSkills: AgentSkill[]
  hitlReviewPoints: HITLReviewPoint[]
  symbolectWorkflow: string
  tosElements: Record<string, any>
  performanceMetrics: Record<string, any>
  status: "active" | "inactive" | "draft"
  created_at: string
  updated_at: string
}

// Workflow types
export type SymbolectSymbol = {
  id: string
  symbol: string
  name: string
  description: string
  type: "review" | "approval" | "rejection" | "edit" | "performance"
}

export type WorkflowNode = {
  id: string
  type: "agent" | "condition" | "hitl" | "start" | "end"
  label: string
  data: any
  position: { x: number; y: number }
}

export type WorkflowEdge = {
  id: string
  source: string
  target: string
  label?: string
  type?: string
}

export type Workflow = {
  id: number
  name: string
  description: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  created_at: string
  updated_at: string
}

// Data integration types
export type DataSource = {
  id: number
  name: string
  type: "google_ads" | "meta" | "linkedin" | "twitter" | "custom"
  connectionDetails: Record<string, any>
  status: "connected" | "disconnected" | "error"
}

export type DataMapping = {
  id: number
  name: string
  sourceField: string
  targetField: string
  transformation?: string
}

// HITL interface types
export type PendingReview = {
  id: number
  agentId: number
  agentName: string
  taskType: string
  content: any
  createdAt: string
  priority: "low" | "medium" | "high" | "critical"
}

export type SystemAlert = {
  id: number
  type: "info" | "warning" | "error" | "success"
  message: string
  source: string
  timestamp: string
  read: boolean
}
