import { rest } from "msw"
import { server } from "./setup"
import { API_BASE_URL } from "../../src/api/config"
import { createAgent, updateAgent, getAgent } from "../../src/api/agent"

describe("Agent API Request Formatting", () => {
  // Spy on request headers and body
  let requestHeaders = {}
  let requestBody = {}
  let requestParams = {}

  beforeEach(() => {
    // Reset captured request data
    requestHeaders = {}
    requestBody = {}
    requestParams = {}

    // Set up handlers to capture request data
    server.use(
      rest.post(`${API_BASE_URL}/agents`, (req, res, ctx) => {
        requestHeaders = req.headers.getAllHeaders()
        requestBody = req.body
        return res(ctx.status(201), ctx.json({ id: "new-id" }))
      }),

      rest.put(`${API_BASE_URL}/agents/:id`, (req, res, ctx) => {
        requestHeaders = req.headers.getAllHeaders()
        requestBody = req.body
        requestParams = req.params
        return res(ctx.status(200), ctx.json({ id: req.params.id }))
      }),

      rest.get(`${API_BASE_URL}/agents/:id`, (req, res, ctx) => {
        requestHeaders = req.headers.getAllHeaders()
        requestParams = req.params
        return res(ctx.status(200), ctx.json({ id: req.params.id }))
      }),
    )
  })

  test("createAgent sends correctly formatted request", async () => {
    const agentData = {
      name: "Test Agent",
      type: "crewai",
      config: { model: "gpt-4", temperature: 0.7 },
    }

    await createAgent(agentData)

    // Check headers
    expect(requestHeaders["content-type"]).toContain("application/json")
    expect(requestHeaders["authorization"]).toBeDefined()

    // Check body
    expect(requestBody).toEqual(agentData)
  })

  test("updateAgent sends correctly formatted request with ID in URL", async () => {
    const agentId = "agent-123"
    const agentData = {
      name: "Updated Agent",
      config: { model: "gpt-3.5-turbo", temperature: 0.5 },
    }

    await updateAgent(agentId, agentData)

    // Check headers
    expect(requestHeaders["content-type"]).toContain("application/json")
    expect(requestHeaders["authorization"]).toBeDefined()

    // Check body
    expect(requestBody).toEqual(agentData)

    // Check params
    expect(requestParams.id).toBe(agentId)
  })

  test("getAgent sends correctly formatted request with ID in URL", async () => {
    const agentId = "agent-123"

    await getAgent(agentId)

    // Check headers
    expect(requestHeaders["authorization"]).toBeDefined()

    // Check params
    expect(requestParams.id).toBe(agentId)
  })

  test("createAgent includes custom headers when provided", async () => {
    const agentData = { name: "Test Agent" }
    const customHeaders = { "x-custom-header": "custom-value" }

    await createAgent(agentData, customHeaders)

    expect(requestHeaders["x-custom-header"]).toBe("custom-value")
  })
})
