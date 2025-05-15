import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { colors } from './DashboardLayout';

const FeedContainer = styled.div`
  background: rgba(30, 30, 30, 0.8);
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid ${colors.digitalPurple};
  height: 100%;
  overflow-y: auto;
`;

const FeedTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: ${colors.neonWhite};
  font-size: 1rem;
  position: sticky;
  top: 0;
  background: rgba(30, 30, 30, 0.9);
  padding: 0.5rem 0;
  z-index: 1;
`;

const ActivityItem = styled(motion.div)`
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  border-left: 3px solid ${colors.digitalPurple};
  background: rgba(106, 0, 244, 0.1);
`;

const ActivityTime = styled.div`
  font-size: 0.7rem;
  color: ${colors.cyberCyan};
  margin-bottom: 0.25rem;
`;

const ActivityContent = styled.div`
  font-size: 0.8rem;
  color: ${colors.neonWhite};
`;

const StatusIndicator = styled.span<{ status: 'success' | 'warning' | 'error' }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 0.5rem;
  background: ${props => 
    props.status === 'success' ? colors.electricGold :
    props.status === 'warning' ? colors.alertYellow :
    colors.alertRed};
`;

interface Activity {
  id: string;
  timestamp: Date;
  content: string;
  status: 'success' | 'warning' | 'error';
}

interface ActivityFeedProps {
  activities: Activity[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  return (
    <FeedContainer>
      <FeedTitle>Activity Feed</FeedTitle>
      {activities.map((activity) => (
        <ActivityItem
          key={activity.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ActivityTime>
            {activity.timestamp.toLocaleTimeString()}
          </ActivityTime>
          <ActivityContent>
            <StatusIndicator status={activity.status} />
            {activity.content}
          </ActivityContent>
        </ActivityItem>
      ))}
    </FeedContainer>
  );
};
