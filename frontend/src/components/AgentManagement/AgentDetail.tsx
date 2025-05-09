import React from 'react';
import { Agent } from '../../types/agent';

interface AgentDetailProps {
  agent: Agent;
  onEdit: () => void;
  onDelete: () => void;
}

export const AgentDetail: React.FC<AgentDetailProps> = ({ agent, onEdit, onDelete }) => {
  return (
    <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md" role="article" aria-labelledby="agent-name">
      <h2 id="agent-name" className="text-2xl font-semibold mb-3 text-primary">{agent.name}</h2>
      <p className="text-muted-foreground mb-4">{agent.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-background p-3 rounded-md">
          <span className="text-sm font-medium text-foreground">Framework:</span>
          <span className="block text-secondary-foreground mt-1">{agent.framework}</span>
        </div>
        <div className="bg-background p-3 rounded-md">
          <span className="text-sm font-medium text-foreground">Model:</span>
          <span className="block text-secondary-foreground mt-1">{agent.model}</span>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium text-primary mb-2">System Prompt</h3>
        <p className="text-foreground bg-muted p-3 rounded-md whitespace-pre-wrap">{agent.system_prompt}</p>
      </div>
      
      <div className="flex space-x-3">
        <button 
          onClick={onEdit} 
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label={`Edit agent ${agent.name}`}
        >
          Edit
        </button>
        <button 
          onClick={onDelete} 
          className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label={`Delete agent ${agent.name}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
};