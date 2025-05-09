export interface Agent {
  id: string
  name: string
  description?: string
  framework: string
  model: string
  system_prompt: string
  tools: string[]
  parameters: Record<string, any>
  created_at: string
  updated_at: string
}

export interface AgentCreate {
  name: string
  description?: string
  framework: string
  model: string
  system_prompt: string
  tools?: string[]
  parameters?: Record<string, any>
}

export interface AgentUpdate {
  name?: string
  description?: string
  framework?: string
  model?: string
  system_prompt?: string
  tools?: string[]
  parameters?: Record<string, any>
}
