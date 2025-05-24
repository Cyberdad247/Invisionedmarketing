import React from 'react';
import { motion } from 'framer-motion';
import ProgressBar from '../ui/ProgressBar';

interface AgentBuildingProcessProps {
  className?: string;
}

const steps = [
  { name: 'Define Agent Purpose', progress: 100 },
  { name: 'Configure Parameters', progress: 50 },
  { name: 'Train Agent', progress: 25 },
  { name: 'Test & Deploy', progress: 10 }
];

const AgentBuildingProcess: React.FC<AgentBuildingProcessProps> = ({ 
  className = '' 
}) => {
  // Calculate overall progress
  const overallProgress = Math.round(
    steps.reduce((acc, step) => acc + step.progress, 0) / steps.length
  );

  return (
    <div className={`py-16 bg-white ${className}`}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">AGENT BUILDING PROCESS</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Track your progress as you build and deploy your AI agents.
          </p>
        </motion.div>
        
        <div className="max-w-3xl mx-auto space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center mb-1">
                <span className="text-sm font-medium text-gray-700 mr-2">Step {index + 1}:</span>
                <span className="text-sm font-medium text-gray-700">{step.name}</span>
              </div>
              <ProgressBar 
                value={step.progress} 
                max={100} 
                size="md" 
                color={index % 2 === 0 ? 'primary' : 'secondary'} 
              />
            </motion.div>
          ))}
          
          <motion.div
            className="mt-8 pt-6 border-t border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex items-center mb-1">
              <span className="text-lg font-bold text-gray-800">Overall Progress: {overallProgress}%</span>
            </div>
            <ProgressBar 
              value={overallProgress} 
              max={100} 
              size="lg" 
              color="matrix" 
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AgentBuildingProcess;
