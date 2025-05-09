"use server"

import { N8nClient } from "@/lib/n8n/client"
import { executeQuery } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function testN8nConnection(url: string, apiKey: string) {
  try {
    const client = new N8nClient({
      baseUrl: url,
      apiKey: apiKey,
      webhookBaseUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      selfHosted: true,
    })

    // Test the connection by fetching workflows
    const workflows = await client.getWorkflows()

    return {
      success: true,
      workflowCount: workflows.length,
    }
  } catch (error) {
    console.error("Error testing n8n connection:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to connect to n8n",
    }
  }
}

export async function saveN8nSettings(url: string, apiKey: string) {
  try {
    // Test the connection first
    const testResult = await testN8nConnection(url, apiKey)
    if (!testResult.success) {
      return testResult
    }

    // Save the settings to the database
    await executeQuery(
      `INSERT INTO system_settings (key, value, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (key) DO UPDATE
       SET value = $2, updated_at = NOW()`,
      ["n8n_settings", JSON.stringify({ url, apiKey })],
    )

    revalidatePath("/cognito/settings")

    return {
      success: true,
      message: "n8n settings saved successfully",
    }
  } catch (error) {
    console.error("Error saving n8n settings:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save n8n settings",
    }
  }
}

export async function getN8nWorkflows() {
  try {
    const client = new N8nClient()
    const workflows = await client.getWorkflows()

    return {
      success: true,
      workflows,
    }
  } catch (error) {
    console.error("Error fetching n8n workflows:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch n8n workflows",
      workflows: [],
    }
  }
}

export async function executeN8nWorkflow(workflowId: string, data: any = {}) {
  try {
    const client = new N8nClient()
    const executionId = await client.executeWorkflow(workflowId, data)

    // Save the execution to the database
    await executeQuery(
      `INSERT INTO workflow_executions 
       (workflow_id, execution_id, status, input_data, executed_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [workflowId, executionId, "running", JSON.stringify(data)],
    )

    return {
      success: true,
      executionId,
    }
  } catch (error) {
    console.error("Error executing n8n workflow:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to execute n8n workflow",
    }
  }
}

export async function getN8nExecutionStatus(executionId: string) {
  try {
    const client = new N8nClient()
    const execution = await client.getExecution(executionId)

    if (!execution) {
      return {
        success: false,
        error: "Execution not found",
      }
    }

    // Update the execution status in the database
    await executeQuery(
      `UPDATE workflow_executions
       SET status = $1, result_data = $2, updated_at = NOW()
       WHERE execution_id = $3`,
      [execution.status, JSON.stringify(execution.data), executionId],
    )

    return {
      success: true,
      status: execution.status,
      data: execution.data,
    }
  } catch (error) {
    console.error("Error fetching n8n execution status:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch execution status",
    }
  }
}
