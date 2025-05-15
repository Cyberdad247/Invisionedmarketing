import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { colors } from './DashboardLayout';

const AgentCard = styled(motion.div)`
  background: rgba(30, 30, 30, 0.8);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid ${colors.digitalPurple};
  box-shadow: 0 0 10px rgba(106, 0, 244, 0.2);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 0 20px rgba(106, 0, 244, 0.4);
    transform: translateY(-2px);
  }
`;

const AgentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AgentAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${colors.digitalPurple}, ${colors.cyberCyan});
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.neonWhite};
  font-weight: bold;
`;

const AgentInfo = styled.div`
  flex: 1;
`;

const AgentName = styled.h3`
  margin: 0;
  font-size: 1rem;
  color: ${colors.neonWhite};
`;

const AgentStatus = styled.div<{ status: 'active' | 'idle' | 'error' }>`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 0.5rem;
  background-color: ${props => 
    props.status === 'active' ? colors.matrixGreen :
    props.status === 'idle' ? colors.electricGold :
    colors.alertRed};
  box-shadow: 0 0 5px ${props => 
    props.status === 'active' ? colors.matrixGreen :
    props.status === 'idle' ? colors.electricGold :
    colors.alertRed};
`;

const AgentMetrics = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.8rem;
`;

const MetricItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const MetricLabel = styled.span`
  color: ${colors.cyberCyan};
`;

const MetricValue = styled.span`
  color: ${colors.neonWhite};
`;

const QuickActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled(motion.button)`
  background: ${colors.digitalPurple};
  color: ${colors.neonWhite};
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.cyberCyan};
    color: ${colors.glossBlack};
  }
`;

interface Agent {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'error';
  performance: number;
  uptime: string;
  tasksCompleted: number;
}

interface AgentRosterProps {
  agents: Agent[];
}

export const AgentRoster: React.FC<AgentRosterProps> = ({ agents }) => {
  return (
    <div>
      {agents.map((agent) => (
        <AgentCard 
          key={agent.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AgentHeader>
            <AgentAvatar>{agent.name.charAt(0)}</AgentAvatar>
            <AgentInfo>
              <AgentName>
                <AgentStatus status={agent.status} />
                {agent.name}
              </AgentName>
            </AgentInfo>
          </AgentHeader>
          <AgentMetrics>
            <MetricItem>
              <MetricLabel>Performance</MetricLabel>
              <MetricValue>{agent.performance}%</MetricValue>
            </MetricItem>
            <MetricItem>
              <MetricLabel>Uptime</MetricLabel>
              <MetricValue>{agent.uptime}</MetricValue>
            </MetricItem>
            <MetricItem>
              <MetricLabel>Tasks</MetricLabel>
              <MetricValue>{agent.tasksCompleted}</MetricValue>
            </MetricItem>
          </AgentMetrics>
          <QuickActions>
            <ActionButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Details
            </ActionButton>
            <ActionButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {agent.status === 'active' ? 'Pause' : 'Start'}
            </ActionButton>
          </QuickActions>
        </AgentCard>
      ))}
    </div>
  );
};