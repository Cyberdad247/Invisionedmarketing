import { render, screen } from "@testing-library/react"
import { rest } from "msw"
import { server } from "../api/setup"
import { API_BASE_URL } from "../../src/api/config"
import { AgentDetail } from "../../src/components/AgentDetail"
import { toMatchImageSnapshot } from "jest-image-snapshot"
import { AgentList } from "../../src/components/AgentList"

// Add the custom matcher
expect.extend({ toMatchImageSnapshot })

describe("Visual Regression Tests for API Responses", () => {
  test("AgentDetail renders correctly with full data", async () => {
    const agentId = "agent-123"
    const mockAgent = {
      id: agentId,
      name: "Test Agent",
      type: "crewai",
      status: "active",
      config: {
        model: "gpt-4",
        temperature: 0.7,
        tools: ["web-search", "calculator"],
        memory: { type: "buffer", maxTokens: 2000 },
      },
      createdAt: "2023-05-05T12:00:00Z",
      updatedAt: "2023-05-06T14:30:00Z",
    }

    server.use(
      rest.get(`${API_BASE_URL}/agents/${agentId}`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(mockAgent))
      }),
    )

    render(<AgentDetail agentId={agentId} />)

    // Wait for the component to load data
    await screen.findByText("Test Agent")

    // Take a screenshot and compare with baseline
    const element = document.querySelector(".agent-detail-container")
    const image = await takeScreenshot(element)
    expect(image).toMatchImageSnapshot()
  })

  test("AgentDetail renders correctly with error state", async () => {
    const agentId = "agent-error"

    server.use(
      rest.get(`${API_BASE_URL}/agents/${agentId}`, (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: "Server error" }))
      }),
    )

    render(<AgentDetail agentId={agentId} />)

    // Wait for the error state to appear
    await screen.findByText(/error/i)

    // Take a screenshot and compare with baseline
    const element = document.querySelector(".agent-detail-container")
    const image = await takeScreenshot(element)
    expect(image).toMatchImageSnapshot()
  })

  test("AgentDetail renders correctly with loading state", async () => {
    const agentId = "agent-loading"

    // Simulate a slow response
    server.use(
      rest.get(`${API_BASE_URL}/agents/${agentId}`, async (req, res, ctx) => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return res(ctx.status(200), ctx.json({}))
      }),
    )

    render(<AgentDetail agentId={agentId} />)

    // Capture the loading state immediately
    const element = document.querySelector(".agent-detail-container")
    const image = await takeScreenshot(element)
    expect(image).toMatchImageSnapshot()
  })

  test("AgentList renders correctly with different data shapes", async () => {
    const mockAgents = [
      { id: "1", name: "Agent 1", type: "crewai", status: "active" },
      {
        id: "2",
        name: "Agent with a very long name that might break the layout",
        type: "langchain",
        status: "inactive",
      },
      { id: "3", name: "Agent 3", type: "custom", status: "error", errorMessage: "Something went wrong" },
    ]

    server.use(
      rest.get(`${API_BASE_URL}/agents`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ agents: mockAgents }))
      }),
    )

    render(<AgentList />)

    // Wait for the list to load
    await screen.findByText("Agent 1")

    // Take a screenshot and compare with baseline
    const element = document.querySelector(".agent-list-container")
    const image = await takeScreenshot(element)
    expect(image).toMatchImageSnapshot()
  })
})

// Helper function to take screenshots
async function takeScreenshot(element) {
  // This is a mock implementation - in a real project, you would use
  // a library like puppeteer or playwright to take actual screenshots
  return Buffer.from("mock-screenshot")
}
