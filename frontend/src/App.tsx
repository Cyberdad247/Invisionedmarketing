// frontend/src/App.tsx (updated)
import type React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AgentCreatePage } from "./pages/AgentCreatePage"
import { AgentDetailPage } from "./pages/AgentDetailPage"
import { AgentList } from "./components/AgentList"
import WorkflowCreatePage from "./pages/WorkflowCreatePage"
import MerlinInterface from "./components/merlin/MerlinInterface"
import DeveloperRealm from "./components/developer/DeveloperRealm"
import VMSandbox from "./components/sandbox/VMSandbox"
import { Toaster } from "../components/ui/toaster"

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
                  <a
                    href="/merlin"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Merlin
                  </a>
                  <a
                    href="/developer"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Developer
                  </a>
                  <a
                    href="/sandbox"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Sandbox
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
                <Route path="/merlin" element={<MerlinInterface />} />
                <Route path="/developer" element={<DeveloperRealm />} />
                <Route path="/sandbox" element={<VMSandbox />} />
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
