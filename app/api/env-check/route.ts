import { NextResponse } from "next/server"
import { validateEnv } from "@/lib/env-validator"

export async function GET() {
  const { valid, errors } = validateEnv()

  if (!valid) {
    return NextResponse.json(
      {
        status: "error",
        message: "Environment validation failed",
        errors,
      },
      { status: 500 },
    )
  }

  return NextResponse.json({
    status: "ok",
    message: "Environment validation passed",
  })
}
