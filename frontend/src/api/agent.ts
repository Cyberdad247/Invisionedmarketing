import axios from "axios"
import type { Agent, AgentCreate, AgentUpdate } from "../types/agent"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export const agentApi = {
  /**
   * Create a new agent
   */
  async createAgent(agent: AgentCreate): Promise<Agent> {
    const response = await axios.post(`${API_URL}/agents`, agent)
    return response.data
  },

  /**
   * Get all agents
   */
  async getAgents(): Promise<Agent[]> {
    const response = await axios.get(`${API_URL}/agents`)
    return response.data
  },

  /**
   * Get a specific agent by ID
   */
  async getAgent(id: string): Promise<Agent> {
    const response = await axios.get(`${API_URL}/agents/${id}`)
    return response.data
  },

  /**
   * Update an existing agent
   */
  async updateAgent(id: string, agent: AgentUpdate): Promise<Agent> {
    const response = await axios.put(`${API_URL}/agents/${id}`, agent)
    return response.data
  },

  /**
   * Delete an agent
   */
  async deleteAgent(id: string): Promise<void> {
    await axios.delete(`${API_URL}/agents/${id}`)
  },

  /**
   * Run an agent with input data
   */
  async runAgent(id: string, input: any): Promise<any> {
    const response = await axios.post(`${API_URL}/agents/${id}/run`, input)
    return response.data
  },
}
