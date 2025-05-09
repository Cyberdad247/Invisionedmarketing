import { render, screen } from "../../utils/test-utils"
import { CrewWorkflowVisualizer } from "../../../components/crew/crew-workflow-visualizer"

// Mock the canvas implementations
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  clearRect: jest.fn(),
  beginPath: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  stroke: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  fillText: jest.fn(),
  setLineDash: jest.fn(),
}))

describe("CrewWorkflowVisualizer", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()

    // Mock fetch for the workflow data
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 1,
            name: "Test Workflow",
            description: "Test description",
            process: "sequential",
            agents: [
              { id: 1, name: "Agent 1", role: "Role 1" },
              { id: 2, name: "Agent 2", role: "Role 2" },
            ],
            tasks: [
              { description: "Task 1", agent_index: 0, expected_output: "Output 1" },
              { description: "Task 2", agent_index: 1, expected_output: "Output 2" },
            ],
          }),
      }),
    ) as jest.Mock
  })

  it("renders the workflow visualizer with loading state initially", () => {
    render(<CrewWorkflowVisualizer workflowId="1" />)

    // Check for loading indicator elements
    const skeletons = document.querySelectorAll(".skeleton")
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it("displays the workflow information after loading", async () => {
    render(<CrewWorkflowVisualizer workflowId="1" />)

    // Wait for the content to load
    const workflowTitle = await screen.findByText("Content Creation Pipeline")
    expect(workflowTitle).toBeInTheDocument()

    // Check for workflow tabs
    expect(screen.getByText("Workflow Graph")).toBeInTheDocument()
    expect(screen.getByText("Execution Logs")).toBeInTheDocument()

    // Check for the run workflow button
    expect(screen.getByText("Run Workflow")).toBeInTheDocument()
  })
})
