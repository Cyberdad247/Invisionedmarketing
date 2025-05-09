import { pgPool } from "./db-pool"
import { PoolClient } from "pg"
/**
 * Database error types for PostgreSQL operations
 * 
 * This enum categorizes different types of database errors that can occur during:
 * - Connection attempts
 * - Query execution
 * - Transaction processing
 * 
 * @enum {string}
 * @property CONNECTION_FAILED - Failed to establish database connection
 * @property QUERY_FAILED - Query execution failed (general case)
 * @property TIMEOUT - Operation timed out
 * @property CONSTRAINT_VIOLATION - Violated database constraints (unique, foreign key, etc)
 * @property PERMISSION_DENIED - Insufficient database permissions
 * @property UNKNOWN - Unclassified database error
 */
export enum DatabaseErrorType {
  CONNECTION_FAILED = "CONNECTION_FAILED",
  QUERY_FAILED = "QUERY_FAILED",
  TIMEOUT = "TIMEOUT",
  CONSTRAINT_VIOLATION = "CONSTRAINT_VIOLATION",
  PERMISSION_DENIED = "PERMISSION_DENIED",
  UNKNOWN = "UNKNOWN",
}

/**
 * Custom error class for database operations
 * 
 * Extends the native Error class to include additional database-specific information:
 * - Error type classification
 * - Original error object
 * - Query text (if applicable)
 * - Query parameters (if applicable)
 * 
 * @class DatabaseError
 * @extends Error
 * @property {DatabaseErrorType} type - Classification of the database error
 * @property {any} originalError - The original error object from the database driver
 * @property {string} [query] - The SQL query that failed (if applicable)
 * @property {any[]} [params] - Query parameters (if applicable)
 */
export class DatabaseError extends Error {
  type: DatabaseErrorType
  originalError: any
  query?: string
  params?: any[]

  constructor(message: string, type: DatabaseErrorType, originalError: any, query?: string, params?: any[]) {
    super(message)
    this.name = "DatabaseError"
    this.type = type
    this.originalError = originalError
    this.query = query
    this.params = params
  }
}

// Function to classify PostgreSQL errors
/**
 * Classifies PostgreSQL errors into specific error types
 * 
 * @param error - The error object from PostgreSQL
 * @returns DatabaseErrorType - The classified error type
 * 
 * This function handles:
 * - Connection errors (ECONNREFUSED, ENOTFOUND, etc)
 * - Timeout errors (ETIMEDOUT, query canceled)
 * - Constraint violations (unique, foreign key, not null)
 * - Permission errors (insufficient privileges, invalid auth)
 * - Fallback to QUERY_FAILED for unclassified errors
 */
export function classifyPgError(error: any): DatabaseErrorType {
  if (!error) return DatabaseErrorType.UNKNOWN

  // Connection errors
  if (
    error.code === "ECONNREFUSED" ||
    error.code === "ENOTFOUND" ||
    error.code === "08001" || // Connection exception
    error.code === "08006" // Connection failure
  ) {
    return DatabaseErrorType.CONNECTION_FAILED
  }

  // Timeout errors
  if (
    error.code === "ETIMEDOUT" ||
    error.code === "57014" // Query canceled
  ) {
    return DatabaseErrorType.TIMEOUT
  }

  // Constraint violations
  if (
    error.code === "23505" || // Unique violation
    error.code === "23503" || // Foreign key violation
    error.code === "23502" || // Not null violation
    error.code === "23514" // Check constraint violation
  ) {
    return DatabaseErrorType.CONSTRAINT_VIOLATION
  }

  // Permission errors
  if (
    error.code === "42501" || // Insufficient privilege
    error.code === "28000" || // Invalid authorization specification
    error.code === "28P01" // Invalid password
  ) {
    return DatabaseErrorType.PERMISSION_DENIED
  }

  return DatabaseErrorType.QUERY_FAILED
}

