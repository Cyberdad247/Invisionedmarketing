import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { triggerWorkflow } from "@/lib/n8n/client"

export const dynamic = "force-dynamic"
export const revalidate = 0

