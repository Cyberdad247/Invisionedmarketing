import React from 'react';

const AgentCreationPanel = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-card rounded-lg p-6 border">
        <h2 className="text-xl font-semibold mb-4">Agent Blueprint</h2>
        <p className="mb-4">
          Design your agent's core functionality and behavior using Archon's super agent framework.
        </p>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Agent Type</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-muted p-3 rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors">
                <p className="font-medium">Assistant</p>
                <p className="text-sm text-muted-foreground">General-purpose helper</p>
              </div>
              <div className="bg-muted p-3 rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors">
                <p className="font-medium">Researcher</p>
                <p className="text-sm text-muted-foreground">Information gathering</p>
              </div>
              <div className="bg-muted p-3 rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors">
                <p className="font-medium">Analyst</p>
                <p className="text-sm text-muted-foreground">Data processing</p>
              </div>
              <div className="bg-muted p-3 rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors">
                <p className="font-medium">Creative</p>
                <p className="text-sm text-muted-foreground">Content generation</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Core Capabilities</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="cap-reasoning" className="rounded" checked />
                <label htmlFor="cap-reasoning">Structured Reasoning</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="cap-knowledge" className="rounded" checked />
                <label htmlFor="cap-knowledge">Knowledge Integration</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="cap-planning" className="rounded" checked />
                <label htmlFor="cap-planning">Planning & Execution</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="cap-feedback" className="rounded" />
                <label htmlFor="cap-feedback">Feedback Loop</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg p-6 border">
        <h2 className="text-xl font-semibold mb-4">Agent Configuration</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Knowledge Sources</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="knowledge-rag" className="rounded" checked />
                <label htmlFor="knowledge-rag">Agentic RAG System</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="knowledge-web" className="rounded" />
                <label htmlFor="knowledge-web">Web Search</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="knowledge-docs" className="rounded" />
                <label htmlFor="knowledge-docs">Document Repository</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="knowledge-api" className="rounded" />
                <label htmlFor="knowledge-api">External APIs</label>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Planning Techniques</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input type="radio" id="plan-htn" name="planning" className="rounded" checked />
                <label htmlFor="plan-htn">Hierarchical Task Network (HTN)</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" id="plan-react" name="planning" className="rounded" />
                <label htmlFor="plan-react">ReAct</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" id="plan-tot" name="planning" className="rounded" />
                <label htmlFor="plan-tot">Tree of Thoughts (ToT)</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" id="plan-dynamic" name="planning" className="rounded" />
                <label htmlFor="plan-dynamic">Dynamic Selection</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="md:col-span-2 bg-card rounded-lg p-6 border">
        <h2 className="text-xl font-semibold mb-4">Agent Code Editor</h2>
        <div className="bg-muted p-4 rounded-md font-mono text-sm mb-4 h-64 overflow-auto">
          <pre>{`# Agent Definition
from archon import SuperAgent, KnowledgeBase, PlanningTechnique

class MyAgent(SuperAgent):
    def __init__(self):
        self.knowledge_base = KnowledgeBase(
            use_rag=True,
            use_web_search=False,
            use_document_repo=False,
            use_external_apis=False
        )
        
        self.planning_technique = PlanningTechnique.HTN
        
        self.capabilities = [
            "structured_reasoning",
            "knowledge_integration",
            "planning_execution"
        ]
    
    def process_input(self, user_input):
        # Retrieve relevant knowledge
        context = self.knowledge_base.retrieve(user_input)
        
        # Apply planning technique
        plan = self.apply_planning(user_input, context)
        
        # Execute plan
        result = self.execute_plan(plan)
        
        return result`}</pre>
        </div>
        <div className="flex justify-end space-x-2">
          <button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md">
            Save Draft
          </button>
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
            Create Agent
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentCreationPanel;
