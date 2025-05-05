import { create } from "zustand"
import type { Agent, AgentCreate, AgentUpdate } from "../types/agent"
import { agentApi } from "../api/agent"

interface AgentState {
  agents: Agent[]
  currentAgent: Agent | null
  isLoading: boolean
  error: string | null

  // Actions
  fetchAgents: () => Promise<void>
  fetchAgent: (id: string) => Promise<void>
  createAgent: (agent: AgentCreate) => Promise<void>
  updateAgent: (id: string, agent: AgentUpdate) => Promise<void>
  deleteAgent: (id: string) => Promise<void>
  runAgent: (id: string, input: any) => Promise<any>
}

export const useAgentStore = create<AgentState>((set, get) => ({
  agents: [],
  currentAgent: null,
  isLoading: false,
  error: null,

  fetchAgents: async () => {
    set({ isLoading: true, error: null })
    try {
      const agents = await agentApi.getAgents()
      set({ agents, isLoading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch agents",
        isLoading: false,
      })
    }
  },

  fetchAgent: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const agent = await agentApi.getAgent(id)
      set({ currentAgent: agent, isLoading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch agent",
        isLoading: false,
      })
    }
  },

  createAgent: async (agent: AgentCreate) => {
    set({ isLoading: true, error: null })
    try {
      const newAgent = await agentApi.createAgent(agent)
      set((state) => ({
        agents: [...state.agents, newAgent],
        currentAgent: newAgent,
        isLoading: false,
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to create agent",
        isLoading: false,
      })
    }
  },

  updateAgent: async (id: string, agent: AgentUpdate) => {
    set({ isLoading: true, error: null })
    try {
      const updatedAgent = await agentApi.updateAgent(id, agent)
      set((state) => ({
        agents: state.agents.map((a) => (a.id === id ? updatedAgent : a)),
        currentAgent: state.currentAgent?.id === id ? updatedAgent : state.currentAgent,
        isLoading: false,
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update agent",
        isLoading: false,
      })
    }
  },

  deleteAgent: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await agentApi.deleteAgent(id)
      set((state) => ({
        agents: state.agents.filter((a) => a.id !== id),
        currentAgent: state.currentAgent?.id === id ? null : state.currentAgent,
        isLoading: false,
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete agent",
        isLoading: false,
      })
    }
  },

  runAgent: async (id: string, input: any) => {
    set({ isLoading: true, error: null })
    try {
      const result = await agentApi.runAgent(id, input)
      set({ isLoading: false })
      return result
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to run agent",
        isLoading: false,
      })
      throw error
    }
  },
}))
