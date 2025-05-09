import { rest } from "msw"
import { setupServer } from "msw/node"
import { API_BASE_URL } from "../../src/api/config"

// Base handlers that can be overridden in specific tests
export const defaultHandlers = [
  // Agent endpoints
  rest.get(`${API_BASE_URL}/agents`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        agents: [
          { id: "1", name: "Test Agent", type: "crewai", status: "active" },
          { id: "2", name: "Another Agent", type: "langchain", status: "inactive" },
        ],
      }),
    )
  }),

  rest.get(`${API_BASE_URL}/agents/:id`, (req, res, ctx) => {
    const { id } = req.params
    return res(
      ctx.status(200),
      ctx.json({
        id,
        name: "Test Agent",
        type: "crewai",
        status: "active",
        config: { model: "gpt-4", temperature: 0.7 },
      }),
    )
  }),

  rest.post(`${API_BASE_URL}/agents`, (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: "3",
        name: "New Agent",
        type: "crewai",
        status: "active",
      }),
    )
  }),

  // Workflow endpoints
  rest.get(`${API_BASE_URL}/workflows`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        workflows: [
          { id: "1", name: "Test Workflow", status: "active" },
          { id: "2", name: "Another Workflow", status: "draft" },
        ],
      }),
    )
  }),

  rest.post(`${API_BASE_URL}/workflows/:id/execute`, (req, res, ctx) => {
    const { id } = req.params
    return res(
      ctx.status(200),
      ctx.json({
        executionId: "exec-123",
        workflowId: id,
        status: "running",
      }),
    )
  }),
]

// Create the server
export const server = setupServer(...defaultHandlers)

// Helper to create custom handlers for specific tests
export const createCustomHandlers = (customHandlers) => {
  server.resetHandlers(...customHandlers)
  return () => server.resetHandlers(...defaultHandlers)
}

// Helper to simulate network errors
export const simulateNetworkError = (url, method = "get") => {
  server.use(
    rest[method](url, (req, res, ctx) => {
      return res.networkError("Failed to connect")
    }),
  )
  return () => server.resetHandlers()
}

// Helper to simulate slow responses
export const simulateSlowResponse = (url, method = "get", delayMs = 3000) => {
  server.use(
    rest[method](url, async (req, res, ctx) => {
      await new Promise((resolve) => setTimeout(resolve, delayMs))
      return res(ctx.status(200), ctx.json({ message: "Delayed response" }))
    }),
  )
  return () => server.resetHandlers()
}
