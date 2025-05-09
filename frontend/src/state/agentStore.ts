import { create } from 'zustand';
import type { Agent } from '../types/agent';
import {
  fetchAgents as apiFetchAgents,
  createAgent as apiCreateGenericAgent,
  updateAgent as apiUpdateAgent,
  deleteAgent as apiDeleteAgent,
  createCrewAIAgent as apiCreateCrewAIAgent,
  createLangGraphAgent as apiCreateLangGraphAgent
} from '../api/agent';

interface AgentState {
  agents: Agent[];
  selectedAgent: Agent | null;
  loading: boolean;
  error: string | null;
  fetchAgents: () => Promise<void>;
  selectAgent: (agent: Agent) => void;
  createAgent: (agent: Omit<Agent, 'id'>) => Promise<void>;
  updateAgent: (id: string, agent: Partial<Agent>) => Promise<void>;
  deleteAgent: (id: string) => Promise<void>;
}

export const useAgentStore = create<AgentState>((set) => ({
  agents: [],
  selectedAgent: null,
  loading: false,
  error: null,
  fetchAgents: async () => {
    set({ loading: true, error: null });
    try {
      const agents = await apiFetchAgents();
      set({ agents, loading: false });
    } catch (err: any) { // Add type for err
      set({ error: err.message || 'Failed to fetch agents', loading: false });
    }
  },
  selectAgent: (agent: Agent) => set({ selectedAgent: agent }),
  createAgent: async (agent: Omit<Agent, 'id'>) => { // Add type for agent
    set({ loading: true, error: null });
    try {
      let newAgent: Agent;
      if (agent.framework === 'crewai') {
        newAgent = await apiCreateCrewAIAgent(agent);
      } else if (agent.framework === 'langgraph') {
        newAgent = await apiCreateLangGraphAgent(agent);
      } else {
        newAgent = await apiCreateGenericAgent(agent);
      }
      set((state: AgentState) => ({
        agents: [...state.agents, newAgent],
        loading: false,
        selectedAgent: newAgent
      }));
    } catch (err: any) { // Add type for err
      set({ error: err.message || 'Failed to create agent', loading: false });
    }
  },
  updateAgent: async (id: string, agent: Partial<Agent>) => { // Add type for id and agent
    set({ loading: true, error: null });
    try {
      const updatedAgent = await apiUpdateAgent(id, agent);
      set((state: AgentState) => ({ // Add type for state
        agents: state.agents.map((a: Agent) => (a.id === id ? updatedAgent : a)), // Add type for a
        loading: false,
        selectedAgent: state.selectedAgent?.id === id ? updatedAgent : state.selectedAgent,
      }));
    } catch (err: any) { // Add type for err
      set({ error: err.message || 'Failed to update agent', loading: false });
    }
  },
  deleteAgent: async (id: string) => { // Add type for id
    set({ loading: true, error: null });
    try {
      await apiDeleteAgent(id);
      set((state: AgentState) => ({ // Add type for state
        agents: state.agents.filter((a: Agent) => a.id !== id), // Add type for a
        loading: false,
        selectedAgent: state.selectedAgent?.id === id ? null : state.selectedAgent,
      }));
    } catch (err: any) { // Add type for err
      set({ error: err.message || 'Failed to delete agent', loading: false });
    }
  },
}));