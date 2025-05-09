import { act, renderHook } from "@testing-library/react-hooks"
import { rest } from "msw"
import { server } from "../api/setup"
import { API_BASE_URL } from "../../src/api/config"
import { useAgentStore } from "../../src/state/agent"

describe("Agent State with API Interactions", () => {
  beforeEach(() => {
    // Reset the store before each test
    const { result } = renderHook(() => useAgentStore())
    act(() => {
      result.current.reset()
    })
  })

  test("fetchAgents updates state with API response", async () => {
    const mockAgents = [
      { id: "1", name: "Agent 1", type: "crewai", status: "active" },
      { id: "2", name: "Agent 2", type: "langchain", status: "inactive" },
    ]

    server.use(
      rest.get(`${API_BASE_URL}/agents`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ agents: mockAgents }))
      }),
    )

    const { result, waitForNextUpdate } = renderHook(() => useAgentStore())

    act(() => {
      result.current.fetchAgents()
    })

    await waitForNextUpdate()

    expect(result.current.agents).toEqual(mockAgents)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  test("fetchAgents sets error state when API fails", async () => {
    server.use(
      rest.get(`${API_BASE_URL}/agents`, (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: "Server error" }))
      }),
    )

    const { result, waitForNextUpdate } = renderHook(() => useAgentStore())

    act(() => {
      result.current.fetchAgents()
    })

    await waitForNextUpdate()

    expect(result.current.agents).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe("Server error")
  })

  test("createAgent updates state with new agent", async () => {
    const newAgentData = {
      name: "New Agent",
      type: "crewai",
      config: { model: "gpt-4", temperature: 0.7 },
    }

    const mockResponse = {
      id: "new-agent-id",
      ...newAgentData,
      status: "active",
      createdAt: "2023-05-05T12:00:00Z",
    }

    server.use(
      rest.post(`${API_BASE_URL}/agents`, (req, res, ctx) => {
        return res(ctx.status(201), ctx.json(mockResponse))
      }),
    )

    const { result, waitForNextUpdate } = renderHook(() => useAgentStore())

    act(() => {
      result.current.createAgent(newAgentData)
    })

    await waitForNextUpdate()

    expect(result.current.agents).toContainEqual(mockResponse)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  test("updateAgent updates the correct agent in state", async () => {
    // Setup initial state with agents
    const initialAgents = [
      { id: "agent-123", name: "Original Name", type: "crewai", status: "active" },
      { id: "agent-456", name: "Another Agent", type: "langchain", status: "inactive" },
    ]

    const { result } = renderHook(() => useAgentStore())
    act(() => {
      result.current.setAgents(initialAgents)
    })

    // Setup update data and mock response
    const agentId = "agent-123"
    const updateData = { name: "Updated Name" }

    const mockResponse = {
      id: agentId,
      name: "Updated Name",
      type: "crewai",
      status: "active",
      updatedAt: "2023-05-05T12:00:00Z",
    }

    server.use(
      rest.put(`${API_BASE_URL}/agents/${agentId}`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(mockResponse))
      }),
    )

    // Call updateAgent
    act(() => {
      result.current.updateAgent(agentId, updateData)
    })

    // Wait for the async action to complete
    await new Promise((resolve) => setTimeout(resolve, 0))

    // Verify state was updated correctly
    expect(result.current.agents.find((a) => a.id === agentId)?.name).toBe("Updated Name")
    expect(result.current.agents.length).toBe(2) // Make sure we didn't add or remove agents
  })

  test("deleteAgent removes the agent from state", async () => {
    // Setup initial state with agents
    const initialAgents = [
      { id: "agent-123", name: "Agent to Delete", type: "crewai", status: "active" },
      { id: "agent-456", name: "Keep this Agent", type: "langchain", status: "inactive" },
    ]

    const { result } = renderHook(() => useAgentStore())
    act(() => {
      result.current.setAgents(initialAgents)
    })

    const agentId = "agent-123"

    server.use(
      rest.delete(`${API_BASE_URL}/agents/${agentId}`, (req, res, ctx) => {
        return res(ctx.status(204))
      }),
    )

    // Call deleteAgent
    act(() => {
      result.current.deleteAgent(agentId)
    })

    // Wait for the async action to complete
    await new Promise((resolve) => setTimeout(resolve, 0))

    // Verify agent was removed
    expect(result.current.agents.length).toBe(1)
    expect(result.current.agents[0].id).toBe("agent-456")
    expect(result.current.agents.find((a) => a.id === agentId)).toBeUndefined()
  })
})
