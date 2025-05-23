// Agent Service - Unified agent management service
// Integrates functionality from Archon, Camel, and OWL frameworks

import axios from 'axios';

const API_URL = '/api/agents';

export const agentTypes = {
  SUPER_AGENT: 'super',
  WORKFLOW_AGENT: 'workflow',
  ASSISTANT_AGENT: 'assistant'
};

export const agentCapabilities = {
  WEB_SEARCH: 'web-search',
  CODE_EXECUTION: 'code-execution',
  IMAGE_GENERATION: 'image-generation',
  DATA_ANALYSIS: 'data-analysis',
  TEXT_PROCESSING: 'text-processing',
  WORKFLOW_AUTOMATION: 'workflow-automation'
};

// Create a new agent
export const createAgent = async (agentData) => {
  try {
    const response = await axios.post(API_URL, agentData);
    return response.data;
  } catch (error) {
    console.error('Error creating agent:', error);
    throw error;
  }
};

// Get all agents
export const getAgents = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching agents:', error);
    throw error;
  }
};

// Get agent by ID
export const getAgentById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching agent ${id}:`, error);
    throw error;
  }
};

// Update agent
export const updateAgent = async (id, agentData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, agentData);
    return response.data;
  } catch (error) {
    console.error(`Error updating agent ${id}:`, error);
    throw error;
  }
};

// Delete agent
export const deleteAgent = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting agent ${id}:`, error);
    throw error;
  }
};

// Start agent
export const startAgent = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/${id}/start`);
    return response.data;
  } catch (error) {
    console.error(`Error starting agent ${id}:`, error);
    throw error;
  }
};

// Stop agent
export const stopAgent = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/${id}/stop`);
    return response.data;
  } catch (error) {
    console.error(`Error stopping agent ${id}:`, error);
    throw error;
  }
};

// Get agent performance metrics
export const getAgentMetrics = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}/metrics`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching metrics for agent ${id}:`, error);
    throw error;
  }
};

// Execute agent code
export const executeAgentCode = async (id, code) => {
  try {
    const response = await axios.post(`${API_URL}/${id}/execute`, { code });
    return response.data;
  } catch (error) {
    console.error(`Error executing code for agent ${id}:`, error);
    throw error;
  }
};
