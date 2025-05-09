import fs from "fs"
import path from "path"
import { exec } from "child_process"
import util from "util"

const execPromise = util.promisify(exec)

async function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
  const backupDir = path.join(process.cwd(), "backups")
  const backupFile = path.join(backupDir, `backup-${timestamp}.sql`)

  // Create backups directory if it doesn't exist
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true })
  }

  // Get database connection details from environment
  const connectionString = process.env.NEON_NEON_DATABASE_URL
  if (!connectionString) {
    throw new Error("NEON_DATABASE_URL environment variable is not set")
  }

  // Parse connection string to get components
  const match = connectionString.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):?(\d*)\/(.+)/)
  if (!match) {
    throw new Error("Invalid database connection string format")
  }

  const [, user, password, host, port = "5432", dbname] = match

  // Set environment variables for pg_dump
  const env = {
    ...process.env,
    PGUSER: user,
    PGPASSWORD: password,
    PGHOST: host,
    PGPORT: port,
    PGDATABASE: dbname,
  }

  try {
    console.log(`Creating backup to ${backupFile}...`)

    // Execute pg_dump
    await execPromise(`pg_dump --format=plain --no-owner --no-acl > "${backupFile}"`, {
      env,
      shell: true,
    })

    console.log(`✅ Database backup created at ${backupFile}`)
    return backupFile
  } catch (error) {
    console.error("Backup failed:", error)
    throw error
  }
}

// Run the backup function
backupDatabase().catch((error) => {
  console.error("Backup script failed:", error)
  process.exit(1)
})
