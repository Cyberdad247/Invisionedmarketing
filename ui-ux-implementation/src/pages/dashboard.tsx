import React from 'react';
import TextToImageChat from '../components/sidebar/TextToImageChat';
import AgentConfigurationPanel from '../components/sidebar/AgentConfigurationPanel';
import WorkflowDesigner from '../components/main/WorkflowDesigner';
import AgentWorkspace from '../components/main/AgentWorkspace';
import PerformanceMetrics from '../components/main/PerformanceMetrics';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 lg:w-1/4 p-4 bg-gray-50">
          <div className="mb-6">
            <TextToImageChat className="h-[400px]" />
          </div>
          <div>
            <AgentConfigurationPanel />
          </div>
        </div>
        
        {/* Main Content */}
        <div className="w-full md:w-2/3 lg:w-3/4 p-4">
          <div className="mb-6">
            <WorkflowDesigner />
          </div>
          <div className="mb-6">
            <AgentWorkspace />
          </div>
          <div>
            <PerformanceMetrics />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
