\nimport { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { triggerWorkflow } from "@/lib/n8n/client"
import { enqueueWorkflowTask } from "@/lib/workflow-queue";

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    // Get scheduled workflows that need to be executed
    console.log('Checking for scheduled workflows to execute')
    const scheduledWorkflows = await executeQuery(`
      SELECT * FROM workflow_schedules 
      WHERE next_execution <= NOW() 
      AND is_active = true
      ORDER BY priority DESC, next_execution ASC
      LIMIT 100
    `)
    console.log(`Found ${scheduledWorkflows.rowCount} workflows to execute`)

    const results = []

    // Trigger each workflow
    for (const workflow of scheduledWorkflows.rows) {
      try {
        console.log(`Triggering workflow ${workflow.workflow_id}`)
        // Trigger the workflow in n8n
        // Enqueue workflow execution to background task system
const taskId = await enqueueWorkflowTask({
  workflowId: workflow.workflow_id,
  parameters: workflow.parameters || {},
  scheduleId: workflow.id
}).catch(error => {
  console.error(`Failed to enqueue workflow ${workflow.workflow_id}:`, error);
  throw new Error(`Failed to enqueue workflow task: ${error.message}`);
});
const result = { executionId: taskId }
        console.log(`Workflow ${workflow.workflow_id} triggered successfully, execution ID: ${result.executionId}`)

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
        console.error(`Failed to trigger workflow ${workflow.workflow_id}: ${error.message}`)
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
