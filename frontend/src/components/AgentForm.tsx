"use client"

import type React from "react"
import { useState } from "react"
import type { AgentCreate, AgentUpdate } from "../types/agent"

interface AgentFormProps {
  initialValues?: AgentUpdate
  onSubmit: (values: AgentCreate | AgentUpdate) => void
  isLoading: boolean
}

export const AgentForm: React.FC<AgentFormProps> = ({ initialValues, onSubmit, isLoading }) => {
  const [values, setValues] = useState<AgentCreate | AgentUpdate>({
    name: initialValues?.name || "",
    description: initialValues?.description || "",
    framework: initialValues?.framework || "smol",
    model: initialValues?.model || "gpt-4o",
    system_prompt: initialValues?.system_prompt || "",
    tools: initialValues?.tools || [],
    parameters: initialValues?.parameters || {},
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={values.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={values.description || ""}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="framework" className="block text-sm font-medium text-gray-700">
          Framework
        </label>
        <select
          id="framework"
          name="framework"
          value={values.framework}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="smol">SmolAgent</option>
          <option value="crewai">CrewAI</option>
          <option value="langgraph">LangGraph</option>
        </select>
      </div>

      <div>
        <label htmlFor="model" className="block text-sm font-medium text-gray-700">
          Model
        </label>
        <select
          id="model"
          name="model"
          value={values.model}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="gpt-4o">GPT-4o</option>
          <option value="claude-3-opus">Claude 3 Opus</option>
          <option value="claude-3-sonnet">Claude 3 Sonnet</option>
          <option value="gemini-pro">Gemini Pro</option>
        </select>
      </div>

      <div>
        <label htmlFor="system_prompt" className="block text-sm font-medium text-gray-700">
          System Prompt
        </label>
        <textarea
          id="system_prompt"
          name="system_prompt"
          value={values.system_prompt}
          onChange={handleChange}
          required
          rows={5}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {isLoading ? "Saving..." : initialValues ? "Update Agent" : "Create Agent"}
        </button>
      </div>
    </form>
  )
}
