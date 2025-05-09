// Environment variable validation

const ENV_VAR_NEON_DB_URL = "NEON_NEON_DATABASE_URL";
const ENV_VAR_REDIS_URL = "REDIS_URL";
const ENV_VAR_NEXT_PUBLIC_APP_URL = "NEXT_PUBLIC_APP_URL";
const ENV_VAR_BLOB_READ_WRITE_TOKEN = "BLOB_READ_WRITE_TOKEN";
const ENV_VAR_GROQ_API_KEY = "GROQ_API_KEY";

const ERROR_MSG_MISSING_ENV_VAR = "Missing required environment variable:";
const ERROR_MSG_INVALID_FORMAT_ENV_VAR = "Invalid format for environment variable:";
const LOG_MSG_ENV_VALIDATION_FAILED = "❌ Environment validation failed:";
const LOG_MSG_EXITING_DUE_TO_MISSING_VARS = "Exiting due to missing required environment variables";
const LOG_WARN_APP_MAY_NOT_FUNCTION = "⚠️ Application may not function correctly without required environment variables";

const NODE_ENV_PRODUCTION = "production";
// This script validates all required environment variables at startup

type EnvVar = {
  name: string
  required: boolean
  pattern?: RegExp
  description: string
}

// Define all environment variables your application needs
const requiredEnvVars: EnvVar[] = [
  {
    name: ENV_VAR_NEON_DB_URL,
    required: true,
    pattern: /^postgres:\/\/.+:.+@.+\/.+(\?.*)?$/,
    description: "Neon PostgreSQL connection string",
  },
  {
    name: ENV_VAR_REDIS_URL,
    required: true,
    pattern: /^redis:\/\/.+:.+@.+:\d+$/,
    description: "Redis connection string",
  },
  {
    name: ENV_VAR_NEXT_PUBLIC_APP_URL,
    required: true,
    description: "Public URL of the application",
  },
  {
    name: ENV_VAR_BLOB_READ_WRITE_TOKEN,
    required: false,
    description: "Vercel Blob storage token",
  },
  {
    name: ENV_VAR_GROQ_API_KEY,
    required: false,
    description: "Groq API key for AI functionality",
  },
  // Add other environment variables as needed
]

export function validateEnv(): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  for (const envVar of requiredEnvVars) {
    const value = process.env[envVar.name]

    // Check if required variable exists
    if (envVar.required && (!value || value.trim() === "")) {
      errors.push(`${ERROR_MSG_MISSING_ENV_VAR} ${envVar.name} - ${envVar.description}`)
      continue
    }

    // If variable exists, check pattern if specified
    if (value && envVar.pattern && !envVar.pattern.test(value)) {
      errors.push(`${ERROR_MSG_INVALID_FORMAT_ENV_VAR} ${envVar.name} - ${envVar.description}`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// Function to validate environment variables and exit if invalid
export function validateEnvOrExit(): void {
  const { valid, errors } = validateEnv()

  if (!valid) {
    console.error(LOG_MSG_ENV_VALIDATION_FAILED)
    errors.forEach((error) => console.error(`  - ${error}`))

    if (process.env.NODE_ENV === NODE_ENV_PRODUCTION) {
      console.error(LOG_MSG_EXITING_DUE_TO_MISSING_VARS)
      process.exit(1)
    } else {
      console.warn(LOG_WARN_APP_MAY_NOT_FUNCTION)
    }
  } else {
    console.log("✅ Environment validation passed")
  }
}
