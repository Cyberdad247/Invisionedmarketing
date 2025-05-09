import { rest } from "msw"
import { server, simulateSlowResponse } from "../api/setup"
import { API_BASE_URL } from "../../src/api/config"
import { getAgents, getAgent, createAgent, testAgent } from "../../src/api/agent"

describe("API Client Performance Tests", () => {
  test("getAgents completes within acceptable time limit", async () => {
    const startTime = performance.now()
    await getAgents()
    const endTime = performance.now()

    const executionTime = endTime - startTime
    expect(executionTime).toBeLessThan(500) // 500ms threshold
  })

  test("getAgent handles slow responses with timeout", async () => {
    const agentId = "slow-agent"

    // Simulate a very slow response (5 seconds)
    const resetHandlers = simulateSlowResponse(`${API_BASE_URL}/agents/${agentId}`, "get", 5000)

    // Our client should timeout after 3 seconds
    const startTime = performance.now()

    try {
      await getAgent(agentId)
      fail("Should have timed out")
    } catch (error) {
      const endTime = performance.now()
      const executionTime = endTime - startTime

      // Should timeout after ~3000ms (our client timeout setting)
      expect(executionTime).toBeGreaterThanOrEqual(3000)
      expect(executionTime).toBeLessThan(5000) // Shouldn't wait for the full 5 seconds
      expect(error.message).toContain("timeout")
    }

    resetHandlers()
  })

  test("createAgent handles large payloads efficiently", async () => {
    // Create a large agent config
    const largeConfig = {
      name: "Large Config Agent",
      type: "crewai",
      config: {
        model: "gpt-4",
        temperature: 0.7,
        // Add a large array to simulate a big payload
        contextExamples: Array(1000)
          .fill(0)
          .map((_, i) => ({
            input: `Example input ${i}`,
            output: `Example output ${i}`,
            metadata: { timestamp: Date.now(), tags: ["test", "large", "payload"] },
          })),
      },
    }

    const startTime = performance.now()
    await createAgent(largeConfig)
    const endTime = performance.now()

    const executionTime = endTime - startTime
    expect(executionTime).toBeLessThan(1000) // 1000ms threshold for large payload
  })

  test("batch operations complete within acceptable time", async () => {
    // Test making multiple API calls in parallel
    const startTime = performance.now()

    await Promise.all([getAgents(), getAgent("agent-1"), getAgent("agent-2"), getAgent("agent-3")])

    const endTime = performance.now()

    const executionTime = endTime - startTime
    expect(executionTime).toBeLessThan(1000) // 1000ms threshold for batch operations
  })

  test("API client uses caching effectively for repeated calls", async () => {
    const agentId = "cached-agent"

    // First call - should hit the API
    const startTime1 = performance.now()
    await getAgent(agentId)
    const endTime1 = performance.now()
    const firstCallTime = endTime1 - startTime1

    // Second call - should use cache
    const startTime2 = performance.now()
    await getAgent(agentId)
    const endTime2 = performance.now()
    const secondCallTime = endTime2 - startTime2

    // The second call should be significantly faster due to caching
    expect(secondCallTime).toBeLessThan(firstCallTime * 0.5)
  })

  test("testAgent handles streaming responses efficiently", async () => {
    const agentId = "streaming-agent"
    const testInput = { query: "Test streaming response" }

    // Mock a streaming response
    let responseChunks = 0

    server.use(
      rest.post(`${API_BASE_URL}/agents/${agentId}/test`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.body(
            new ReadableStream({
              start(controller) {
                const encoder = new TextEncoder()

                const sendChunk = (chunk, delay) => {
                  setTimeout(() => {
                    controller.enqueue(encoder.encode(JSON.stringify(chunk)))
                    responseChunks++
                  }, delay)
                }

                sendChunk({ type: "start", id: "test-run-123" }, 0)
                sendChunk({ type: "thinking", content: "Processing query..." }, 100)
                sendChunk({ type: "partial", content: "The answer is" }, 200)
                sendChunk({ type: "partial", content: " 42." }, 300)
                sendChunk({ type: "complete", content: "The answer is 42." }, 400)

                setTimeout(() => controller.close(), 500)
              },
            }),
          ),
        )
      }),
    )

    const onChunk = jest.fn()

    await testAgent(agentId, testInput, onChunk)

    // Verify we processed all chunks
    expect(responseChunks).toBe(5)
    expect(onChunk).toHaveBeenCalledTimes(5)
  })
})
