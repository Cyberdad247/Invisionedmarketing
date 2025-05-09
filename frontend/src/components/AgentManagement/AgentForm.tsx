import React, { useEffect } from 'react';
import { Agent, AgentCreate, AgentUpdate } from '../../types/agent';
import { useAgentStore } from '../../state/agentStore';

type AgentFormProps = {
  agent?: Agent;
  onSuccess?: () => void;
};

export const AgentForm: React.FC<AgentFormProps> = ({ agent, onSuccess }) => {
  const { createAgent, updateAgent, loading } = useAgentStore();
  const [formData, setFormData] = React.useState<AgentCreate | AgentUpdate>(
    agent || {
      name: '',
      description: '',
      framework: 'langchain',
      model: '',
      system_prompt: '',
      tools: [],
      parameters: {},
    }
  );

  useEffect(() => {
    if (agent) {
      setFormData(agent);
    }
  }, [agent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (agent) {
      await updateAgent(agent.id, formData);
    } else {
      await createAgent(formData as AgentCreate);
    }
    
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card text-card-foreground p-6 rounded-lg shadow-md" aria-labelledby="agent-form-title">
      <h2 id="agent-form-title" className="text-xl font-semibold text-primary sr-only">{agent ? 'Edit Agent' : 'Create New Agent'}</h2>
      
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-foreground">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          aria-required="true"
          className="block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-input text-foreground"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-foreground">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          aria-required="true"
          rows={3}
          className="block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-input text-foreground"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="framework" className="block text-sm font-medium text-foreground">Framework</label>
        <select
          id="framework"
          name="framework"
          value={formData.framework}
          onChange={handleChange}
          required
          aria-required="true"
          className="block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-input text-foreground"
        >
          <option value="langchain">LangChain</option>
          <option value="crewai">CrewAI</option>
          <option value="langgraph">LangGraph</option>
        </select>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="model" className="block text-sm font-medium text-foreground">Model</label>
        <input
          type="text"
          id="model"
          name="model"
          value={formData.model}
          onChange={handleChange}
          required
          aria-required="true"
          aria-describedby="model-description"
          className="block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-input text-foreground"
        />
        <p id="model-description" className="text-xs text-muted-foreground">
          Specify the AI model to be used, e.g., "gpt-4-turbo", "claude-3-opus".
        </p>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="system_prompt" className="block text-sm font-medium text-foreground">System Prompt</label>
        <textarea
          id="system_prompt"
          name="system_prompt"
          value={formData.system_prompt}
          onChange={handleChange}
          required
          aria-required="true"
          aria-describedby="system_prompt-description"
          rows={5}
          className="block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-input text-foreground whitespace-pre-wrap"
        />
        <p id="system_prompt-description" className="text-xs text-muted-foreground">
          Define the agent's persona, instructions, and guidelines. This prompt guides the agent's behavior and responses.
        </p>
      </div>
      
      <button 
        type="submit" 
        disabled={loading}
        className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
        aria-live="polite"
        aria-disabled={loading}
      >
        {loading ? 'Saving...' : (agent ? 'Save Changes' : 'Create Agent')}
      </button>
    </form>
  );
};