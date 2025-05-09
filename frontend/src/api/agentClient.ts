import axios from 'axios';
import { Agent, AgentCreate, AgentUpdate } from '../types/agent';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const agentClient = {
  async getAgents(): Promise<Agent[]> {
    const response = await axios.get(`${API_BASE_URL}/agents`);
    return response.data;
  },

  async getAgent(id: number): Promise<Agent> {
    const response = await axios.get(`${API_BASE_URL}/agents/${id}`);
    return response.data;
  },

  async createAgent(agent: AgentCreate): Promise<Agent> {
    const response = await axios.post(`${API_BASE_URL}/agents`, agent);
    return response.data;
  },

  async updateAgent(id: number, agent: AgentUpdate): Promise<Agent> {
    const response = await axios.put(`${API_BASE_URL}/agents/${id}`, agent);
    return response.data;
  },

  async deleteAgent(id: number): Promise<void> {
    await axios.delete(`${API_BASE_URL}/agents/${id}`);
  },

  async createContentGeneratorAgent(): Promise<Agent> {
    const response = await axios.post(`${API_BASE_URL}/agents/marketing/content-generator`);
    return response.data;
  },

  async createAnalyticsAgent(): Promise<Agent> {
    const response = await axios.post(`${API_BASE_URL}/agents/marketing/analytics`);
    return response.data;
  }
};

export default agentClient;