import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { triggerWorkflow } from "@/lib/n8n/client"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    // Get scheduled workflows that need to be executed
    const scheduledWorkflows = await executeQuery(`
      SELECT * FROM workflow_schedules 
      WHERE next_execution <= NOW() 
      AND is_active = true
    `)

    const results = []

    // Trigger each workflow
    for (const workflow of scheduledWorkflows.rows) {
      try {
        // Trigger the workflow in n8n
        const result = await triggerWorkflow(workflow.workflow_id, workflow.parameters || {})

        // Update the next execution time
        await executeQuery(
          `
          UPDATE workflow_schedules 
          SET last_execution = NOW(), 
              next_execution = NOW() + (interval_hours || ' hours')::interval 
          WHERE id = $1
        `,
          [workflow.id],
        )

        results.push({
          workflowId: workflow.workflow_id,
          status: "triggered",
          executionId: result.executionId,
        })
      } catch (error) {
        console.error(`Error triggering workflow ${workflow.workflow_id}:`, error)
        results.push({
          workflowId: workflow.workflow_id,
          status: "error",
          error: error.message,
        })
      }
    }

    return NextResponse.json({
      success: true,
      triggered: results.length,
      results,
    })
  } catch (error) {
    console.error("Error in workflow scheduler:", error)
    return NextResponse.json({ error: "Failed to process scheduled workflows" }, { status: 500 })
  }
}
