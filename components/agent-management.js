import React, { useState } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';

export default function AgentManagement() {
  const [activeTab, setActiveTab] = useState('create');
  
  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Tabs.Root 
          value={activeTab} 
          onValueChange={setActiveTab}
        >
          <Tabs.List className="flex border-b mb-6">
            <Tabs.Trigger 
              value="create"
              className="px-4 py-2 -mb-px border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:text-primary-600"
            >
              Create Agent
            </Tabs.Trigger>
            <Tabs.Trigger 
              value="deployments"
              className="px-4 py-2 -mb-px border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:text-primary-600"
            >
              Deployments
            </Tabs.Trigger>
            <Tabs.Trigger 
              value="monitoring"
              className="px-4 py-2 -mb-px border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:text-primary-600"
            >
              Monitoring
            </Tabs.Trigger>
          </Tabs.List>
          
          <Tabs.Content value="create" className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Create Archon Super Agent</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Agent Name
                  </label>
                  <input 
                    type="text" 
                    className="input w-full" 
                    placeholder="Enter agent name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea 
                    className="input w-full h-24" 
                    placeholder="Describe your agent's purpose and capabilities"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Framework
                  </label>
                  <select className="input w-full">
                    <option value="archon">Archon Super Agent</option>
                    <option value="camel">Camel Framework</option>
                    <option value="owl">OWL Framework</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capabilities
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="web-search" className="mr-2" />
                      <label htmlFor="web-search">Web Search</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="code-execution" className="mr-2" />
                      <label htmlFor="code-execution">Code Execution</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="image-generation" className="mr-2" />
                      <label htmlFor="image-generation">Image Generation</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="data-analysis" className="mr-2" />
                      <label htmlFor="data-analysis">Data Analysis</label>
                    </div>
                  </div>
                </div>
                <button className="btn-primary">Create Agent</button>
              </div>
            </div>
            
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Internal IDE</h2>
              <div className="bg-gray-900 text-white p-4 rounded-md font-mono text-sm h-64 overflow-auto">
                <div className="text-green-400">// Agent code editor</div>
                <div className="text-gray-400">function initializeAgent() {</div>
                <div className="text-gray-400">  // Initialize agent capabilities</div>
                <div className="text-gray-400">  const agent = new ArchonAgent({</div>
                <div className="text-gray-400">    name: 'Marketing Assistant',</div>
                <div className="text-gray-400">    capabilities: ['web-search', 'image-generation']</div>
                <div className="text-gray-400">  });</div>
                <div className="text-gray-400">  </div>
                <div className="text-gray-400">  return agent;</div>
                <div className="text-gray-400">}</div>
              </div>
              <div className="flex justify-end mt-4">
                <button className="btn-secondary">Run Code</button>
              </div>
            </div>
          </Tabs.Content>
          
          <Tabs.Content value="deployments" className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Active Deployments</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Framework</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">Marketing Assistant</td>
                      <td className="px-6 py-4 whitespace-nowrap">Archon</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-primary-600 hover:text-primary-800 mr-2">Edit</button>
                        <button className="text-red-600 hover:text-red-800">Stop</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">Content Creator</td>
                      <td className="px-6 py-4 whitespace-nowrap">Camel</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Inactive</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-primary-600 hover:text-primary-800 mr-2">Edit</button>
                        <button className="text-green-600 hover:text-green-800">Start</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Tabs.Content>
          
          <Tabs.Content value="monitoring" className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Agent Performance</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Marketing Assistant</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Success Rate</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">85%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Response Time</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">2.3s average</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Cost</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-yellow-600 h-2.5 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">$0.12 per 1000 tokens</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </motion.div>
    </Layout>
  );
}
