import React, { useEffect } from 'react';
import { AgentList } from './AgentList';
import { AgentForm } from './AgentForm';
import { AgentDetail } from './AgentDetail';
import { useAgentStore } from '../../state/agentStore';

const AgentManagement: React.FC = () => {
  const { agents, selectedAgent, fetchAgents, selectAgent } = useAgentStore();
  const [showForm, setShowForm] = React.useState(false);
  const [editingAgent, setEditingAgent] = React.useState<Agent | null>(null);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const handleSelectAgent = (agent: Agent) => {
    selectAgent(agent);
    setShowForm(false);
  };

  const handleCreateAgent = () => {
    setEditingAgent(null);
    setShowForm(true);
  };

  const handleEditAgent = () => {
    if (selectedAgent) {
      setEditingAgent(selectedAgent);
      setShowForm(true);
    }
  };

  const handleDeleteAgent = async () => {
    if (selectedAgent) {
      // TODO: Implement delete
      await fetchAgents();
      selectAgent(null);
    }
  };

  const handleFormSuccess = () => {
    fetchAgents();
    setShowForm(false);
  };

  return (
    <div className="agent-management">
      <div className="agent-list-container">
        <button onClick={handleCreateAgent}>Create New Agent</button>
        <AgentList agents={agents} onSelectAgent={handleSelectAgent} />
      </div>

      <div className="agent-content">
        {showForm ? (
          <AgentForm 
            agent={editingAgent} 
            onSuccess={handleFormSuccess} 
          />
        ) : selectedAgent ? (
          <AgentDetail 
            agent={selectedAgent} 
            onEdit={handleEditAgent} 
            onDelete={handleDeleteAgent} 
          />
        ) : (
          <div className="agent-placeholder">
            <p>Select an agent to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentManagement;