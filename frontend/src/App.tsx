import type React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AgentCreatePage } from "./pages/AgentCreatePage"
import { AgentDetailPage } from "./pages/AgentDetailPage"
import { AgentList } from "./components/AgentList"
import WorkflowCreatePage from "./pages/WorkflowCreatePage"
import { Toaster } from "@/components/ui/toaster"
// Import ACI pages
import AciAppStorePage from "./pages/AciAppStorePage"
import AciAgentPlaygroundPage from "./pages/AciAgentPlaygroundPage"
import AciMcpToolsPage from "./pages/AciMcpToolsPage"

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold text-indigo-600">Invisionedmarketing</h1>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <a
                    href="/"
                    className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Dashboard
                  </a>
                  <a
                    href="/agents"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Agents
                  </a>
                  <a
                    href="/workflows"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Workflows
                  </a>
                  {/* ACI Navigation Links */}
                  <a
                    href="/aci/app-store"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    ACI App Store
                  </a>
                  <a
                    href="/aci/playground"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Agent Playground
                  </a>
                  <a
                    href="/aci/mcp-tools"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    MCP Tools
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="py-10">
          <main>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              <Routes>
                <Route path="/" element={<div>Dashboard</div>} />
                <Route path="/agents" element={<AgentList />} />
                <Route path="/agents/create" element={<AgentCreatePage />} />
                <Route path="/agents/:id" element={<AgentDetailPage />} />
                <Route path="/workflows/create" element={<WorkflowCreatePage />} />
                {/* Add more routes as needed */}
                {/* ACI Routes */}
                <Route path="/aci/app-store" element={<AciAppStorePage />} />
                <Route path="/aci/playground" element={<AciAgentPlaygroundPage />} />
                <Route path="/aci/mcp-tools" element={<AciMcpToolsPage />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
      <Toaster />
    </Router>
  )
}

export default App
