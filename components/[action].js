// API Routes for Agent Control
// This file handles starting and stopping agents

import { NextApiRequest, NextApiResponse } from 'next';

// Mock database reference from index.js
// In a real implementation, this would use a proper database
import { agents } from './index';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id, action } = req.query;

  // Validate request
  if (!id) {
    return res.status(400).json({ error: 'Agent ID is required' });
  }

  // Find the agent
  const agentIndex = agents.findIndex(a => a.id === id);
  if (agentIndex === -1) {
    return res.status(404).json({ error: 'Agent not found' });
  }

  switch (method) {
    case 'POST':
      // Handle agent actions (start/stop)
      if (action === 'start') {
        agents[agentIndex].status = 'active';
        return res.status(200).json({ 
          message: `Agent ${id} started successfully`,
          agent: agents[agentIndex]
        });
      } 
      else if (action === 'stop') {
        agents[agentIndex].status = 'inactive';
        return res.status(200).json({ 
          message: `Agent ${id} stopped successfully`,
          agent: agents[agentIndex]
        });
      }
      else {
        return res.status(400).json({ error: 'Invalid action. Supported actions: start, stop' });
      }

    default:
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
