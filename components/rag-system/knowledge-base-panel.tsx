import React from 'react';

const KnowledgeBasePanel = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-card rounded-lg p-6 border">
        <h2 className="text-xl font-semibold mb-4">Knowledge Base Structure</h2>
        <p className="mb-4">
          The Knowledge Base serves as the central repository of structured knowledge for the Agentic RAG system.
          It contains modular TAL blocks, domain-specific planning templates, constraint models, and historical plans.
        </p>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">TAL Blocks</h3>
            <div className="bg-muted p-3 rounded-md">
              <p className="mb-2"><strong>Z-axis:</strong> Hierarchical knowledge organization</p>
              <p className="mb-2"><strong>Ghost axis:</strong> Handles ambiguity and uncertainty</p>
              <p className="mb-2"><strong>Vector axis:</strong> Represents trade-offs and relationships</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Planning Templates</h3>
            <div className="bg-muted p-3 rounded-md">
              <p className="mb-2"><strong>HTN:</strong> Hierarchical Task Network for decomposition</p>
              <p className="mb-2"><strong>ReAct:</strong> Reasoning and Acting for iterative refinement</p>
              <p className="mb-2"><strong>ToT:</strong> Tree of Thoughts for exploring multiple paths</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg p-6 border">
        <h2 className="text-xl font-semibold mb-4">Knowledge Management</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Constraint Models</h3>
            <div className="bg-muted p-3 rounded-md">
              <p className="mb-2"><strong>Ethical Guardrails:</strong> Ensure responsible AI behavior</p>
              <p className="mb-2"><strong>Resource Limits:</strong> Manage computational constraints</p>
              <p className="mb-2"><strong>Domain Constraints:</strong> Enforce domain-specific rules</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Knowledge Acquisition</h3>
            <div className="bg-muted p-3 rounded-md">
              <p className="mb-2"><strong>Feedback Integration:</strong> Learn from execution results</p>
              <p className="mb-2"><strong>Template Refinement:</strong> Improve planning templates</p>
              <p className="mb-2"><strong>Pattern Recognition:</strong> Identify recurring structures</p>
            </div>
          </div>
          
          <div className="mt-4">
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
              Manage Knowledge Base
            </button>
          </div>
        </div>
      </div>
      
      <div className="md:col-span-2 bg-card rounded-lg p-6 border">
        <h2 className="text-xl font-semibold mb-4">Knowledge Visualization</h2>
        <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Knowledge Graph Visualization</p>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBasePanel;
