'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Agent Maker Components
import AgentCreationPanel from '@/components/agent-maker/agent-creation-panel';
import AgentDeploymentPanel from '@/components/agent-maker/agent-deployment-panel';
import AgentMonitoringPanel from '@/components/agent-maker/agent-monitoring-panel';
import AgentMarketplacePanel from '@/components/agent-maker/agent-marketplace-panel';

export default function AgentMakerPage() {
  const [activeTab, setActiveTab] = useState('create');
  const [agentName, setAgentName] = useState('');
  const [agentDescription, setAgentDescription] = useState('');
  const [agentType, setAgentType] = useState('assistant');
  const [isCreating, setIsCreating] = useState(false);
  const [createdAgent, setCreatedAgent] = useState(null);

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    
    // Simulate agent creation
    setTimeout(() => {
      setCreatedAgent({
        id: `agent-${Date.now()}`,
        name: agentName,
        description: agentDescription,
        type: agentType,
        status: 'created',
        createdAt: new Date().toISOString()
      });
      setIsCreating(false);
    }, 2000);
  };

  return (
    <div className="container mx-auto py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6">Agent Maker (Archon)</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="create">Create Agent</TabsTrigger>
            <TabsTrigger value="deploy">Deployments</TabsTrigger>
            <TabsTrigger value="monitor">Monitoring</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Agent</CardTitle>
                  <CardDescription>
                    Configure your agent's basic settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateAgent} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Agent Name
                      </label>
                      <Input
                        value={agentName}
                        onChange={(e) => setAgentName(e.target.value)}
                        placeholder="Enter agent name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Agent Type
                      </label>
                      <Select 
                        value={agentType} 
                        onValueChange={setAgentType}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select agent type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="assistant">Assistant</SelectItem>
                          <SelectItem value="researcher">Researcher</SelectItem>
                          <SelectItem value="analyst">Analyst</SelectItem>
                          <SelectItem value="creative">Creative</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Description
                      </label>
                      <Textarea
                        value={agentDescription}
                        onChange={(e) => setAgentDescription(e.target.value)}
                        placeholder="Describe your agent's purpose and capabilities"
                        className="min-h-[100px]"
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={isCreating || !agentName.trim() || !agentDescription.trim()}
                      className="w-full"
                    >
                      {isCreating ? 'Creating Agent...' : 'Create Agent'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Agent Configuration</CardTitle>
                  <CardDescription>
                    Advanced settings and capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Capabilities</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="cap-web" className="rounded" />
                          <label htmlFor="cap-web">Web Browsing</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="cap-code" className="rounded" />
                          <label htmlFor="cap-code">Code Execution</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="cap-file" className="rounded" />
                          <label htmlFor="cap-file">File Operations</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="cap-api" className="rounded" />
                          <label htmlFor="cap-api">API Access</label>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Knowledge Integration</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="knowledge-rag" className="rounded" checked />
                          <label htmlFor="knowledge-rag">Agentic RAG System</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="knowledge-custom" className="rounded" />
                          <label htmlFor="knowledge-custom">Custom Knowledge Base</label>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Model Selection</h3>
                      <Select defaultValue="gpt-4">
                        <SelectTrigger>
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4">GPT-4</SelectItem>
                          <SelectItem value="claude-3">Claude 3</SelectItem>
                          <SelectItem value="llama-3">Llama 3</SelectItem>
                          <SelectItem value="custom">Custom Model</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {createdAgent && (
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Agent Created Successfully</CardTitle>
                    <CardDescription>
                      Your agent is ready for deployment
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-4 rounded-md">
                      <h3 className="font-semibold text-lg mb-2">{createdAgent.name}</h3>
                      <p className="mb-2">{createdAgent.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium">ID:</span> {createdAgent.id}
                        </div>
                        <div>
                          <span className="font-medium">Type:</span> {createdAgent.type}
                        </div>
                        <div>
                          <span className="font-medium">Status:</span> {createdAgent.status}
                        </div>
                        <div>
                          <span className="font-medium">Created:</span> {new Date(createdAgent.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <Button onClick={() => setActiveTab('deploy')}>
                          Deploy Agent
                        </Button>
                        <Button variant="outline">
                          Edit Configuration
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="deploy">
            <AgentDeploymentPanel />
          </TabsContent>
          
          <TabsContent value="monitor">
            <AgentMonitoringPanel />
          </TabsContent>
          
          <TabsContent value="marketplace">
            <AgentMarketplacePanel />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
