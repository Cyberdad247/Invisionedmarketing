import { useState } from 'react';
import { useAgentStore } from '../state/agentStore';
import { Agent } from '../types/agent';

export const AgentManagement = () => {
  const { agents, selectedAgent, loading, error, fetchAgents, selectAgent, createAgent, updateAgent, deleteAgent } = useAgentStore();
  const [newAgent, setNewAgent] = useState<Omit<Agent, 'id'>>({ 
    name: '', 
    description: '', 
    framework: 'crewai', 
    config: {} 
  });

  const handleCreate = async () => {
    await createAgent(newAgent);
    setNewAgent({ name: '', description: '', framework: 'crewai', config: {} });
  };

  return (
    <div className="agent-management">
      <h2>Agent Management</h2>
      
      {error && <div className="error">{error}</div>}
      
      <div className="agent-form">
        <input 
          type="text" 
          placeholder="Agent Name" 
          value={newAgent.name}
          onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
        />
        <textarea 
          placeholder="Description" 
          value={newAgent.description}
          onChange={(e) => setNewAgent({...newAgent, description: e.target.value})}
        />
        <select 
          value={newAgent.framework}
          onChange={(e) => setNewAgent({...newAgent, framework: e.target.value as 'crewai' | 'langgraph'})}
        >
          <option value="crewai">CrewAI</option>
          <option value="langgraph">LangGraph</option>
        </select>
        <button onClick={handleCreate} disabled={loading}>
          {loading ? 'Creating...' : 'Create Agent'}
        </button>
      </div>

      <div className="agent-list">
        <h3>Agents</h3>
        <button onClick={fetchAgents} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh Agents'}
        </button>
        
        <ul>
          {agents.map(agent => (
            <li key={agent.id} onClick={() => selectAgent(agent)}>
              {agent.name} ({agent.framework})
              <button onClick={(e) => {
                e.stopPropagation();
                deleteAgent(agent.id);
              }} disabled={loading}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      {selectedAgent && (
        <div className="agent-details">
          <h3>Agent Details</h3>
          <p>Name: {selectedAgent.name}</p>
          <p>Description: {selectedAgent.description}</p>
          <p>Framework: {selectedAgent.framework}</p>
        </div>
      )}
    </div>
  );
};