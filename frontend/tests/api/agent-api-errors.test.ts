import { rest } from "msw"
import { server, simulateNetworkError } from "./setup"
import { API_BASE_URL } from "../../src/api/config"
import { getAgents, getAgent, createAgent, updateAgent, deleteAgent, testAgent } from "../../src/api/agent"

describe("Agent API Error Handling", () => {
  test("getAgents handles 404 error correctly", async () => {
    server.use(
      rest.get(`${API_BASE_URL}/agents`, (req, res, ctx) => {
        return res(ctx.status(404), ctx.json({ message: "Resource not found" }))
      }),
    )

    await expect(getAgents()).rejects.toThrow("Resource not found")
  })

  test("getAgent handles 404 error correctly", async () => {
    const agentId = "non-existent-agent"

    server.use(
      rest.get(`${API_BASE_URL}/agents/${agentId}`, (req, res, ctx) => {
        return res(ctx.status(404), ctx.json({ message: "Agent not found" }))
      }),
    )

    await expect(getAgent(agentId)).rejects.toThrow("Agent not found")
  })

  test("createAgent handles validation error correctly", async () => {
    const invalidData = { name: "" } // Missing required fields

    server.use(
      rest.post(`${API_BASE_URL}/agents`, (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            message: "Validation error",
            errors: ["Name is required", "Type is required"],
          }),
        )
      }),
    )

    await expect(createAgent(invalidData)).rejects.toThrow("Validation error")
  })

  test("updateAgent handles 403 forbidden error correctly", async () => {
    const agentId = "protected-agent"

    server.use(
      rest.put(`${API_BASE_URL}/agents/${agentId}`, (req, res, ctx) => {
        return res(ctx.status(403), ctx.json({ message: "You do not have permission to update this agent" }))
      }),
    )

    await expect(updateAgent(agentId, { name: "New Name" })).rejects.toThrow(
      "You do not have permission to update this agent",
    )
  })

  test("deleteAgent handles 500 server error correctly", async () => {
    const agentId = "agent-123"

    server.use(
      rest.delete(`${API_BASE_URL}/agents/${agentId}`, (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: "Internal server error" }))
      }),
    )

    await expect(deleteAgent(agentId)).rejects.toThrow("Internal server error")
  })

  test("testAgent handles timeout error correctly", async () => {
    const agentId = "agent-123"

    server.use(
      rest.post(`${API_BASE_URL}/agents/${agentId}/test`, (req, res, ctx) => {
        return res(ctx.status(504), ctx.json({ message: "Request timeout" }))
      }),
    )

    await expect(testAgent(agentId, { query: "test" })).rejects.toThrow("Request timeout")
  })

  test("getAgents handles network error correctly", async () => {
    const resetHandlers = simulateNetworkError(`${API_BASE_URL}/agents`)

    await expect(getAgents()).rejects.toThrow("Network error")

    resetHandlers()
  })

  test("handles malformed JSON response", async () => {
    const agentId = "agent-123"

    server.use(
      rest.get(`${API_BASE_URL}/agents/${agentId}`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.body('{"malformed json'))
      }),
    )

    await expect(getAgent(agentId)).rejects.toThrow()
  })

  test("handles unexpected response structure", async () => {
    server.use(
      rest.get(`${API_BASE_URL}/agents`, (req, res, ctx) => {
        // Missing the expected 'agents' array
        return res(ctx.status(200), ctx.json({ data: [] }))
      }),
    )

    await expect(getAgents()).rejects.toThrow("Unexpected response structure")
  })
})
