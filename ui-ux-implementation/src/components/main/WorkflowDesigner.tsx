import React from 'react';
import { motion } from 'framer-motion';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';

interface WorkflowDesignerProps {
  className?: string;
}

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Input Node' },
    position: { x: 250, y: 25 },
  },
  {
    id: '2',
    data: { label: 'Processing Node' },
    position: { x: 100, y: 125 },
  },
  {
    id: '3',
    data: { label: 'Output Node' },
    position: { x: 400, y: 125 },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
];

const WorkflowDesigner: React.FC<WorkflowDesignerProps> = ({ 
  className = '' 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-primary">ReactFlow Workflow Designer</h2>
      </div>
      
      <motion.div 
        className="h-[400px] w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ReactFlow
          nodes={initialNodes}
          edges={initialEdges}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </motion.div>
    </div>
  );
};

export default WorkflowDesigner;
