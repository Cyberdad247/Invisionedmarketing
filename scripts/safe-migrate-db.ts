import { exec } from "child_process"
import util from "util"
import { Pool } from "pg"

const execPromise = util.promisify(exec)

const MIGRATION_LOCK_ID = 'migration_lock';
const CMD_BACKUP_DB = "npx tsx scripts/backup-db.ts";
const CMD_DRIZZLE_PUSH = "npx drizzle-kit push:pg";

// Function to check database connectivity before migrations
async function checkDatabaseConnection(): Promise<boolean> {
  if (!process.env.NEON_NEON_DATABASE_URL) {
    console.error("❌ Missing required environment variable: NEON_NEON_DATABASE_URL");
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.NEON_NEON_DATABASE_URL,
    connectionTimeoutMillis: 5000,
  })

  try {
    const client = await pool.connect()
    try {
      await client.query("SELECT 1")
      console.log("✅ Database connection successful")
      return true
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error instanceof Error ? error.message : error)
    return false
  } finally {
    await pool.end()
  }
}

// Function to create a migration lock
async function acquireMigrationLock(pool: Pool): Promise<boolean> {
  try {
    // Create migration_locks table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migration_locks (
        id TEXT PRIMARY KEY,
        acquired_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        released_at TIMESTAMP WITH TIME ZONE
      )
    `)

    // Try to acquire lock
    const result = await pool.query(`
      INSERT INTO migration_locks (id, acquired_at, released_at)
      VALUES ($1, NOW(), NULL)
      ON CONFLICT (id) 
      DO UPDATE SET 
        acquired_at = NOW(),
        released_at = NULL
      WHERE migration_locks.released_at IS NOT NULL
      RETURNING id
    `, [MIGRATION_LOCK_ID])

    return result.rowCount > 0
  } catch (error) {
    console.error("Failed to acquire migration lock:", error instanceof Error ? error.message : error)
    return false
  }
}

// Function to release migration lock
async function releaseMigrationLock(pool: Pool): Promise<void> {
  try {
    await pool.query(`
      UPDATE migration_locks
      SET released_at = NOW()
      WHERE id = $1
    `, [MIGRATION_LOCK_ID])
    console.log("Migration lock released")
  } catch (error) {
    console.error("Failed to release migration lock:", error instanceof Error ? error.message : error)
  }
}

// Function to check if migrations are already running
async function checkMigrationStatus(pool: Pool): Promise<boolean> {
  try {
    const result = await pool.query(`
      SELECT * FROM migration_locks
      WHERE id = $1
      AND released_at IS NULL
      AND acquired_at > NOW() - INTERVAL '30 minutes'
    `, [MIGRATION_LOCK_ID])

    return result.rowCount === 0
  } catch (error) {
    // If table doesn't exist, migrations aren't running
    return true
  }
}

// Main migration function with safeguards
async function safelyMigrateDatabase() {
  console.log("Starting database migration with safeguards...")

  // Check database connectivity
  const isConnected = await checkDatabaseConnection()
  if (!isConnected) {
    console.error("Cannot proceed with migrations: Database connection failed")
    process.exit(1)
  }

  if (!process.env.NEON_DATABASE_URL) {
    console.error("❌ Missing required environment variable: NEON_DATABASE_URL");
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.NEON_DATABASE_URL,
  })

  try {
    // Check if migrations are already running
    const canProceed = await checkMigrationStatus(pool)
    if (!canProceed) {
      console.warn("⚠️ Migrations appear to be already running. Skipping to prevent conflicts.")
      return
    }

    // Acquire migration lock
    const lockAcquired = await acquireMigrationLock(pool)
    if (!lockAcquired) {
      console.warn("⚠️ Could not acquire migration lock. Skipping to prevent conflicts.")
      return
    }

    try {
      // Create a backup before migrations (if possible)
      try {
        console.log("Creating database backup...")
        await execPromise(CMD_BACKUP_DB)
        console.log("✅ Database backup created")
      } catch (backupError) {
        console.warn("⚠️ Could not create database backup:", backupError)
        // Continue with migrations even if backup fails
      }

      // Run the actual migrations
      console.log("Running migrations...")
      await execPromise(CMD_DRIZZLE_PUSH)
      console.log("✅ Migrations completed successfully")
    } finally {
      // Always release the lock when done
      await releaseMigrationLock(pool)
    }
  } catch (error) {
    console.error("❌ Migration failed:", error instanceof Error ? error.message : error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

// Run the migration function
safelyMigrateDatabase()
