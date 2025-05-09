import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Initialize the SQL client with the database URL from environment variables
// Use the pooled connection for most operations
export const sql = neon(process.env.NEON_DATABASE_URL!)

// Initialize the Drizzle ORM instance
export const db = drizzle(sql)

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
