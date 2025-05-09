import { executeQuery } from "../lib/db"
import fs from "fs"
import path from "path"

async function runMigrations() {
  console.log("Running database migrations...")

  // Get all migration files
  const migrationsDir = path.join(process.cwd(), "migrations")
  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort() // Ensure migrations run in order

  // Create migrations table if it doesn't exist
  await executeQuery(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `)

  // Get already applied migrations
  const appliedMigrations = await executeQuery("SELECT name FROM migrations")
  const appliedMigrationNames = appliedMigrations.rows.map((row: any) => row.name)

  // Run pending migrations
  for (const file of migrationFiles) {
    if (!appliedMigrationNames.includes(file)) {
      console.log(`Applying migration: ${file}`)

      // Read and execute migration
      const migration = fs.readFileSync(path.join(migrationsDir, file), "utf8")
      await executeQuery(migration)

      // Record migration
      await executeQuery("INSERT INTO migrations (name) VALUES ($1)", [file])

      console.log(`Migration applied: ${file}`)
    } else {
      console.log(`Migration already applied: ${file}`)
    }
  }

  console.log("All migrations completed")
}

// Run migrations
runMigrations()
  .then(() => {
    console.log("Database setup complete")
    process.exit(0)
  })
  .catch((error) => {
    console.error("Error setting up database:", error)
    process.exit(1)
  })
