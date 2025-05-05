"use server"

import { executeQuery } from "@/lib/db"
import { revalidatePath } from "next/cache"
import type {
  CognitoAgent,
  AgentSkill,
  HITLReviewPoint,
  Workflow,
  PendingReview,
  SystemAlert,
  DataSource,
} from "@/types/cognito"

// Define WorkflowNode and WorkflowEdge types
// These are placeholder types. Replace with your actual types.
type WorkflowNode = {
  id: string
  type: string
  data: any
  position: { x: number; y: number }
}

type WorkflowEdge = {
  id: string
  source: string
  target: string
  type?: string
  animated?: boolean
}

// Agent Management Module Actions

export async function getCognitoAgents(): Promise<CognitoAgent[]> {
  const agents = await executeQuery(`SELECT * FROM agents ORDER BY created_at DESC`, [])

  // For each agent, get their skills and HITL review points
  const agentsWithDetails = await Promise.all(
    agents.map(async (agent) => {
      const skills = await executeQuery(`SELECT * FROM agent_skills WHERE agent_id = $1`, [agent.id])

      // We'll simulate HITL review points for now
      const hitlReviewPoints = [
        {
          id: "hitl1",
          name: "Content Approval",
          description: "Review and approve content before publishing",
          required: true,
        },
        {
          id: "hitl2",
          name: "Budget Allocation",
          description: "Approve budget changes above threshold",
          required: true,
        },
      ]

      return {
        ...agent,
        coreSkills: skills,
        hitlReviewPoints,
        tosElements: agent.tos_elements || {},
        performanceMetrics: agent.performance_metrics || {},
      }
    }),
  )

  return agentsWithDetails
}

export async function getCognitoAgentById(id: number): Promise<CognitoAgent | null> {
  const agents = await executeQuery(`SELECT * FROM agents WHERE id = $1`, [id])

  if (agents.length === 0) {
    return null
  }

  const agent = agents[0]

  // Get agent skills
  const skills = await executeQuery(`SELECT * FROM agent_skills WHERE agent_id = $1`, [id])

  // We'll simulate HITL review points for now
  const hitlReviewPoints = [
    {
      id: "hitl1",
      name: "Content Approval",
      description: "Review and approve content before publishing",
      required: true,
    },
    {
      id: "hitl2",
      name: "Budget Allocation",
      description: "Approve budget changes above threshold",
      required: true,
    },
  ]

  return {
    ...agent,
    coreSkills: skills,
    hitlReviewPoints,
    tosElements: agent.tos_elements || {},
    performanceMetrics: agent.performance_metrics || {},
  }
}

export async function createCognitoAgent(data: {
  name: string
  role: string
  description: string
  activationTrigger: string
  autonomyLevel: string
  coreSkills: AgentSkill[]
  hitlReviewPoints: HITLReviewPoint[]
}): Promise<{ id: number }> {
  // Insert the agent
  const result = await executeQuery(
    `INSERT INTO agents (
      name, description, role, activation_command, status
    ) VALUES (
      $1, $2, $3, $4, $5
    ) RETURNING id`,
    [data.name, data.description, data.role, data.activationTrigger, "draft"],
  )

  const agentId = result[0].id

  // Insert agent skills
  for (const skill of data.coreSkills) {
    await executeQuery(
      `INSERT INTO agent_skills (
        agent_id, name, description, category, searchable
      ) VALUES (
        $1, $2, $3, $4, $5
      )`,
      [agentId, skill.name, skill.description, skill.category, skill.searchable],
    )
  }

  // HITL review points would be stored in a separate table in a real implementation

  revalidatePath("/")
  return { id: agentId }
}

// Workflow Automation Engine (Synapse) Actions

export async function getWorkflows(): Promise<Workflow[]> {
  const workflows = await executeQuery(`SELECT * FROM symbolect_workflows ORDER BY created_at DESC`, [])

  return workflows.map((workflow) => ({
    ...workflow,
    nodes: workflow.workflow_data.nodes || [],
    edges: workflow.workflow_data.edges || [],
  }))
}

export async function createWorkflow(data: {
  name: string
  description: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}): Promise<{ id: number }> {
  const result = await executeQuery(
    `INSERT INTO symbolect_workflows (
      name, description, workflow_data
    ) VALUES (
      $1, $2, $3
    ) RETURNING id`,
    [data.name, data.description, JSON.stringify({ nodes: data.nodes, edges: data.edges })],
  )

  revalidatePath("/workflows")
  return { id: result[0].id }
}

// Central Data Lake (Nexus) Actions

export async function getDataSources(): Promise<DataSource[]> {
  // This would typically come from a database table
  // For now, we'll return mock data
  return [
    {
      id: 1,
      name: "Google Ads",
      type: "google_ads",
      connectionDetails: { accountId: "123456789" },
      status: "connected",
    },
    {
      id: 2,
      name: "Meta Ads",
      type: "meta",
      connectionDetails: { accountId: "987654321" },
      status: "connected",
    },
    {
      id: 3,
      name: "LinkedIn Ads",
      type: "linkedin",
      connectionDetails: { accountId: "567891234" },
      status: "disconnected",
    },
  ]
}

// Human-in-the-Loop Interface (Oculus) Actions

export async function getPendingReviews(): Promise<PendingReview[]> {
  // This would typically come from a database table
  // For now, we'll return mock data
  return [
    {
      id: 1,
      agentId: 1,
      agentName: "Lexica",
      taskType: "Content Approval",
      content: { type: "blog_post", title: "10 Ways to Improve Your Marketing", body: "..." },
      createdAt: new Date().toISOString(),
      priority: "high",
    },
    {
      id: 2,
      agentId: 2,
      agentName: "Optimus",
      taskType: "Budget Allocation",
      content: { type: "budget_change", campaign: "Summer Sale", amount: 5000 },
      createdAt: new Date().toISOString(),
      priority: "medium",
    },
  ]
}

export async function getSystemAlerts(): Promise<SystemAlert[]> {
  // This would typically come from a database table
  // For now, we'll return mock data
  return [
    {
      id: 1,
      type: "warning",
      message: "Campaign 'Spring Promotion' is approaching budget limit",
      source: "Optimus",
      timestamp: new Date().toISOString(),
      read: false,
    },
    {
      id: 2,
      type: "error",
      message: "Failed to connect to Google Ads API",
      source: "NexusLink",
      timestamp: new Date().toISOString(),
      read: false,
    },
  ]
}

export async function updateGlobalAutonomy(level: "manual" | "assisted" | "autonomous"): Promise<{ success: boolean }> {
  // This would typically update a system settings table
  // For now, we'll just return success
  return { success: true }
}
