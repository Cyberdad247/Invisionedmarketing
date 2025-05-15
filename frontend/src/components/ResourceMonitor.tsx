import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { colors } from './DashboardLayout';

const MonitorContainer = styled.div`
  background: rgba(30, 30, 30, 0.8);
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid ${colors.digitalPurple};
`;

const MonitorTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: ${colors.neonWhite};
  font-size: 1rem;
`;

const ResourceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
`;

const ResourceItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const ResourceName = styled.span`
  font-size: 0.8rem;
  color: ${colors.cyberCyan};
  margin-bottom: 0.25rem;
`;

const ResourceBar = styled.div`
  height: 8px;
  background: rgba(106, 0, 244, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.25rem;
`;

const ResourceFill = styled(motion.div)<{ percent: number }>`
  height: 100%;
  width: ${props => props.percent}%;
  background: linear-gradient(90deg, ${colors.digitalPurple}, ${colors.cyberCyan});
  border-radius: 4px;
`;

const ResourceValue = styled.span`
  font-size: 0.7rem;
  color: ${colors.neonWhite};
`;

interface Resource {
  name: string;
  value: number;
  max: number;
  unit: string;
}

interface ResourceMonitorProps {
  resources: Resource[];
}

export const ResourceMonitor: React.FC<ResourceMonitorProps> = ({ resources }) => {
  return (
    <MonitorContainer>
      <MonitorTitle>Resource Monitor</MonitorTitle>
      <ResourceGrid>
        {resources.map((resource) => (
          <ResourceItem key={resource.name}>
            <ResourceName>{resource.name}</ResourceName>
            <ResourceBar>
              <ResourceFill 
                percent={(resource.value / resource.max) * 100}
                initial={{ width: 0 }}
                animate={{ width: `${(resource.value / resource.max) * 100}%` }}
                transition={{ duration: 0.8, type: 'spring' }}
              />
            </ResourceBar>
            <ResourceValue>
              {resource.value} {resource.unit} / {resource.max} {resource.unit}
            </ResourceValue>
          </ResourceItem>
        ))}
      </ResourceGrid>
    </MonitorContainer>
  );
};