// Connection health check
/**
 * Checks database connection health
 * 
 * @returns Promise<boolean> - True if connection is healthy, false otherwise
 * 
 * This function:
 * 1. Acquires a connection from the pool
 * 2. Executes a simple query (SELECT 1)
 * 3. Releases the connection back to the pool
 * 4. Returns true if successful, false on error
 * 
 * Note: Errors are logged but not thrown to prevent cascading failures
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  let client: PoolClient | null = null
  try {
    client = await pgPool.connect()
    await client.query("SELECT 1")
    return true
  } catch (error) {
    console.error("Database connection check failed:", error)
    return false
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

// Retry mechanism for database operations
/**
 * Executes an operation with retry logic for transient errors
 * 
 * @template T - The return type of the operation
 * @param operation - The async function to execute
 * @param options - Retry configuration options
 * @param options.retries - Maximum retry attempts (default: 3)
 * @param options.backoffMs - Initial backoff in milliseconds (default: 300)
 * @param options.maxBackoffMs - Maximum backoff in milliseconds (default: 3000)
 * @param options.retryableErrors - Error types that should trigger retry (default: [CONNECTION_FAILED, TIMEOUT])
 * @returns Promise<T> - Result of the operation if successful
 * 
 * Features:
 * - Exponential backoff with jitter to prevent thundering herd
 * - Configurable retryable error types
 * - Automatic error classification and wrapping
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: {
    retries?: number
    backoffMs?: number
    maxBackoffMs?: number
    retryableErrors?: DatabaseErrorType[]
  } = {},
): Promise<T> {
  const {
    retries = 3,
    backoffMs = 300,
    maxBackoffMs = 3000,
    retryableErrors = [DatabaseErrorType.CONNECTION_FAILED, DatabaseErrorType.TIMEOUT],
  } = options

  let lastError: any

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error

      // Determine if we should retry
      const errorType = error instanceof DatabaseError ? error.type : classifyPgError(error)

      const shouldRetry = attempt < retries && retryableErrors.includes(errorType)

      if (!shouldRetry) {
        // If it's not a DatabaseError, wrap it
        if (!(error instanceof DatabaseError)) {
          throw new DatabaseError(error.message || "Database operation failed", errorType, error)
        }
        throw error
      }

      // Calculate backoff with exponential increase and jitter
      const jitter = Math.random() * 0.3 + 0.85 // Random value between 0.85 and 1.15
      const calculatedBackoff = Math.min(backoffMs * Math.pow(2, attempt) * jitter, maxBackoffMs)

      console.warn(
        `Database operation failed, retrying in ${Math.round(calculatedBackoff)}ms (attempt ${attempt + 1}/${retries})`,
        error,
      )

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, calculatedBackoff))
    }
  }

  // This should never be reached due to the throw in the loop,
  // but TypeScript needs it for type safety
  throw lastError
}

// Enhanced query execution with retries and error handling
export async function executeQueryWithRetry(
  query: string,
  params: any[] = [],
  options?: {
    retries?: number
    backoffMs?: number
    maxBackoffMs?: number
  },
) {
  return withRetry(async () => {
    try {
      return await pgPool.query(query, params)
    } catch (error) {
      // Enhance error with query information
      const errorType = classifyPgError(error)
      throw new DatabaseError(error.message || "Query execution failed", errorType, error, query, params)
    }
  }, options)
}

// Health check endpoint data
export async function getDbStatus(): Promise<{
  status: DataSource['status']
  version: string | null
  pool: any
  error: { message: string; type: DatabaseErrorType } | null
}> {
  try {
    const client = await pgPool.connect()
    try {
      // Get connection information
      const versionResult = await client.query("SELECT version()")
      const poolInfo = {
        total: pgPool.totalCount,
        idle: pgPool.idleCount,
        waiting: pgPool.waitingCount,
      }

      return {
        status: "connected" as DataSource['status'],
        version: versionResult.rows[0].version,
        pool: poolInfo,
        error: null,
      }
    } finally {
      client.release()
    }
  } catch (error) {
    return {
      status: "disconnected" as DataSource['status'],
      version: null,
      pool: null,
      error: {
        message: error.message,
        type: classifyPgError(error),
      },
    }
  }
}

// Connection monitoring
let isMonitoringActive = false
let monitoringInterval: NodeJS.Timeout | null = null

export function startConnectionMonitoring(intervalMs = 60000) {
  if (isMonitoringActive) return

  isMonitoringActive = true
  monitoringInterval = setInterval(async () => {
    const isConnected = await checkDatabaseConnection()
    if (!isConnected) {
      console.error("Database connection monitoring detected connection issue")
      // You could implement alerting here
    }
  }, intervalMs)
}

export function stopConnectionMonitoring() {
  if (monitoringInterval) {
    clearInterval(monitoringInterval)
    monitoringInterval = null
  }
  isMonitoringActive = false
}
