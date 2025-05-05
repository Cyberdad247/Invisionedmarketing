"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAgentStore } from "../state/agent"
import { AgentForm } from "../components/AgentForm"
import type { AgentUpdate } from "../types/agent"

export const AgentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { currentAgent, fetchAgent, updateAgent, isLoading, error } = useAgentStore()
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (id) {
      fetchAgent(id)
    }
  }, [id, fetchAgent])

  const handleUpdate = async (values: AgentUpdate) => {
    if (id) {
      try {
        await updateAgent(id, values)
        setIsEditing(false)
      } catch (err) {
        // Error is handled by the store
      }
    }
  }

  if (isLoading && !currentAgent) {
    return <div>Loading agent...</div>
  }

  if (!currentAgent) {
    return <div>Agent not found</div>
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      {error && <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">{error}</div>}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">{isEditing ? "Edit Agent" : currentAgent.name}</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit
            </button>
          )}
        </div>

        <div className="px-6 py-5">
          {isEditing ? (
            <AgentForm initialValues={currentAgent} onSubmit={handleUpdate} isLoading={isLoading} />
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1 text-sm text-gray-900">{currentAgent.description || "No description"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Framework</h3>
                <p className="mt-1 text-sm text-gray-900">{currentAgent.framework}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Model</h3>
                <p className="mt-1 text-sm text-gray-900">{currentAgent.model}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">System Prompt</h3>
                <div className="mt-1 bg-gray-50 p-3 rounded-md">
                  <pre className="text-sm text-gray-900 whitespace-pre-wrap">{currentAgent.system_prompt}</pre>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Tools</h3>
                {currentAgent.tools && currentAgent.tools.length > 0 ? (
                  <ul className="mt-1 list-disc list-inside text-sm text-gray-900">
                    {currentAgent.tools.map((tool, index) => (
                      <li key={index}>{tool}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-sm text-gray-500">No tools configured</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
