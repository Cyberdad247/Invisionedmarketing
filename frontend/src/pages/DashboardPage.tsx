import React from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { AgentRoster } from '../components/AgentRoster';
import { ResourceMonitor } from '../components/ResourceMonitor';
import { ActivityFeed } from '../components/ActivityFeed';
import { QuickActionsPanel } from '../components/QuickActionsPanel';

// Mock data
const agents = [
  {
    id: '1',
    name: 'Research Agent',
    status: 'active' as const,
    performance: 95,
    uptime: '3d 12h',
    tasksCompleted: 42
  },
  {
    id: '2',
    name: 'Data Processor',
    status: 'idle' as const,
    performance: 75,
    uptime: '1d 4h',
    tasksCompleted: 18
  },
  {
    id: '3',
    name: 'API Integrator',
    status: 'error' as const,
    performance: 30,
    uptime: '5h',
    tasksCompleted: 5
  }
];

const resources = [
  { name: 'CPU', value: 65, max: 100, unit: '%' },
  { name: 'Memory', value: 4.2, max: 8, unit: 'GB' },
  { name: 'GPU', value: 30, max: 100, unit: '%' }
];

const activities = [
  {
    id: '1',
    timestamp: new Date(),
    content: 'Research Agent completed task',
    status: 'success' as const
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 300000),
    content: 'Data Processor queue full',
    status: 'warning' as const
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 900000),
    content: 'API connection failed',
    status: 'error' as const
  }
];

const quickActions = [
  { id: '1', label: 'New Agent', icon: '➕', onClick: () => console.log('New Agent') },
  { id: '2', label: 'Run Task', icon: '⚡', onClick: () => console.log('Run Task') },
  { id: '3', label: 'Settings', icon: '⚙️', onClick: () => console.log('Settings') },
  { id: '4', label: 'Monitor', icon: '📊', onClick: () => console.log('Monitor') }
];

export const DashboardPage: React.FC = () => {
  return (
    <DashboardLayout>
      <AgentRoster agents={agents} />
      <ResourceMonitor resources={resources} />
      <ActivityFeed activities={activities} />
      <QuickActionsPanel actions={quickActions} />
    </DashboardLayout>
  );
};