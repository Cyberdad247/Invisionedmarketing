export async function triggerWorkflow(
  workflowId: string,
  parameters: Record<string, any>,
): Promise<{ executionId: string }> {
  const n8nApiUrl = process.env.N8N_API_URL
  const n8nApiKey = process.env.N8N_API_KEY

  if (!n8nApiUrl || !n8nApiKey) {
    throw new Error("N8N_API_URL and N8N_API_KEY must be defined in environment variables")
  }

  try {
    const response = await fetch(`${n8nApiUrl}/workflows/${workflowId}/execute?apiKey=${n8nApiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: parameters,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Failed to trigger workflow: ${response.status} - ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    return { executionId: data.executionId }
  } catch (error: any) {
    console.error("Error triggering n8n workflow:", error)
    throw new Error(`Failed to trigger workflow: ${error.message}`)
  }
}
