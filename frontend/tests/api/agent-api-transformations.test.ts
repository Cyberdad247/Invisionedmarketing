import { rest } from "msw"
import { server } from "./setup"
import { API_BASE_URL } from "../../src/api/config"
import { getAgents, getAgent, getAgentExecutions, getWorkflowsForAgent } from "../../src/api/agent"

describe("Agent API Response Transformations", () => {
  test("getAgents transforms raw API response to frontend format", async () => {
    // Raw API response format
    const rawApiResponse = {
      data: {
        items: [
          {
            agent_id: "1",
            agent_name: "Test Agent",
            agent_type: "crewai",
            agent_status: "active",
            created_at: "2023-05-05T12:00:00Z",
          },
          {
            agent_id: "2",
            agent_name: "Another Agent",
            agent_type: "langchain",
            agent_status: "inactive",
            created_at: "2023-05-04T10:00:00Z",
          },
        ],
        total: 2,
        page: 1,
        page_size: 10,
      },
    }

    // Expected transformed format
    const expectedTransformedData = [
      {
        id: "1",
        name: "Test Agent",
        type: "crewai",
        status: "active",
        createdAt: "2023-05-05T12:00:00Z",
      },
      {
        id: "2",
        name: "Another Agent",
        type: "langchain",
        status: "inactive",
        createdAt: "2023-05-04T10:00:00Z",
      },
    ]

    server.use(
      rest.get(`${API_BASE_URL}/agents`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(rawApiResponse))
      }),
    )

    const result = await getAgents()

    expect(result).toEqual(expectedTransformedData)
    expect(result[0].id).toBe("1")
    expect(result[0].name).toBe("Test Agent")
    expect(result[0].createdAt).toBe("2023-05-05T12:00:00Z")
  })

  test("getAgent transforms raw API response to frontend format", async () => {
    const agentId = "agent-123"

    // Raw API response format
    const rawApiResponse = {
      agent_id: agentId,
      agent_name: "Test Agent",
      agent_type: "crewai",
      agent_status: "active",
      agent_config: {
        llm: {
          model_name: "gpt-4",
          temperature: 0.7,
          max_tokens: 1000,
        },
        tools: ["web-search", "calculator"],
        memory: {
          type: "buffer",
          max_tokens: 2000,
        },
      },
      created_at: "2023-05-05T12:00:00Z",
      updated_at: "2023-05-06T14:30:00Z",
    }

    // Expected transformed format
    const expectedTransformedData = {
      id: agentId,
      name: "Test Agent",
      type: "crewai",
      status: "active",
      config: {
        model: "gpt-4",
        temperature: 0.7,
        maxTokens: 1000,
        tools: ["web-search", "calculator"],
        memory: {
          type: "buffer",
          maxTokens: 2000,
        },
      },
      createdAt: "2023-05-05T12:00:00Z",
      updatedAt: "2023-05-06T14:30:00Z",
    }

    server.use(
      rest.get(`${API_BASE_URL}/agents/${agentId}`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(rawApiResponse))
      }),
    )

    const result = await getAgent(agentId)

    expect(result).toEqual(expectedTransformedData)
    expect(result.config.model).toBe("gpt-4")
    expect(result.config.tools).toContain("calculator")
  })

  test("getAgentExecutions transforms execution history correctly", async () => {
    const agentId = "agent-123"

    // Raw API response format
    const rawApiResponse = {
      executions: [
        {
          execution_id: "exec-1",
          agent_id: agentId,
          status: "completed",
          input_data: { query: "What is AI?" },
          output_data: { response: "AI is artificial intelligence..." },
          start_time: "2023-05-05T12:00:00Z",
          end_time: "2023-05-05T12:00:10Z",
          execution_time_ms: 10000,
        },
        {
          execution_id: "exec-2",
          agent_id: agentId,
          status: "failed",
          input_data: { query: "Complex question" },
          error: "Execution timed out",
          start_time: "2023-05-06T13:00:00Z",
          end_time: "2023-05-06T13:01:00Z",
          execution_time_ms: 60000,
        },
      ],
      total: 2,
      page: 1,
    }

    // Expected transformed format
    const expectedTransformedData = [
      {
        id: "exec-1",
        agentId: agentId,
        status: "completed",
        input: { query: "What is AI?" },
        output: { response: "AI is artificial intelligence..." },
        startTime: "2023-05-05T12:00:00Z",
        endTime: "2023-05-05T12:00:10Z",
        executionTimeMs: 10000,
        error: null,
      },
      {
        id: "exec-2",
        agentId: agentId,
        status: "failed",
        input: { query: "Complex question" },
        output: null,
        startTime: "2023-05-06T13:00:00Z",
        endTime: "2023-05-06T13:01:00Z",
        executionTimeMs: 60000,
        error: "Execution timed out",
      },
    ]

    server.use(
      rest.get(`${API_BASE_URL}/agents/${agentId}/executions`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(rawApiResponse))
      }),
    )

    const result = await getAgentExecutions(agentId)

    expect(result).toEqual(expectedTransformedData)
    expect(result[0].id).toBe("exec-1")
    expect(result[0].status).toBe("completed")
    expect(result[1].error).toBe("Execution timed out")
  })

  test("getWorkflowsForAgent transforms workflow list correctly", async () => {
    const agentId = "agent-123"

    // Raw API response format
    const rawApiResponse = {
      workflows: [
        {
          workflow_id: "wf-1",
          workflow_name: "Data Analysis",
          workflow_status: "active",
          agents: [
            { agent_id: agentId, agent_name: "Test Agent", role: "primary" },
            { agent_id: "agent-456", agent_name: "Helper Agent", role: "assistant" },
          ],
          created_at: "2023-05-05T12:00:00Z",
        },
        {
          workflow_id: "wf-2",
          workflow_name: "Content Generation",
          workflow_status: "draft",
          agents: [
            { agent_id: agentId, agent_name: "Test Agent", role: "writer" },
            { agent_id: "agent-789", agent_name: "Editor Agent", role: "editor" },
          ],
          created_at: "2023-05-06T14:00:00Z",
        },
      ],
    }

    // Expected transformed format
    const expectedTransformedData = [
      {
        id: "wf-1",
        name: "Data Analysis",
        status: "active",
        agents: [
          { id: agentId, name: "Test Agent", role: "primary" },
          { id: "agent-456", name: "Helper Agent", role: "assistant" },
        ],
        createdAt: "2023-05-05T12:00:00Z",
      },
      {
        id: "wf-2",
        name: "Content Generation",
        status: "draft",
        agents: [
          { id: agentId, name: "Test Agent", role: "writer" },
          { id: "agent-789", name: "Editor Agent", role: "editor" },
        ],
        createdAt: "2023-05-06T14:00:00Z",
      },
    ]

    server.use(
      rest.get(`${API_BASE_URL}/agents/${agentId}/workflows`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(rawApiResponse))
      }),
    )

    const result = await getWorkflowsForAgent(agentId)

    expect(result).toEqual(expectedTransformedData)
    expect(result[0].id).toBe("wf-1")
    expect(result[0].agents[0].role).toBe("primary")
    expect(result[1].name).toBe("Content Generation")
  })
})
