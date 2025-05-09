import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { AgentTestInterface } from "../../components/agent-test-interface"

// Mock the agent data
const mockAgent = {
  id: "test-agent-id",
  name: "Test Agent",
  description: "Agent for testing",
  framework: "smol",
  model: "gpt-4o",
  system_prompt: "You are a test agent.",
  tools: [],
  parameters: {},
}

describe("Agent Testing Flow", () => {
  it("should allow testing an agent with input and show results", async () => {
    render(<AgentTestInterface agent={mockAgent} />)

    // Enter test input
    await userEvent.type(screen.getByLabelText(/input/i), "This is a test input for the agent")

    // Run the test
    const runButton = screen.getByRole("button", { name: /run test/i })
    await userEvent.click(runButton)

    // Verify loading state
    expect(screen.getByText(/running/i)).toBeInTheDocument()

    // Wait for results
    await waitFor(() => {
      expect(screen.getByText(/test results/i)).toBeInTheDocument()
    })

    // Verify results are displayed
    expect(screen.getByText(/processed input/i)).toBeInTheDocument()

    // Verify execution metrics are shown
    expect(screen.getByText(/execution time/i)).toBeInTheDocument()
  })

  it("should handle errors during agent testing", async () => {
    // Mock the fetch to return an error
    global.fetch = jest.fn().mockImplementationOnce(() => Promise.reject(new Error("API Error")))

    render(<AgentTestInterface agent={mockAgent} />)

    // Enter test input
    await userEvent.type(screen.getByLabelText(/input/i), "This will cause an error")

    // Run the test
    const runButton = screen.getByRole("button", { name: /run test/i })
    await userEvent.click(runButton)

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/error occurred/i)).toBeInTheDocument()
    })
  })
})
