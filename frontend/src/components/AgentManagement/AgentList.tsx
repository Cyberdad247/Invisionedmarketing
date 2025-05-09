import React from 'react';
import { Agent } from '../../types/agent';

interface AgentListProps {
  agents: Agent[];
  onSelectAgent: (agent: Agent) => void;
}

export const AgentList: React.FC<AgentListProps> = ({ agents, onSelectAgent }) => {
  return (
    <div className="agent-list">
      <h2>Agent Management</h2>
      <ul>
        {agents.map((agent) => (
          <li key={agent.id} onClick={() => onSelectAgent(agent)}>
            <h3>{agent.name}</h3>
            <p>{agent.description}</p>
            <span>Framework: {agent.framework}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};