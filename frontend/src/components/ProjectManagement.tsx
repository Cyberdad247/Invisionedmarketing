import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { colors } from './DashboardLayout';

const ProjectCard = styled(motion.div)`
  background: rgba(30, 30, 30, 0.8);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid ${colors.digitalPurple};
  box-shadow: 0 0 10px rgba(106, 0, 244, 0.2);
`;

const ProjectHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const ProjectTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  color: ${colors.neonWhite};
`;

const ProjectStatus = styled.div<{ status: 'active' | 'paused' | 'completed' }>`
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background-color: ${props => 
    props.status === 'active' ? colors.matrixGreen :
    props.status === 'paused' ? colors.electricGold :
    colors.digitalPurple};
  color: ${colors.glossBlack};
`;

const ProgressBar = styled.div`
  height: 6px;
  background: rgba(106, 0, 244, 0.2);
  border-radius: 3px;
  margin: 0.5rem 0;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  width: ${props => props.progress}%;
  background: linear-gradient(90deg, ${colors.digitalPurple}, ${colors.cyberCyan});
  border-radius: 3px;
`;

const ProjectDetails = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: ${colors.cyberCyan};
`;

interface Project {
  id: string;
  title: string;
  status: 'active' | 'paused' | 'completed';
  progress: number;
  agents: number;
  deadline: string;
}

interface ProjectManagementProps {
  projects: Project[];
}

export const ProjectManagement: React.FC<ProjectManagementProps> = ({ projects }) => {
  return (
    <div>
      {projects.map((project) => (
        <ProjectCard 
          key={project.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ProjectHeader>
            <ProjectTitle>{project.title}</ProjectTitle>
            <ProjectStatus status={project.status}>
              {project.status.toUpperCase()}
            </ProjectStatus>
          </ProjectHeader>
          <ProgressBar>
            <ProgressFill progress={project.progress} />
          </ProgressBar>
          <ProjectDetails>
            <span>{project.agents} Agents</span>
            <span>Due: {project.deadline}</span>
          </ProjectDetails>
        </ProjectCard>
      ))}
    </div>
  );
};