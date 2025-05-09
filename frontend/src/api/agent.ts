import axios from 'axios';
import { Agent, AgentCreate, AgentUpdate } from '../types/agent';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

interface AgentApiResponse {
  data: Agent[] | Agent;
  error?: string;
}

export const fetchAgents = async (): Promise<Agent[]> => {
  try {
    const response = await axios.get<AgentApiResponse>(`${API_BASE_URL}/agents`);
    return Array.isArray(response.data.data) ? response.data.data : [response.data.data];
  } catch (error) {
    console.error('Failed to fetch agents:', error);
    throw error;
  }
};

export const createAgent = async (agent: AgentCreate): Promise<Agent> => {
  try {
    const response = await axios.post<AgentApiResponse>(`${API_BASE_URL}/agents`, agent);
    return response.data.data as Agent;
  } catch (error) {
    console.error('Failed to create agent:', error);
    throw error;
  }
};

export const updateAgent = async (id: string, agent: AgentUpdate): Promise<Agent> => {
  try {
    const response = await axios.put<AgentApiResponse>(`${API_BASE_URL}/agents/${id}`, agent);
    return response.data.data as Agent;
  } catch (error) {
    console.error('Failed to update agent:', error);
    throw error;
  }
};

export const deleteAgent = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/agents/${id}`);
  } catch (error) {
    console.error('Failed to delete agent:', error);
    throw error;
  }
};

export const getAgentDetails = async (id: string): Promise<Agent> => {
  try {
    const response = await axios.get<AgentApiResponse>(`${API_BASE_URL}/agents/${id}`);
    return response.data.data as Agent;
  } catch (error) {
    console.error('Failed to get agent details:', error);
    throw error;
  }
};

// CrewAI specific methods
export const createCrewAIAgent = async (agent: AgentCreate): Promise<Agent> => {
  try {
    const response = await axios.post<AgentApiResponse>(`${API_BASE_URL}/crewai/agents`, agent);
    return response.data.data as Agent;
  } catch (error) {
    console.error('Failed to create CrewAI agent:', error);
    throw error;
  }
};

// LangGraph specific methods
export const createLangGraphAgent = async (agent: AgentCreate): Promise<Agent> => {
  try {
    const response = await axios.post<AgentApiResponse>(`${API_BASE_URL}/langgraph/agents`, agent);
    return response.data.data as Agent;
  } catch (error) {
    console.error('Failed to create LangGraph agent:', error);
    throw error;
  }
};