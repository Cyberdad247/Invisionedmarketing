import { Pool, PoolClient } from "pg"
import { neon, neonConfig } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

/**
 * Database connection pool configuration
 * 
 * @constant POOL_CONFIG
 * @property {number} max - Maximum number of clients in the pool (default: 10)
 * @property {number} idleTimeoutMillis - Idle time before closing a client (default: 30000ms)
 * @property {number} connectionTimeoutMillis - Timeout for connection acquisition (default: 2000ms)
 * @property {number} maxUses - Maximum uses before replacing a connection (default: 7500)
 * 
 * Note: These values should be tuned based on your application's database load patterns
 */
const POOL_CONFIG = {
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  maxUses: 7500,
}

/**
 * PostgreSQL connection pool instance
 * 
 * @constant pgPool
 * @type {Pool}
 * 
 * Features:
 * - Manages a pool of database connections
 * - Automatically handles connection acquisition/release
 * - Implements connection reuse for better performance
 * - Supports graceful shutdown
 */
export const pgPool = new Pool({
  connectionString: process.env.NEON_NEON_DATABASE_URL,
  ...POOL_CONFIG,
})

// Initialize the SQL client with the database URL from environment variables
// Use the pooled connection for most operations
export const sql = neon(process.env.NEON_DATABASE_URL!)

// Initialize the Drizzle ORM instance
export const db = drizzle(sql)

// Monitor the connection pool
pgPool.on("error", (err) => {
  console.error("Unexpected error on idle client", err)
})

/**
 * Executes a query using the connection pool with proper resource management
 * 
 * @param query - SQL query string
 * @param params - Query parameters (optional)
 * @returns Promise<any> - Query result
 * 
 * This function:
 * 1. Acquires a connection from the pool
 * 2. Executes the query with parameters
 * 3. Releases the connection back to the pool
 * 4. Returns the query result
 * 
 * Note: Always uses parameterized queries to prevent SQL injection
 */
export async function executePoolQuery(query: string, params: any[] = []) {
  let client: PoolClient | null = null
  try {
    client = await pgPool.connect()
    return await client.query(query, params)
  } finally {
    if (client) {
      try {
        client.release()
      } catch (releaseError) {
        console.error("Error releasing database connection:", releaseError)
      }
    }
  }
}

// Helper function to execute raw SQL queries with parameters
export async function executeQuery(query: string, params: any[] = []) {
  try {
    // Use the query method for parameterized queries
    return await sql.query(query, params)
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Helper function to execute raw SQL queries with template literals
export async function executeRawQuery(strings: TemplateStringsArray, ...values: any[]) {
  try {
    // Use the tagged template syntax
    return await sql(strings, ...values)
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Graceful shutdown function
export async function closeDbConnections() {
  try {
    await pgPool.end()
    console.log("Database pool has ended")
  } catch (error) {
    console.error("Error closing database pool", error)
  }
}
