import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { WorkflowCreatePage } from "../../src/pages/WorkflowCreatePage"
import { BrowserRouter } from "react-router-dom"
import { jest } from "@jest/globals"

// Mock the useNavigate hook
const mockNavigate = jest.fn()
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}))

// Mock the toast function
const mockToast = jest.fn()
jest.mock("@/components/ui/use-toast", () => ({
  toast: (props) => mockToast(props),
}))

describe("Workflow Creation Flow", () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    mockToast.mockClear()
  })

  it("should create a new workflow and navigate to workflows list on success", async () => {
    render(
      <BrowserRouter>
        <WorkflowCreatePage />
      </BrowserRouter>,
    )

    // Fill out workflow details
    await userEvent.type(screen.getByLabelText(/workflow name/i), "Test Workflow")
    await userEvent.type(screen.getByLabelText(/describe what this workflow does/i), "This is a test workflow")

    // Add a step
    const addStepButton = screen.getByRole("button", { name: /add step/i })
    await userEvent.click(addStepButton)

    // Fill out step details
    await userEvent.type(screen.getByLabelText(/step name/i), "Test Step")

    // Select an agent for the step
    const agentSelect = screen.getByLabelText(/agent/i)
    await userEvent.selectOptions(agentSelect, screen.getAllByRole("option")[0].value)

    // Add an output
    const addOutputButton = screen.getByRole("button", { name: /add output/i })
    await userEvent.click(addOutputButton)

    // Save the workflow
    const saveButton = screen.getByRole("button", { name: /save workflow/i })
    await userEvent.click(saveButton)

    // Verify toast was shown
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Workflow created",
        }),
      )
    })

    // Verify navigation occurred
    expect(mockNavigate).toHaveBeenCalledWith("/workflows")
  })
})
