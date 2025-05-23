import React from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {/* ComfyUI Processes */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">ComfyUI Processes</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Portrait Generation</span>
                <span className="text-green-600 text-sm">Running</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Landscape Batch</span>
                <span className="text-blue-600 text-sm">Queued</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Deployments */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Agent Deployments</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Marketing Assistant</p>
                <p className="text-sm text-gray-500">Archon Super Agent</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Content Creator</p>
                <p className="text-sm text-gray-500">Camel Framework</p>
              </div>
              <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Inactive</span>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">System Performance</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">CPU Usage</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Memory Usage</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">GPU Usage</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
}
