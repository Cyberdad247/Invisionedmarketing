"use client"

import type React from "react"
import { useEffect } from "react"
import { useAgentStore } from "../state/agent"
import { Link } from "react-router-dom"

export const AgentList: React.FC = () => {
  const { agents, isLoading, error, fetchAgents, deleteAgent } = useAgentStore()

  useEffect(() => {
    fetchAgents()
  }, [fetchAgents])

  if (isLoading) {
    return <div>Loading agents...</div>
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Agents</h2>
        <Link
          to="/agents/create"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create New Agent
        </Link>
      </div>

      {agents.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No agents found. Create your first agent to get started.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <li key={agent.id} className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200">
              <div className="w-full flex items-center justify-between p-6 space-x-6">
                <div className="flex-1 truncate">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-gray-900 text-sm font-medium truncate">{agent.name}</h3>
                    <span className="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-full">
                      {agent.framework}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-500 text-sm truncate">{agent.description}</p>
                </div>
              </div>
              <div>
                <div className="-mt-px flex divide-x divide-gray-200">
                  <div className="w-0 flex-1 flex">
                    <Link
                      to={`/agents/${agent.id}`}
                      className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500"
                    >
                      <span className="ml-3">View</span>
                    </Link>
                  </div>
                  <div className="-ml-px w-0 flex-1 flex">
                    <button
                      onClick={() => deleteAgent(agent.id)}
                      className="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-red-700 font-medium border border-transparent rounded-br-lg hover:text-red-500"
                    >
                      <span className="ml-3">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
