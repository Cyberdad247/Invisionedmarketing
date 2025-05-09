import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { executeQueryWithRetry, withRetry, DatabaseError, DatabaseErrorType } from "./db-error-handler"

// Initialize the SQL client with the database URL from environment variables
// Use the pooled connection for most operations
export const sql = neon(process.env.NEON_NEON_DATABASE_URL!)

// Initialize the Drizzle ORM instance
export const db = drizzle(sql)

// Helper function to execute raw SQL queries with parameters and error handling
export async function executeQuery(query: string, params: any[] = []) {
  try {
    // Use the query method for parameterized queries with retries
    return await executeQueryWithRetry(query, params)
  } catch (error) {
    // Log the error with additional context
    if (error instanceof DatabaseError) {
      console.error(`Database query error (${error.type}):`, error.message, {
        query: error.query,
        params: error.params,
      })
    } else {
      console.error("Database query error:", error)
    }
    throw error
  }
}

// Helper function to execute raw SQL queries with template literals and error handling
export async function executeRawQuery(strings: TemplateStringsArray, ...values: any[]) {
  try {
    // Use the tagged template syntax with retries
    return await withRetry(async () => {
      try {
        return await sql(strings, ...values)
      } catch (error) {
        // Enhance error with query information
        const errorType = error.code ? DatabaseErrorType.QUERY_FAILED : DatabaseErrorType.UNKNOWN
        throw new DatabaseError(error.message || "Query execution failed", errorType, error, strings.join("?"), values)
      }
    })
  } catch (error) {
    // Log the error with additional context
    if (error instanceof DatabaseError) {
      console.error(`Database query error (${error.type}):`, error.message, {
        query: error.query,
        params: error.params,
      })
    } else {
      console.error("Database query error:", error)
    }
    throw error
  }
}
