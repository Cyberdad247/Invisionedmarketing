"use server"

import { executeQuery } from "@/lib/db"
import { revalidatePath } from "next/cache"

export type AgentStatus = "active" | "inactive" | "draft";

export type Agent = {
  id: number
  name: string
  description: string
  model: string
  system_prompt: string
  max_tokens: number
  temperature: number
  streaming: boolean
  status: AgentStatus
  created_at: string
  updated_at: string
}

// Get all agents
export async function getAgents(): Promise<Agent[]> {
  const agents = await executeQuery(
    `
    SELECT * FROM agents ORDER BY created_at DESC
  `,
    [],
  )
  return agents
}

// Get a single agent by ID
export async function getAgentById(id: number): Promise<{
  agent: Agent | null
  tools: any[]
  memoryConfig: any | null
  deploymentConfig: any | null
}> {
  const agent = await executeQuery(`SELECT * FROM agents WHERE id = $1`, [id])

  if (agent.length === 0) {
    return { agent: null, tools: [], memoryConfig: null, deploymentConfig: null }
  }

  const tools = await executeQuery(`SELECT * FROM tools WHERE agent_id = $1`, [id])

  const memoryConfig = await executeQuery(`SELECT * FROM memory_configs WHERE agent_id = $1`, [id]).then((res) =>
    res.length > 0 ? res[0] : null,
  )

  const deploymentConfig = await executeQuery(`SELECT * FROM deployment_configs WHERE agent_id = $1`, [id]).then(
    (res) => (res.length > 0 ? res[0] : null),
  )

  return { agent: agent[0], tools, memoryConfig, deploymentConfig }
}

// Create a new agent
export async function createAgent(data: {
  name: string
  description: string
  model: string
  system_prompt: string
  max_tokens: number
  temperature: number
  streaming: boolean
}): Promise<{ id: number }> {
  const result = await executeQuery(
    `INSERT INTO agents (
      name, description, model, system_prompt, max_tokens, temperature, streaming
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7
    ) RETURNING id`,
    [data.name, data.description, data.model, data.system_prompt, data.max_tokens, data.temperature, data.streaming],
  )

  const agentId = result[0].id

  // Create default memory config
  await executeQuery(
    `INSERT INTO memory_configs (
      agent_id, memory_type, message_window
    ) VALUES (
      $1, $2, $3
    )`,
    [agentId, "conversation", 10],
  )

  // Create default deployment config
  await executeQuery(
    `INSERT INTO deployment_configs (
      agent_id, deployment_type, region, environment, webhook_enabled, webhook_url, rate_limiting_enabled, fluid_compute_enabled
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8
    )`,
    [agentId, "vercel", "auto", "production", false, "", true, true],
  )

  revalidatePath("/")
  return { id: result[0].id }
}

// Update an existing agent
export async function updateAgent(
  id: number,
  data: {
    name: string
    description: string
    model: string
    system_prompt: string
    max_tokens: number
    temperature: number
    streaming: boolean
  },
): Promise<{ success: boolean }> {
  await executeQuery(
    `UPDATE agents SET
      name = $1,
      description = $2,
      model = $3,
      system_prompt = $4,
      max_tokens = $5,
      temperature = $6,
      streaming = $7,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $8`,
    [
      data.name,
      data.description,
      data.model,
      data.system_prompt,
      data.max_tokens,
      data.temperature,
      data.streaming,
      id,
    ],
  )

  revalidatePath("/")
  revalidatePath(`/agents/${id}`)
  return { success: true }
}

// Delete an agent
export async function deleteAgent(id: number): Promise<{ success: boolean }> {
  await executeQuery(`DELETE FROM agents WHERE id = $1`, [id])

  revalidatePath("/")
  return { success: true }
}

// Update agent status
export async function updateAgentStatus(
  id: number,
  status: "active" | "inactive" | "draft",
): Promise<{ success: boolean }> {
  await executeQuery(
    `UPDATE agents SET
      status = $1,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $2`,
    [status, id],
  )

  revalidatePath("/")
  revalidatePath(`/agents/${id}`)
  return { success: true }
}

// Save agent tools
export async function saveAgentTools(agentId: number, tools: any[]): Promise<{ success: boolean }> {
  // Delete existing tools
  await executeQuery(`DELETE FROM tools WHERE agent_id = $1`, [agentId])

  // Insert new tools
  for (const tool of tools) {
    await executeQuery(
      `INSERT INTO tools (
        agent_id, name, type, description, enabled, config
      ) VALUES (
        $1, $2, $3, $4, $5, $6
      )`,
      [agentId, tool.name, tool.type, tool.description, tool.enabled, JSON.stringify(tool.config || {})],
    )
  }

  revalidatePath(`/agents/${agentId}`)
  return { success: true }
}

// Save memory config
export async function saveMemoryConfig(
  agentId: number,
  config: { memory_type: string; message_window: number },
): Promise<{ success: boolean }> {
  // Check if a memory config already exists
  const existingConfig = await executeQuery(`SELECT id FROM memory_configs WHERE agent_id = $1`, [agentId])

  if (existingConfig.length > 0) {
    // Update existing config
    await executeQuery(
      `UPDATE memory_configs SET
        memory_type = $1,
        message_window = $2,
        updated_at = CURRENT_TIMESTAMP
      WHERE agent_id = $3`,
      [config.memory_type, config.message_window, agentId],
    )
  } else {
    // Insert new config
    await executeQuery(
      `INSERT INTO memory_configs (
        agent_id, memory_type, message_window
      ) VALUES (
        $1, $2, $3
      )`,
      [agentId, config.memory_type, config.message_window],
    )
  }

  revalidatePath(`/agents/${agentId}`)
  return { success: true }
}

// Save deployment config
export async function saveDeploymentConfig(
  agentId: number,
  config: {
    deployment_type: string
    region: string
    environment: string
    webhook_enabled: boolean
    webhook_url: string
    rate_limiting_enabled: boolean
    fluid_compute_enabled: boolean
  },
): Promise<{ success: boolean }> {
  // Check if a deployment config already exists
  const existingConfig = await executeQuery(`SELECT id FROM deployment_configs WHERE agent_id = $1`, [agentId])

  if (existingConfig.length > 0) {
    // Update existing config
    await executeQuery(
      `UPDATE deployment_configs SET
        deployment_type = $1,
        region = $2,
        environment = $3,
        webhook_enabled = $4,
        webhook_url = $5,
        rate_limiting_enabled = $6,
        fluid_compute_enabled = $7,
        updated_at = CURRENT_TIMESTAMP
      WHERE agent_id = $8`,
      [
        config.deployment_type,
        config.region,
        config.environment,
        config.webhook_enabled,
        config.webhook_url,
        config.rate_limiting_enabled,
        config.fluid_compute_enabled,
        agentId,
      ],
    )
  } else {
    // Insert new config
    await executeQuery(
      `INSERT INTO deployment_configs (
        agent_id, deployment_type, region, environment, webhook_enabled, webhook_url, rate_limiting_enabled, fluid_compute_enabled
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8
      )`,
      [
        agentId,
        config.deployment_type,
        config.region,
        config.environment,
        config.webhook_enabled,
        config.webhook_url,
        config.rate_limiting_enabled,
        config.fluid_compute_enabled,
      ],
    )
  }

  revalidatePath(`/agents/${agentId}`)
  return { success: true }
}
