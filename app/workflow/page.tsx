'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';

export default function WorkflowPage() {
  const [activeTab, setActiveTab] = useState('editor');
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Sample nodes and edges for ReactFlow
  const initialNodes = [
    {
      id: '1',
      type: 'input',
      data: { label: 'Input Image' },
      position: { x: 250, y: 25 },
    },
    {
      id: '2',
      data: { label: 'Image Processor' },
      position: { x: 250, y: 125 },
    },
    {
      id: '3',
      type: 'output',
      data: { label: 'Output Image' },
      position: { x: 250, y: 225 },
    },
  ];
  
  const initialEdges = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3' },
  ];
  
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const handleSaveWorkflow = () => {
    setIsProcessing(true);
    
    // Simulate workflow saving
    setTimeout(() => {
      setIsProcessing(false);
      alert(`Workflow "${workflowName}" saved successfully!`);
    }, 1500);
  };

  return (
    <div className="container mx-auto py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6">ComfyUI Workflow</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="editor">Workflow Editor</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Visual Editor</CardTitle>
                  <CardDescription>
                    Create and edit your workflow using the node-based interface
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div style={{ height: '500px', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
                    <ReactFlow
                      nodes={nodes}
                      edges={edges}
                      fitView
                    >
                      <Controls />
                      <MiniMap />
                      <Background gap={12} size={1} />
                    </ReactFlow>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Workflow Properties</CardTitle>
                  <CardDescription>
                    Configure your workflow settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Workflow Name
                      </label>
                      <Input
                        value={workflowName}
                        onChange={(e) => setWorkflowName(e.target.value)}
                        placeholder="Enter workflow name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Description
                      </label>
                      <Textarea
                        value={workflowDescription}
                        onChange={(e) => setWorkflowDescription(e.target.value)}
                        placeholder="Describe your workflow"
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Output Format
                      </label>
                      <Select defaultValue="png">
                        <SelectTrigger>
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="png">PNG</SelectItem>
                          <SelectItem value="jpg">JPG</SelectItem>
                          <SelectItem value="webp">WebP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Resolution
                      </label>
                      <Select defaultValue="512x512">
                        <SelectTrigger>
                          <SelectValue placeholder="Select resolution" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="512x512">512 x 512</SelectItem>
                          <SelectItem value="768x768">768 x 768</SelectItem>
                          <SelectItem value="1024x1024">1024 x 1024</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      onClick={handleSaveWorkflow} 
                      disabled={isProcessing || !workflowName.trim()}
                      className="w-full"
                    >
                      {isProcessing ? 'Saving...' : 'Save Workflow'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>Node Library</CardTitle>
                  <CardDescription>
                    Drag and drop nodes to build your workflow
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {['Image Loader', 'Text Prompt', 'CLIP Encoder', 'VAE Decoder', 'Sampler', 'Upscaler', 
                      'ControlNet', 'Mask', 'Inpainting', 'Image Blend', 'Color Correction', 'Style Transfer'].map((node, index) => (
                      <div 
                        key={index}
                        className="p-2 bg-muted rounded-md text-center cursor-grab hover:bg-accent hover:text-accent-foreground transition-colors"
                        draggable
                      >
                        {node}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="templates">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['Basic Image Generation', 'Text to Image', 'Image to Image', 'Inpainting', 
                'Style Transfer', 'ControlNet', 'LoRA Fine-tuning', 'Animation', 'Upscaling'].map((template, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{template}</CardTitle>
                    <CardDescription>
                      Pre-configured workflow template
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4">
                      <p className="text-sm text-muted-foreground">Template Preview</p>
                    </div>
                    <Button className="w-full">Use Template</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Workflow History</CardTitle>
                <CardDescription>
                  Your recent workflows and executions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex items-center justify-between p-3 bg-muted rounded-md">
                      <div>
                        <h3 className="font-medium">Workflow #{item}</h3>
                        <p className="text-sm text-muted-foreground">Created {item} day{item !== 1 ? 's' : ''} ago</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Load</Button>
                        <Button variant="outline" size="sm">Duplicate</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
