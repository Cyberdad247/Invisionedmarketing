import { rest } from "msw"
import { server } from "./setup"
import { API_BASE_URL } from "../../src/api/config"
import { getAgents, getAgent, createAgent, updateAgent, deleteAgent, testAgent } from "../../src/api/agent"

describe("Agent API Success Scenarios", () => {
  test("getAgents successfully retrieves and formats agent list", async () => {
    const mockAgents = [
      { id: "1", name: "Agent 1", type: "crewai", status: "active" },
      { id: "2", name: "Agent 2", type: "langchain", status: "inactive" },
    ]

    server.use(
      rest.get(`${API_BASE_URL}/agents`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ agents: mockAgents }))
      }),
    )

    const result = await getAgents()

    expect(result).toEqual(mockAgents)
    expect(result.length).toBe(2)
    expect(result[0].id).toBe("1")
  })

  test("getAgent successfully retrieves and formats a single agent", async () => {
    const agentId = "agent-123"
    const mockAgent = {
      id: agentId,
      name: "Test Agent",
      type: "crewai",
      status: "active",
      config: { model: "gpt-4", temperature: 0.7 },
    }

    server.use(
      rest.get(`${API_BASE_URL}/agents/${agentId}`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(mockAgent))
      }),
    )

    const result = await getAgent(agentId)

    expect(result).toEqual(mockAgent)
    expect(result.id).toBe(agentId)
    expect(result.config.model).toBe("gpt-4")
  })

  test("createAgent successfully creates and returns the new agent", async () => {
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

    const result = await createAgent(newAgentData)

    expect(result).toEqual(mockResponse)
    expect(result.id).toBe("new-agent-id")
    expect(result.status).toBe("active")
  })

  test("updateAgent successfully updates and returns the updated agent", async () => {
    const agentId = "agent-123"
    const updateData = {
      name: "Updated Agent",
      config: { model: "gpt-3.5-turbo", temperature: 0.5 },
    }

    const mockResponse = {
      id: agentId,
      name: "Updated Agent",
      type: "crewai",
      status: "active",
      config: { model: "gpt-3.5-turbo", temperature: 0.5 },
      updatedAt: "2023-05-05T12:00:00Z",
    }

    server.use(
      rest.put(`${API_BASE_URL}/agents/${agentId}`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(mockResponse))
      }),
    )

    const result = await updateAgent(agentId, updateData)

    expect(result).toEqual(mockResponse)
    expect(result.name).toBe("Updated Agent")
    expect(result.config.model).toBe("gpt-3.5-turbo")
  })

  test("deleteAgent successfully deletes an agent", async () => {
    const agentId = "agent-123"

    server.use(
      rest.delete(`${API_BASE_URL}/agents/${agentId}`, (req, res, ctx) => {
        return res(ctx.status(204))
      }),
    )

    const result = await deleteAgent(agentId)

    expect(result).toBe(true)
  })

  test("testAgent successfully tests an agent and returns results", async () => {
    const agentId = "agent-123"
    const testInput = { query: "What is the weather?" }

    const mockResponse = {
      id: "test-run-123",
      agentId,
      input: testInput,
      output: "The weather is sunny with a high of 75°F.",
      status: "completed",
      executionTime: 1.5,
    }

    server.use(
      rest.post(`${API_BASE_URL}/agents/${agentId}/test`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(mockResponse))
      }),
    )

    const result = await testAgent(agentId, testInput)

    expect(result).toEqual(mockResponse)
    expect(result.output).toBe("The weather is sunny with a high of 75°F.")
    expect(result.status).toBe("completed")
  })
})
