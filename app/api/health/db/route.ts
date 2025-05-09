import { NextResponse } from "next/server"
import { getDatabaseHealthInfo, startConnectionMonitoring } from "@/lib/db-error-handler"

// Start monitoring when the server starts
if (typeof window === "undefined") {
  startConnectionMonitoring()
}

export async function GET() {
  const healthInfo = await getDatabaseHealthInfo()

  if (healthInfo.status === "disconnected") {
    return NextResponse.json(healthInfo, { status: 503 })
  }

  return NextResponse.json(healthInfo)
}
