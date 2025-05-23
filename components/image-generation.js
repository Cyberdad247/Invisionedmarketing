import React, { useState } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

// Mock nodes and edges for demonstration
const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Text Prompt' },
    position: { x: 250, y: 25 },
  },
  {
    id: '2',
    data: { label: 'CLIP Text Encoder' },
    position: { x: 250, y: 125 },
  },
  {
    id: '3',
    data: { label: 'KSampler' },
    position: { x: 250, y: 225 },
  },
  {
    id: '4',
    type: 'output',
    data: { label: 'Image Output' },
    position: { x: 250, y: 325 },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
];

export default function ImageGeneration() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  
  const handleGenerate = () => {
    // Mock image generation
    setGeneratedImage('/placeholder-image.jpg');
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card"
        >
          <h2 className="text-xl font-semibold mb-4">Node Editor</h2>
          <div className="h-96 border rounded-md">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              fitView
            >
              <Background />
              <Controls />
            </ReactFlow>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card"
        >
          <h2 className="text-xl font-semibold mb-4">Image Generation</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text Prompt
            </label>
            <textarea
              className="input w-full h-24"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
            />
          </div>
          <button 
            className="btn-primary mb-4"
            onClick={handleGenerate}
          >
            Generate Image
          </button>
          
          {generatedImage && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Generated Image</h3>
              <div className="bg-gray-100 rounded-md p-4 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  [Image would appear here in production]
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}
