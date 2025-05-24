import React from 'react';
import { motion } from 'framer-motion';

interface AgentWorkspaceProps {
  className?: string;
}

const AgentWorkspace: React.FC<AgentWorkspaceProps> = ({ 
  className = '' 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-primary">Agent Orchestration & Workflow</h2>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between mb-4">
          <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
            Create New Agent
          </button>
          
          <div className="flex space-x-2">
            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              Save Workflow
            </button>
            <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90">
              Deploy Workflow
            </button>
          </div>
        </div>
        
        <motion.div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 min-h-[300px] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <div className="text-6xl text-gray-300 mb-4">+</div>
            <p className="text-gray-500">Drag and drop agent components here to build your workflow</p>
            <p className="text-gray-400 text-sm mt-2">Or click "Create New Agent" to start from scratch</p>
          </div>
        </motion.div>
        
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-md p-3 hover:shadow-md transition-shadow cursor-pointer">
            <div className="font-medium">Text Processing</div>
            <div className="text-sm text-gray-500">Process and analyze text data</div>
          </div>
          
          <div className="border border-gray-200 rounded-md p-3 hover:shadow-md transition-shadow cursor-pointer">
            <div className="font-medium">Image Generation</div>
            <div className="text-sm text-gray-500">Create images from text prompts</div>
          </div>
          
          <div className="border border-gray-200 rounded-md p-3 hover:shadow-md transition-shadow cursor-pointer">
            <div className="font-medium">Data Analysis</div>
            <div className="text-sm text-gray-500">Analyze and visualize data</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentWorkspace;
