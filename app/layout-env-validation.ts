import { validateEnvOrExit } from "@/lib/env-validator"

// Validate environment variables at startup
// This will run during build and when the server starts
if (typeof window === "undefined") {
  validateEnvOrExit()
}
