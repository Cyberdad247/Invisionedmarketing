'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="container mx-auto py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Invisioned Marketing</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            An integrated platform for AI-powered marketing, combining workflow management, 
            agent creation, and advanced RAG systems.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>ComfyUI Workflow</CardTitle>
              <CardDescription>
                Create and manage image generation workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4">
                <p className="text-sm text-muted-foreground">Workflow Editor Preview</p>
              </div>
              <p className="mb-4">
                Design complex image generation workflows using a visual node-based editor.
                Leverage ComfyUI's powerful capabilities within a user-friendly interface.
              </p>
              <Link href="/workflow">
                <Button className="w-full">Open Workflow Editor</Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Agent Maker</CardTitle>
              <CardDescription>
                Create and deploy AI agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4">
                <p className="text-sm text-muted-foreground">Agent Maker Preview</p>
              </div>
              <p className="mb-4">
                Build sophisticated AI agents using Archon's super agent framework.
                Configure capabilities, knowledge integration, and deployment options.
              </p>
              <Link href="/agent-maker">
                <Button className="w-full">Open Agent Maker</Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Agentic RAG System</CardTitle>
              <CardDescription>
                Advanced retrieval-augmented generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4">
                <p className="text-sm text-muted-foreground">RAG System Preview</p>
              </div>
              <p className="mb-4">
                Leverage the power of Tree-structured Assembly Language (TAL) and 
                retrieval-augmented generation for structured reasoning and dynamic knowledge integration.
              </p>
              <Link href="/rag-system">
                <Button className="w-full">Open RAG System</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>System Integration</CardTitle>
            <CardDescription>
              How the components work together
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Integrated Architecture</h3>
              <p>
                The Invisioned Marketing platform integrates multiple powerful components into a cohesive system:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>ComfyUI workflows for advanced image generation</li>
                <li>Archon's super agent framework for agent creation and orchestration</li>
                <li>Agentic RAG system for structured reasoning and knowledge integration</li>
                <li>Unified UI with responsive design and fluid animations</li>
              </ul>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Key Features</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Visual node-based workflow editor</li>
                  <li>Agent creation and deployment interface</li>
                  <li>Knowledge base management</li>
                  <li>Structured reasoning with TAL</li>
                  <li>Dynamic technique selection</li>
                  <li>Feedback loop for self-improvement</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Technical Stack</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Next.js with React for frontend</li>
                  <li>Tailwind CSS for styling</li>
                  <li>Framer Motion for animations</li>
                  <li>ReactFlow for node-based interfaces</li>
                  <li>Python backend for agent and RAG systems</li>
                  <li>Containerized deployment with Docker</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
