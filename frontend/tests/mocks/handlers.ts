import { rest } from "msw"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Sample data
const agents = [
  {
    id: "1",
    name: "Content Writer",
    description: "Creates engaging content",
    framework: "smol",
    model: "gpt-4o",
    system_prompt: "You are a content writer who creates engaging blog posts.",
    tools: [],
    parameters: {},
  },
  {
    id: "2",
    name: "Data Analyst",
    description: "Analyzes data and creates reports",
    framework: "crewai",
    model: "claude-3-opus",
    system_prompt: "You are a data analyst who analyzes data and creates reports.",
    tools: ["search", "calculator"],
    parameters: { temperature: 0.7 },
  },
]

const workflows = [
  {
    id: "1",
    name: "Content Creation",
    description: "Create and publish content",
    process: "sequential",
    agents: [
      {
        name: "Researcher",
        role: "Research Specialist",
        goal: "Find accurate information",
        backstory: "You are an expert researcher with access to vast knowledge.",
        model: "gpt-4o",
        verbose: true,
        allow_delegation: false,
        tools: [{ name: "search", description: "Search for information on the web." }],
        temperature: 0.7,
        max_tokens: 1500,
      },
      {
        name: "Writer",
        role: "Content Creator",
        goal: "Create engaging content",
        backstory: "You are a skilled writer who can create compelling content.",
        model: "gpt-4o",
        verbose: true,
        allow_delegation: false,
        tools: [],
        temperature: 0.8,
        max_tokens: 2000,
      },
    ],
    tasks: [
      {
        description: "Research the topic",
        agent_index: 0,
        expected_output: "Research findings",
      },
      {
        description: "Write the content",
        agent_index: 1,
        expected_output: "Draft content",
      },
    ],
  },
]

export const handlers = [
  // Agents API
  rest.get(`${API_URL}/agents`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(agents))
  }),

  rest.get(`${API_URL}/agents/:id`, (req, res, ctx) => {
    const { id } = req.params
    const agent = agents.find((a) => a.id === id)
    if (!agent) {
      return res(ctx.status(404), ctx.json({ message: "Agent not found" }))
    }
    return res(ctx.status(200), ctx.json(agent))
  }),

  rest.post(`${API_URL}/agents`, async (req, res, ctx) => {
    const newAgent = await req.json()
    return res(
      ctx.status(201),
      ctx.json({
        id: "new-agent-id",
        ...newAgent,
      }),
    )
  }),

  rest.put(`${API_URL}/agents/:id`, async (req, res, ctx) => {
    const { id } = req.params
    const updatedAgent = await req.json()
    return res(
      ctx.status(200),
      ctx.json({
        id,
        ...updatedAgent,
      }),
    )
  }),

  rest.delete(`${API_URL}/agents/:id`, (req, res, ctx) => {
    return res(ctx.status(204))
  }),

  rest.post(`${API_URL}/agents/:id/run`, async (req, res, ctx) => {
    const input = await req.json()
    return res(
      ctx.status(200),
      ctx.json({
        result: `Processed input: ${JSON.stringify(input)}`,
        execution_time: 2.5,
      }),
    )
  }),

  // Workflows API
  rest.get(`${API_URL}/workflows`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(workflows))
  }),

  rest.get(`${API_URL}/workflows/:id`, (req, res, ctx) => {
    const { id } = req.params
    const workflow = workflows.find((w) => w.id === id)
    if (!workflow) {
      return res(ctx.status(404), ctx.json({ message: "Workflow not found" }))
    }
    return res(ctx.status(200), ctx.json(workflow))
  }),

  rest.post(`${API_URL}/workflows`, async (req, res, ctx) => {
    const newWorkflow = await req.json()
    return res(
      ctx.status(201),
      ctx.json({
        id: "new-workflow-id",
        ...newWorkflow,
      }),
    )
  }),

  rest.post(`${API_URL}/workflows/:id/run`, async (req, res, ctx) => {
    const input = await req.json()
    return res(
      ctx.status(200),
      ctx.json({
        id: "execution-id",
        status: "completed",
        result: "Workflow executed successfully",
        logs: ["Starting workflow execution", "Task 1 completed", "Task 2 completed", "Workflow execution completed"],
      }),
    )
  }),
]
