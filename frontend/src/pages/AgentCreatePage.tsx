"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { AgentForm } from "../components/AgentForm"
import { useAgentStore } from "../state/agent"
import type { AgentCreate } from "../types/agent"

export const AgentCreatePage: React.FC = () => {
  const { createAgent, isLoading, error } = useAgentStore()
  const navigate = useNavigate()

  const handleSubmit = async (values: AgentCreate) => {
    try {
      await createAgent(values)
      navigate("/agents")
    } catch (err) {
      // Error is handled by the store
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Create New Agent</h1>

      {error && <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">{error}</div>}

      <div className="bg-white shadow rounded-lg p-6">
        <AgentForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  )
}
