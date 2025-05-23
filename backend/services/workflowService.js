// Workflow Service - Unified workflow management service
// Integrates functionality from OWL framework

import axios from 'axios';

const API_URL = '/api/workflows';

// Create a new workflow
export const createWorkflow = async (workflowData) => {
  try {
    const response = await axios.post(API_URL, workflowData);
    return response.data;
  } catch (error) {
    console.error('Error creating workflow:', error);
    throw error;
  }
};

// Get all workflows
export const getWorkflows = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching workflows:', error);
    throw error;
  }
};

// Get workflow by ID
export const getWorkflowById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching workflow ${id}:`, error);
    throw error;
  }
};

// Update workflow
export const updateWorkflow = async (id, workflowData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, workflowData);
    return response.data;
  } catch (error) {
    console.error(`Error updating workflow ${id}:`, error);
    throw error;
  }
};

// Delete workflow
export const deleteWorkflow = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting workflow ${id}:`, error);
    throw error;
  }
};

// Execute workflow
export const executeWorkflow = async (id, inputs = {}) => {
  try {
    const response = await axios.post(`${API_URL}/${id}/execute`, { inputs });
    return response.data;
  } catch (error) {
    console.error(`Error executing workflow ${id}:`, error);
    throw error;
  }
};

// Get workflow execution status
export const getWorkflowExecutionStatus = async (executionId) => {
  try {
    const response = await axios.get(`${API_URL}/executions/${executionId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching execution status ${executionId}:`, error);
    throw error;
  }
};

// Get workflow templates
export const getWorkflowTemplates = async () => {
  try {
    const response = await axios.get(`${API_URL}/templates`);
    return response.data;
  } catch (error) {
    console.error('Error fetching workflow templates:', error);
    throw error;
  }
};

// Create workflow from template
export const createWorkflowFromTemplate = async (templateId, customizations = {}) => {
  try {
    const response = await axios.post(`${API_URL}/templates/${templateId}`, customizations);
    return response.data;
  } catch (error) {
    console.error(`Error creating workflow from template ${templateId}:`, error);
    throw error;
  }
};
