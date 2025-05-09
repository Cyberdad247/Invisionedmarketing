import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate webhook signature if needed
    // const signature = request.headers.get('x-n8n-signature')

    // Process the webhook data
    console.log("Received n8n webhook:", data)

    // Store execution result
    if (data.executionId && data.workflowId) {
      await executeQuery(
        `INSERT INTO workflow_executions 
         (workflow_id, execution_id, status, result_data, executed_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [data.workflowId, data.executionId, data.status, JSON.stringify(data)],
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing n8n webhook:", error)
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 })
  }
}
