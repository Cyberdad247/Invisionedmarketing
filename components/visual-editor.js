import React from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

// Mock nodes and edges for demonstration
const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Input Node' },
    position: { x: 250, y: 25 },
  },
  {
    id: '2',
    data: { label: 'Process Node' },
    position: { x: 250, y: 125 },
  },
  {
    id: '3',
    data: { label: 'Output Node' },
    position: { x: 250, y: 225 },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
];

export default function VisualEditor() {
  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Visual Node Editor</h2>
          <p className="text-gray-600 mb-4">
            Create interactive node networks and custom UI controls using our visual editor.
          </p>
          
          <div className="h-96 border rounded-md">
            <ReactFlow
              nodes={initialNodes}
              edges={initialEdges}
              fitView
            >
              <Background />
              <Controls />
            </ReactFlow>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Animation Components</h2>
            <div className="space-y-4">
              <motion.div 
                className="bg-primary-100 p-4 rounded-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Hover and Click Animation
              </motion.div>
              
              <motion.div 
                className="bg-secondary-100 p-4 rounded-md"
                animate={{
                  x: [0, 10, -10, 10, 0],
                }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                Continuous Animation
              </motion.div>
              
              <motion.div 
                className="bg-green-100 p-4 rounded-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
              >
                Fade Animation
              </motion.div>
            </div>
          </div>
          
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Custom UI Controls</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slider Control
                </label>
                <input 
                  type="range" 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color Picker
                </label>
                <div className="flex space-x-2">
                  <div className="w-8 h-8 rounded-full bg-red-500"></div>
                  <div className="w-8 h-8 rounded-full bg-green-500"></div>
                  <div className="w-8 h-8 rounded-full bg-blue-500"></div>
                  <div className="w-8 h-8 rounded-full bg-yellow-500"></div>
                  <div className="w-8 h-8 rounded-full bg-purple-500"></div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Toggle Switch
                </label>
                <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                  <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
}
