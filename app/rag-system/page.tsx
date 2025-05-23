'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// RAG System Components
import KnowledgeBasePanel from '@/components/rag-system/knowledge-base-panel';
import RagEnginePanel from '@/components/rag-system/rag-engine-panel';
import AgenticParserPanel from '@/components/rag-system/agentic-parser-panel';
import WorkflowManagerPanel from '@/components/rag-system/workflow-manager-panel';
import LlmComponentPanel from '@/components/rag-system/llm-component-panel';
import OutputModulePanel from '@/components/rag-system/output-module-panel';
import FeedbackLoopPanel from '@/components/rag-system/feedback-loop-panel';
import IntegrationLayerPanel from '@/components/rag-system/integration-layer-panel';

export default function RagSystemPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [userInput, setUserInput] = useState('');
  const [systemOutput, setSystemOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTechnique, setSelectedTechnique] = useState('htn');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate RAG system processing
    setTimeout(() => {
      setSystemOutput(`Processed input: "${userInput}" using ${selectedTechnique.toUpperCase()} technique.\n\nGenerated structured reasoning with TAL blocks.\n\nOutput includes plan formatting and execution monitoring.`);
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="container mx-auto py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6">Agentic RAG System</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-8 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="knowledge-base">Knowledge Base</TabsTrigger>
            <TabsTrigger value="rag-engine">RAG Engine</TabsTrigger>
            <TabsTrigger value="agentic-parser">Agentic Parser</TabsTrigger>
            <TabsTrigger value="workflow-manager">Workflow Manager</TabsTrigger>
            <TabsTrigger value="llm-component">LLM Component</TabsTrigger>
            <TabsTrigger value="output-module">Output Module</TabsTrigger>
            <TabsTrigger value="feedback-loop">Feedback Loop</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Overview</CardTitle>
                  <CardDescription>
                    Integrated Architecture for AI Agents Using TAL, RAG, and Planning Logic
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    This system combines <strong>TAL (Tree-structured Assembly Language)</strong>, 
                    <strong>RAG (Retrieval-Augmented Generation)</strong>, and 
                    <strong>agentic planning logic</strong> to create AI agents capable of 
                    structured reasoning, dynamic knowledge integration, and adaptive execution.
                  </p>
                  
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Core Components:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Knowledge Base - Central repository of structured knowledge</li>
                      <li>RAG Engine - Retrieves relevant knowledge</li>
                      <li>Agentic Parser - Applies logic to retrieved knowledge</li>
                      <li>Workflow Manager - Orchestrates execution flow</li>
                      <li>LLM Component - Executes reasoning</li>
                      <li>Output Module - Formats results</li>
                      <li>Feedback Loop - Enables self-improvement</li>
                      <li>Integration Layer - Connects to external systems</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Try the RAG System</CardTitle>
                  <CardDescription>
                    Input a query to test the Agentic RAG system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Planning Technique
                      </label>
                      <Select 
                        value={selectedTechnique} 
                        onValueChange={setSelectedTechnique}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select technique" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="htn">Hierarchical Task Network (HTN)</SelectItem>
                          <SelectItem value="react">ReAct</SelectItem>
                          <SelectItem value="tot">Tree of Thoughts (ToT)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Input Query
                      </label>
                      <Textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Enter your query (e.g., 'Design a facility for men in their 50s using Fermi estimation')"
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={isProcessing || !userInput.trim()}
                      className="w-full"
                    >
                      {isProcessing ? 'Processing...' : 'Process Query'}
                    </Button>
                  </form>
                  
                  {systemOutput && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-1">
                        System Output
                      </label>
                      <div className="bg-muted p-3 rounded-md whitespace-pre-line">
                        {systemOutput}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Workflow Diagram</CardTitle>
                  <CardDescription>
                    Step-by-step process flow of the Agentic RAG system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-md text-center">
                    <p className="text-sm text-muted-foreground">
                      [Workflow Diagram Visualization]
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-4">
                      <div className="bg-background p-2 rounded border">User Input</div>
                      <div className="bg-background p-2 rounded border">RAG Engine</div>
                      <div className="bg-background p-2 rounded border">Agentic Parser</div>
                      <div className="bg-background p-2 rounded border">Workflow Manager</div>
                      <div className="bg-background p-2 rounded border">LLM Component</div>
                      <div className="bg-background p-2 rounded border">Output Module</div>
                      <div className="bg-background p-2 rounded border">Execution & Monitoring</div>
                      <div className="bg-background p-2 rounded border">Feedback Loop</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="knowledge-base">
            <KnowledgeBasePanel />
          </TabsContent>
          
          <TabsContent value="rag-engine">
            <RagEnginePanel />
          </TabsContent>
          
          <TabsContent value="agentic-parser">
            <AgenticParserPanel />
          </TabsContent>
          
          <TabsContent value="workflow-manager">
            <WorkflowManagerPanel />
          </TabsContent>
          
          <TabsContent value="llm-component">
            <LlmComponentPanel />
          </TabsContent>
          
          <TabsContent value="output-module">
            <OutputModulePanel />
          </TabsContent>
          
          <TabsContent value="feedback-loop">
            <FeedbackLoopPanel />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
