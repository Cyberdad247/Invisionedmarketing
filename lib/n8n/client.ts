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

// Add the missing N8nClient export
export class N8nClient {
  private apiUrl: string
  private apiKey: string

  constructor(apiUrl?: string, apiKey?: string) {
    this.apiUrl = apiUrl || process.env.N8N_API_URL || ""
    this.apiKey = apiKey || process.env.N8N_API_KEY || ""

    if (!this.apiUrl || !this.apiKey) {
      throw new Error("N8N_API_URL and N8N_API_KEY must be defined")
    }
  }

  async triggerWorkflow(workflowId: string, parameters: Record<string, any>): Promise<{ executionId: string }> {
    try {
      const response = await fetch(`${this.apiUrl}/workflows/${workflowId}/execute?apiKey=${this.apiKey}`, {
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

  async getWorkflowStatus(executionId: string): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/executions/${executionId}?apiKey=${this.apiKey}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Failed to get workflow status: ${response.status} - ${JSON.stringify(errorData)}`)
      }

      return await response.json()
    } catch (error: any) {
      console.error("Error getting workflow status:", error)
      throw new Error(`Failed to get workflow status: ${error.message}`)
    }
  }

  async listWorkflows(): Promise<any[]> {
    try {
      const response = await fetch(`${this.apiUrl}/workflows?apiKey=${this.apiKey}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Failed to list workflows: ${response.status} - ${JSON.stringify(errorData)}`)
      }

      return await response.json()
    } catch (error: any) {
      console.error("Error listing workflows:", error)
      throw new Error(`Failed to list workflows: ${error.message}`)
    }
  }
}
