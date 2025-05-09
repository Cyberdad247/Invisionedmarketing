"use client"

import { render, screen, fireEvent, waitFor } from "../utils/test-utils"
import { AgentForm } from "../../src/components/AgentForm"

describe("AgentForm", () => {
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders correctly with default values", () => {
    render(<AgentForm onSubmit={mockOnSubmit} isLoading={false} />)

    // Check if form elements are rendered
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/framework/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/model/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/system prompt/i)).toBeInTheDocument()

    // Default values check
    expect(screen.getByLabelText(/name/i)).toHaveValue("")
    expect(screen.getByLabelText(/system prompt/i)).toHaveValue("")
  })

  it("renders with initial values when provided", () => {
    const initialValues = {
      name: "Test Agent",
      description: "Test Description",
      framework: "crewai",
      model: "claude-3-opus",
      system_prompt: "You are a test agent",
      tools: [],
      parameters: {},
    }

    render(<AgentForm initialValues={initialValues} onSubmit={mockOnSubmit} isLoading={false} />)

    expect(screen.getByLabelText(/name/i)).toHaveValue("Test Agent")
    expect(screen.getByLabelText(/description/i)).toHaveValue("Test Description")
    expect(screen.getByLabelText(/system prompt/i)).toHaveValue("You are a test agent")
  })

  it("calls onSubmit with form values when submitted", async () => {
    render(<AgentForm onSubmit={mockOnSubmit} isLoading={false} />)

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "New Agent" } })
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: "New Description" } })
    fireEvent.change(screen.getByLabelText(/system prompt/i), { target: { value: "New System Prompt" } })

    // Submit the form
    fireEvent.submit(screen.getByRole("button", { name: /create agent/i }))

    // Check if onSubmit was called with the correct values
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1)
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: "New Agent",
        description: "New Description",
        framework: "smol",
        model: "gpt-4o",
        system_prompt: "New System Prompt",
        tools: [],
        parameters: {},
      })
    })
  })

  it("disables the submit button when isLoading is true", () => {
    render(<AgentForm onSubmit={mockOnSubmit} isLoading={true} />)

    expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled()
  })
})
