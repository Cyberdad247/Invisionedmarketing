import React from 'react';
import { motion } from 'framer-motion';

interface InteractiveAgentBuilderProps {
  className?: string;
}

const InteractiveAgentBuilder: React.FC<InteractiveAgentBuilderProps> = ({ 
  className = '' 
}) => {
  return (
    <div className={`py-16 bg-white ${className}`}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">PREVIEW OUR AGENT BUILDER</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience the power and simplicity of our agent building interface before you subscribe.
          </p>
        </motion.div>
        
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="border-b border-gray-200 bg-gray-50 p-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm font-medium text-gray-700 ml-2">Agent Builder Interface</span>
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-gray-500 hover:text-gray-700">
                  <span className="text-sm">Save</span>
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  <span className="text-sm">Export</span>
                </button>
              </div>
            </div>
            
            <div className="p-6 h-80 bg-gray-50 flex">
              <div className="w-1/4 border-r border-gray-200 pr-4">
                <div className="font-medium mb-3">Components</div>
                <div className="space-y-2">
                  <div className="p-2 bg-white rounded border border-gray-200 text-sm cursor-pointer hover:border-primary">
                    Text Processor
                  </div>
                  <div className="p-2 bg-white rounded border border-gray-200 text-sm cursor-pointer hover:border-primary">
                    Image Generator
                  </div>
                  <div className="p-2 bg-white rounded border border-gray-200 text-sm cursor-pointer hover:border-primary">
                    Data Analyzer
                  </div>
                  <div className="p-2 bg-white rounded border border-gray-200 text-sm cursor-pointer hover:border-primary">
                    API Connector
                  </div>
                  <div className="p-2 bg-white rounded border border-gray-200 text-sm cursor-pointer hover:border-primary">
                    Decision Node
                  </div>
                </div>
              </div>
              
              <div className="w-3/4 pl-4 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl text-gray-300 mb-4">+</div>
                    <p className="text-gray-500">Drag and drop components from the left panel</p>
                    <p className="text-gray-400 text-sm mt-2">Or click the "Try Demo" button below</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-center">
              <button className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                TRY DEMO
              </button>
            </div>
          </motion.div>
          
          <div className="mt-8 text-center">
            <ul className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
              <li className="flex items-center">
                <span className="mr-2">✓</span> Drag and drop components
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span> Configure agent parameters
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span> Test agent responses
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span> Deploy with one click
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveAgentBuilder;
