import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Theme colors from style guide
export const colors = {
  digitalPurple: '#6A00F4',
  electricGold: '#FFD700',
  glossBlack: '#121212',
  neonWhite: '#F8F8FF',
  cyberCyan: '#00FFFF',
  matrixGreen: '#00FF41',
  alertRed: '#FF0033',
  alertYellow: '#FFCC00'
};

const DashboardContainer = styled.div`
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main right";
  grid-template-columns: 300px 1fr 250px;
  grid-template-rows: 80px 1fr;
  height: 100vh;
  background-color: ${colors.glossBlack};
  color: ${colors.neonWhite};
  font-family: 'Exo 2', sans-serif;
`;

const Header = styled(motion.header)`
  grid-area: header;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  background-color: rgba(18, 18, 18, 0.8);
  border-bottom: 1px solid ${colors.digitalPurple};
  box-shadow: 0 0 15px rgba(106, 0, 244, 0.3);
`;

const Sidebar = styled.aside`
  grid-area: sidebar;
  padding: 1.5rem;
  border-right: 1px solid ${colors.digitalPurple};
`;

const MainContent = styled.main`
  grid-area: main;
  padding: 1.5rem;
  overflow-y: auto;
`;

const RightPanel = styled.div`
  grid-area: right;
  padding: 1.5rem;
  border-left: 1px solid ${colors.digitalPurple};
`;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <DashboardContainer>
      <Header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header content will go here */}
      </Header>
      <Sidebar>
        {/* Sidebar content will go here */}
      </Sidebar>
      <MainContent>
        {children}
      </MainContent>
      <RightPanel>
        {/* Right panel content will go here */}
      </RightPanel>
    </DashboardContainer>
  );
};