import { act, renderHook } from "@testing-library/react"
import { useAgentStore } from "../../src/state/agent"
import { agentApi } from "../../src/api/agent"

// Mock the agent API
jest.mock("../../src/api/agent", () => ({
  agentApi: {
    getAgents: jest.fn(),
    getAgent: jest.fn(),
    createAgent: jest.fn(),
    updateAgent: jest.fn(),
    deleteAgent: jest.fn(),
    runAgent: jest.fn(),
  },
}))

describe("useAgentStore", () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks()

    // Reset the store
    const { result } = renderHook(() => useAgentStore())
    act(() => {
      result.current.agents = []
      result.current.currentAgent = null
      result.current.isLoading = false
      result.current.error = null
    })
  })

  it("initializes with default values", () => {
    const { result } = renderHook(() => useAgentStore())

    expect(result.current.agents).toEqual([])
    expect(result.current.currentAgent).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it("fetches agents successfully", async () => {
    const mockAgents = [
      { id: "1", name: "Agent 1", framework: "smol", model: "gpt-4o", system_prompt: "Prompt 1" },
      { id: "2", name: "Agent 2", framework: "crewai", model: "claude-3", system_prompt: "Prompt 2" },
    ](
      // Setup the mock to return our test agents
      agentApi.getAgents as jest.Mock,
    ).mockResolvedValue(mockAgents)

    const { result } = renderHook(() => useAgentStore())

    // Initially, there are no agents
    expect(result.current.agents).toEqual([])

    // Call fetchAgents
    await act(async () => {
      await result.current.fetchAgents()
    })

    // Check loading state during the fetch
    expect(result.current.isLoading).toBe(false)

    // Check the agents after fetch
    expect(result.current.agents).toEqual(mockAgents)
    expect(result.current.error).toBeNull()

    // Verify that the API was called
    expect(agentApi.getAgents).toHaveBeenCalledTimes(1)
  })

  it("handles fetch agents error", async () => {
    const errorMessage = "Network error"(
      // Setup the mock to throw an error
      agentApi.getAgents as jest.Mock,
    ).mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useAgentStore())

    // Call fetchAgents
    await act(async () => {
      await result.current.fetchAgents()
    })

    // Check the state after error
    expect(result.current.agents).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(errorMessage)
  })

  it("creates an agent successfully", async () => {
    const newAgent = {
      name: "New Agent",
      description: "Description",
      framework: "smol",
      model: "gpt-4o",
      system_prompt: "You are a helpful agent",
      tools: [],
      parameters: {},
    }

    const createdAgent = {
      ...newAgent,
      id: "3",
    }(
      // Setup the mock to return our created agent
      agentApi.createAgent as jest.Mock,
    ).mockResolvedValue(createdAgent)

    const { result } = renderHook(() => useAgentStore())

    // Call createAgent
    await act(async () => {
      await result.current.createAgent(newAgent)
    })

    // Check the state after creation
    expect(result.current.agents).toEqual([createdAgent])
    expect(result.current.currentAgent).toEqual(createdAgent)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()

    // Verify that the API was called with the right arguments
    expect(agentApi.createAgent).toHaveBeenCalledTimes(1)
    expect(agentApi.createAgent).toHaveBeenCalledWith(newAgent)
  })
})
