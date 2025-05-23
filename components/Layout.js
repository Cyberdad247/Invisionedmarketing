import React from 'react';
import { motion } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-64 bg-white shadow-md"
      >
        <div className="p-4">
          <h1 className="text-2xl font-bold text-primary-600">Invisioned Marketing</h1>
        </div>
        
        <nav className="mt-6">
          <Tabs.Root defaultValue="text-to-image" orientation="vertical">
            <Tabs.List className="flex flex-col space-y-2 px-4">
              <Tabs.Trigger 
                value="text-to-image"
                className="py-2 px-4 rounded-md text-left hover:bg-gray-100 data-[state=active]:bg-primary-100 data-[state=active]:text-primary-700"
              >
                Text-to-Image
              </Tabs.Trigger>
              <Tabs.Trigger 
                value="comfyui"
                className="py-2 px-4 rounded-md text-left hover:bg-gray-100 data-[state=active]:bg-primary-100 data-[state=active]:text-primary-700"
              >
                ComfyUI Workflow
              </Tabs.Trigger>
              <Tabs.Trigger 
                value="agent"
                className="py-2 px-4 rounded-md text-left hover:bg-gray-100 data-[state=active]:bg-primary-100 data-[state=active]:text-primary-700"
              >
                Agent Config
              </Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </nav>
      </motion.div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
