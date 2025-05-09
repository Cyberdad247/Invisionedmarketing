import { exec } from "child_process"
import util from "util"
import axios from "axios"
import fs from "fs"
import path from "path"
import crypto from "crypto"

const execPromise = util.promisify(exec)

// Configuration
const CREDENTIAL_ROTATION_INTERVAL_DAYS = 30 // How often to rotate credentials
const NEON_API_KEY = process.env.NEON_API_KEY // You'll need to set this up
const NEON_PROJECT_ID = process.env.NEON_PROJECT_ID // Your Neon project ID
const NEON_API_URL = "https://console.neon.tech/api/v2"
const VERCEL_TOKEN = process.env.VERCEL_API_TOKEN // Vercel API token
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID // Your Vercel project ID
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID // Your Vercel team ID (if applicable)
const VERCEL_API_URL = "https://api.vercel.com"

// Function to generate a secure password
function generateSecurePassword(length = 32) {
  return crypto.randomBytes(length).toString("base64").slice(0, length)
}

// Function to check if credentials need rotation
async function shouldRotateCredentials() {
  const metadataPath = path.join(process.cwd(), ".credential-rotation.json")

  // If metadata file doesn't exist, rotation is needed
  if (!fs.existsSync(metadataPath)) {
    return true
  }

  try {
    const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"))
    const lastRotation = new Date(metadata.lastRotation)
    const daysSinceRotation = (Date.now() - lastRotation.getTime()) / (1000 * 60 * 60 * 24)

    return daysSinceRotation >= CREDENTIAL_ROTATION_INTERVAL_DAYS
  } catch (error) {
    console.error("Error reading credential rotation metadata:", error)
    return true // Rotate if we can't determine last rotation
  }
}

// Function to update Neon database password
async function updateNeonPassword(newPassword) {
  if (!NEON_API_KEY || !NEON_PROJECT_ID) {
    throw new Error("Neon API key or project ID not configured")
  }

  try {
    // This is a simplified example - actual Neon API may differ
    const response = await axios.post(
      `${NEON_API_URL}/projects/${NEON_PROJECT_ID}/branches/main/reset-password`,
      { password: newPassword },
      {
        headers: {
          Authorization: `Bearer ${NEON_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    )

    return response.data
  } catch (error) {
    console.error("Failed to update Neon password:", error.response?.data || error.message)
    throw error
  }
}

// Function to update Vercel environment variables
async function updateVercelEnvVars(newPassword) {
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    throw new Error("Vercel API token or project ID not configured")
  }

  try {
    // Construct the new connection strings with the updated password
    const connectionString = process.env.NEON_NEON_DATABASE_URL.replace(
      /postgres:\/\/([^:]+):([^@]+)@/,
      `postgres://$1:${newPassword}@`,
    )

    // Update environment variables in Vercel
    const vercelApiUrl = VERCEL_TEAM_ID
      ? `${VERCEL_API_URL}/v9/projects/${VERCEL_PROJECT_ID}/env?teamId=${VERCEL_TEAM_ID}`
      : `${VERCEL_API_URL}/v9/projects/${VERCEL_PROJECT_ID}/env`

    // Get existing environment variables
    const getResponse = await axios.get(vercelApiUrl, {
      headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
    })

    // Find the database URL environment variable
    const envVars = getResponse.data.envs
    const dbUrlVar = envVars.find((v) => v.key === "NEON_DATABASE_URL")

    if (!dbUrlVar) {
      throw new Error("NEON_DATABASE_URL environment variable not found in Vercel")
    }

    // Update the environment variable
    const updateResponse = await axios.patch(
      `${vercelApiUrl}/${dbUrlVar.id}`,
      {
        value: connectionString,
        type: "encrypted",
        target: ["production", "preview", "development"],
      },
      {
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    )

    // Also update other related environment variables
    const otherVars = [
      { key: "NEON_POSTGRES_PASSWORD", value: newPassword },
      // Add other variables that contain the password
    ]

    for (const varData of otherVars) {
      const existingVar = envVars.find((v) => v.key === varData.key)
      if (existingVar) {
        await axios.patch(
          `${vercelApiUrl}/${existingVar.id}`,
          {
            value: varData.value,
            type: "encrypted",
            target: ["production", "preview", "development"],
          },
          {
            headers: {
              Authorization: `Bearer ${VERCEL_TOKEN}`,
              "Content-Type": "application/json",
            },
          },
        )
      }
    }

    return updateResponse.data
  } catch (error) {
    console.error("Failed to update Vercel environment variables:", error.response?.data || error.message)
    throw error
  }
}

// Function to save rotation metadata
function saveRotationMetadata() {
  const metadataPath = path.join(process.cwd(), ".credential-rotation.json")
  const metadata = {
    lastRotation: new Date().toISOString(),
    nextRotation: new Date(Date.now() + CREDENTIAL_ROTATION_INTERVAL_DAYS * 24 * 60 * 60 * 1000).toISOString(),
  }

  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2))
}

// Main function to rotate credentials
async function rotateCredentials() {
  console.log("Checking if credential rotation is needed...")

  const needsRotation = await shouldRotateCredentials()
  if (!needsRotation) {
    console.log("Credential rotation not needed at this time")
    return
  }

  console.log("Starting database credential rotation...")

  try {
    // Generate a new secure password
    const newPassword = generateSecurePassword()

    // Update Neon database password
    console.log("Updating Neon database password...")
    await updateNeonPassword(newPassword)

    // Update Vercel environment variables
    console.log("Updating Vercel environment variables...")
    await updateVercelEnvVars(newPassword)

    // Save rotation metadata
    saveRotationMetadata()

    console.log("✅ Credential rotation completed successfully")

    // Trigger a new deployment to use the updated credentials
    console.log("Triggering deployment with new credentials...")
    await execPromise("vercel --prod")

    console.log("✅ Deployment with new credentials completed")
  } catch (error) {
    console.error("Credential rotation failed:", error)
    process.exit(1)
  }
}

// Run the credential rotation function
rotateCredentials()
