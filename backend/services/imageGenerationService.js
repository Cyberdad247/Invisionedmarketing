// Image Generation Service - Unified image generation service
// Integrates functionality from ComfyUI and other image generation capabilities

import axios from 'axios';

const API_URL = '/api/image-generation';

// Generate image from text prompt
export const generateImageFromText = async (prompt, options = {}) => {
  try {
    const response = await axios.post(`${API_URL}/text-to-image`, {
      prompt,
      ...options
    });
    return response.data;
  } catch (error) {
    console.error('Error generating image from text:', error);
    throw error;
  }
};

// Generate image from workflow
export const generateImageFromWorkflow = async (workflow, inputs) => {
  try {
    const response = await axios.post(`${API_URL}/workflow`, {
      workflow,
      inputs
    });
    return response.data;
  } catch (error) {
    console.error('Error generating image from workflow:', error);
    throw error;
  }
};

// Get available models
export const getAvailableModels = async () => {
  try {
    const response = await axios.get(`${API_URL}/models`);
    return response.data;
  } catch (error) {
    console.error('Error fetching available models:', error);
    throw error;
  }
};

// Save workflow
export const saveWorkflow = async (workflow) => {
  try {
    const response = await axios.post(`${API_URL}/workflows`, workflow);
    return response.data;
  } catch (error) {
    console.error('Error saving workflow:', error);
    throw error;
  }
};

// Get saved workflows
export const getSavedWorkflows = async () => {
  try {
    const response = await axios.get(`${API_URL}/workflows`);
    return response.data;
  } catch (error) {
    console.error('Error fetching saved workflows:', error);
    throw error;
  }
};

// Get workflow by ID
export const getWorkflowById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/workflows/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching workflow ${id}:`, error);
    throw error;
  }
};

// Update workflow
export const updateWorkflow = async (id, workflow) => {
  try {
    const response = await axios.put(`${API_URL}/workflows/${id}`, workflow);
    return response.data;
  } catch (error) {
    console.error(`Error updating workflow ${id}:`, error);
    throw error;
  }
};

// Delete workflow
export const deleteWorkflow = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/workflows/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting workflow ${id}:`, error);
    throw error;
  }
};
