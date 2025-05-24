import React from 'react';
import { motion } from 'framer-motion';

interface PerformanceMetricsProps {
  className?: string;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ 
  className = '' 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-primary">Ten Framework Integration</h2>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Response Time</h3>
            <div className="h-40 bg-gray-100 rounded-md flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">125ms</div>
                <div className="text-sm text-gray-500">Average</div>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Resource Usage</h3>
            <div className="h-40 bg-gray-100 rounded-md flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">24%</div>
                <div className="text-sm text-gray-500">CPU Utilization</div>
              </div>
            </div>
          </div>
        </div>
        
        <motion.div 
          className="border border-gray-200 rounded-lg p-4 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-sm font-medium text-gray-700 mb-2">Real-time Data Visualization</h3>
          <div className="h-60 bg-gray-100 rounded-md flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p>Interactive Dashboard</p>
              <p className="text-xs mt-2">Connect to data source to view metrics</p>
            </div>
          </div>
        </motion.div>
        
        <div className="flex justify-end space-x-2">
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            Export Data
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
