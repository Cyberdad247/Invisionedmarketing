import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { CrewWorkflowPage } from "../../src/pages/CrewWorkflowPage"

describe("Workflow Execution Flow", () => {
  it("should create and execute a workflow", async () => {
    render(<CrewWorkflowPage />)

    // Step 1: Configure the workflow
    await userEvent.type(screen.getByLabelText(/workflow name/i), "Test Workflow")
    await userEvent.type(screen.getByLabelText(/description/i), "This is a test workflow for integration testing")

    // Add a task
    const addTaskButton = screen.getByRole("button", { name: /add task/i })
    await userEvent.click(addTaskButton)

    // Fill out task details
    await userEvent.type(screen.getByLabelText(/task 1.*description/i), "Research the topic")

    // Select an agent for the task
    const agentSelect = screen.getByLabelText(/assigned agent/i)
    await userEvent.selectOptions(agentSelect, "0") // First agent

    // Create the workflow
    const createButton = screen.getByRole("button", { name: /create workflow/i })
    await userEvent.click(createButton)

    // Step 2: Verify we moved to the visualize tab
    await waitFor(() => {
      expect(screen.getByText(/visualize/i)).toBeInTheDocument()
    })

    // Step 3: Move to execute tab
    const executeTab = screen.getByRole("tab", { name: /execute/i })
    await userEvent.click(executeTab)

    // Step 4: Run the workflow
    const runButton = screen.getByRole("button", { name: /run workflow/i })
    await userEvent.click(runButton)

    // Verify execution started
    expect(screen.getByText(/running/i)).toBeInTheDocument()

    // Wait for execution to complete
    await waitFor(
      () => {
        expect(screen.getByText(/workflow execution completed successfully/i)).toBeInTheDocument()
      },
      { timeout: 10000 },
    )

    // Verify we have execution results
    expect(screen.getByText(/result/i)).toBeInTheDocument()
    expect(screen.getByText(/final output/i)).toBeInTheDocument()
  })
})
