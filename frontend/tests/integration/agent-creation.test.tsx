import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { AgentCreatePage } from "../../src/pages/AgentCreatePage"
import { BrowserRouter } from "react-router-dom"
import { AgentStoreProvider } from "../../src/state/agent"

// Mock the useNavigate hook
const mockNavigate = jest.fn()
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}))

describe("Agent Creation Flow", () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it("should create a new agent and navigate to agents list on success", async () => {
    render(
      <BrowserRouter>
        <AgentStoreProvider>
          <AgentCreatePage />
        </AgentStoreProvider>
      </BrowserRouter>,
    )

    // Fill out the form
    await userEvent.type(screen.getByLabelText(/name/i), "Test Agent")
    await userEvent.type(screen.getByLabelText(/description/i), "This is a test agent")

    // Select framework
    const frameworkSelect = screen.getByLabelText(/framework/i)
    await userEvent.selectOptions(frameworkSelect, "crewai")

    // Select model
    const modelSelect = screen.getByLabelText(/model/i)
    await userEvent.selectOptions(modelSelect, "claude-3-opus")

    // Enter system prompt
    await userEvent.type(screen.getByLabelText(/system prompt/i), "You are a test agent designed to help with testing.")

    // Submit the form
    const submitButton = screen.getByRole("button", { name: /create agent/i })
    await userEvent.click(submitButton)

    // Verify navigation occurred after successful submission
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/agents")
    })
  })

  it("should display validation errors when form is incomplete", async () => {
    render(
      <BrowserRouter>
        <AgentStoreProvider>
          <AgentCreatePage />
        </AgentStoreProvider>
      </BrowserRouter>,
    )

    // Submit without filling required fields
    const submitButton = screen.getByRole("button", { name: /create agent/i })
    await userEvent.click(submitButton)

    // Check that navigation didn't occur
    expect(mockNavigate).not.toHaveBeenCalled()

    // Verify validation messages are shown
    expect(screen.getByText(/name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/system prompt is required/i)).toBeInTheDocument()
  })
})
