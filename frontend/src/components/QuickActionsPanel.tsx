import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { colors } from './DashboardLayout';

const PanelContainer = styled.div`
  background: rgba(30, 30, 30, 0.8);
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid ${colors.digitalPurple};
`;

const PanelTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: ${colors.neonWhite};
  font-size: 1rem;
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
`;

const ActionButton = styled(motion.button)`
  background: rgba(106, 0, 244, 0.2);
  border: 1px solid ${colors.digitalPurple};
  color: ${colors.neonWhite};
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(106, 0, 244, 0.4);
    box-shadow: 0 0 10px rgba(106, 0, 244, 0.3);
  }
`;

const ActionIcon = styled.div`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: ${colors.cyberCyan};
`;

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  onClick: () => void;
}

interface QuickActionsPanelProps {
  actions: QuickAction[];
}

export const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({ actions }) => {
  return (
    <PanelContainer>
      <PanelTitle>Quick Actions</PanelTitle>
      <ActionGrid>
        {actions.map((action) => (
          <ActionButton
            key={action.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={action.onClick}
          >
            <ActionIcon>{action.icon}</ActionIcon>
            {action.label}
          </ActionButton>
        ))}
      </ActionGrid>
    </PanelContainer>
  );
};