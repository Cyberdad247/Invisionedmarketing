import { pgPool, executePoolQuery, closeDbConnections } from "../lib/db-pool"
import { DatabaseError, DatabaseErrorType } from "../lib/db-error-handler"
import { PoolClient } from "pg"
import { jest } from "@jest/globals"

// Mock environment variables
beforeAll(() => {
  process.env.NEON_NEON_DATABASE_URL = "postgres://test:test@localhost:5432/testdb"
  process.env.NEON_DATABASE_URL = "postgres://test:test@localhost:5432/testdb"
})

// Clean up after tests
afterAll(async () => {
  await closeDbConnections()
})

describe("Database Pool", () => {
  test("should acquire and release connection successfully", async () => {
    const client = await pgPool.connect()
    expect(client).toBeDefined()
    expect(client.release).toBeInstanceOf(Function)
    client.release()
  })

  test("should handle connection errors", async () => {
    // Mock connection failure
    const originalConnect = pgPool.connect
    pgPool.connect = jest.fn(() => {
      throw new Error("Connection failed")
    })

    await expect(pgPool.connect()).rejects.toThrow("Connection failed")
    
    // Restore original implementation
    pgPool.connect = originalConnect
  })

  test("should handle connection pool exhaustion", async () => {
    // Mock pool limit reached
    const originalConnect = pgPool.connect
    pgPool.connect = jest.fn(() => {
      const err = new Error("Connection pool exhausted")
      err["code"] = "57P01" // admin shutdown error code
      throw err
    })

    await expect(pgPool.connect()).rejects.toMatchObject({
      type: DatabaseErrorType.CONNECTION_FAILED
    })
    
    // Restore original implementation
    pgPool.connect = originalConnect
  })

  test("should execute query successfully", async () => {
    const result = await executePoolQuery("SELECT 1")
    expect(result.rows[0]).toEqual({ "?column?": 1 })
  })

  test("should handle query errors", async () => {
    await expect(executePoolQuery("INVALID SQL")).rejects.toThrow(DatabaseError)
  })

  test("should handle transaction errors", async () => {
    // Mock transaction error
    const originalQuery = pgPool.query
    pgPool.query = jest.fn(() => {
      const err = new Error("Current transaction is aborted")
      err["code"] = "25P02" // transaction aborted error code
      throw err
    })

    await expect(executePoolQuery("SELECT 1")).rejects.toMatchObject({
      type: DatabaseErrorType.TRANSACTION_ERROR
    })
    
    // Restore original implementation
    pgPool.query = originalQuery
  })

  test("should handle connection timeout", async () => {
    // Mock timeout
    const originalQuery = pgPool.query
    pgPool.query = jest.fn(() => {
      const err = new Error("Connection timed out")
      err["code"] = "ETIMEDOUT"
      throw err
    })

    await expect(executePoolQuery("SELECT 1")).rejects.toMatchObject({
      type: DatabaseErrorType.TIMEOUT
    })
    
    // Restore original implementation
    pgPool.query = originalQuery
  })

  test("should handle connection pool drain", async () => {
    // Mock pool drain
    const originalConnect = pgPool.connect
    pgPool.connect = jest.fn(() => {
      const err = new Error("Connection pool drained")
      err["code"] = "57P02" // cannot connect now error code
      throw err
    })

    await expect(pgPool.connect()).rejects.toMatchObject({
      type: DatabaseErrorType.CONNECTION_FAILED
    })
    
    // Restore original implementation
    pgPool.connect = originalConnect
  })

  test("should handle connection termination", async () => {
    // Mock terminated connection
    const originalQuery = pgPool.query
    pgPool.query = jest.fn(() => {
      const err = new Error("Connection terminated")
      err["code"] = "57P03" // connection does not exist error code
      throw err
    })

    await expect(executePoolQuery("SELECT 1")).rejects.toMatchObject({
      type: DatabaseErrorType.CONNECTION_FAILED
    })
    
    // Restore original implementation
    pgPool.query = originalQuery
  })

  test("should handle query timeout", async () => {
    // Mock query timeout
    const originalQuery = pgPool.query
    pgPool.query = jest.fn(() => {
      const err = new Error("Query timed out")
      err["code"] = "57014" // query timeout error code
      throw err
    })

    await expect(executePoolQuery("SELECT 1")).rejects.toMatchObject({
      type: DatabaseErrorType.TIMEOUT
    })
    
    // Restore original implementation
    pgPool.query = originalQuery
  })

  test("should handle invalid parameters", async () => {
    // Mock invalid parameter error
    const originalQuery = pgPool.query
    pgPool.query = jest.fn(() => {
      const err = new Error("Invalid parameter value")
      err["code"] = "22P02" // invalid text representation error code
      throw err
    })

    await expect(executePoolQuery("SELECT $1", ["invalid"])).rejects.toMatchObject({
      type: DatabaseErrorType.QUERY_ERROR
    })
    
    // Restore original implementation
    pgPool.query = originalQuery
  })
})

describe("Database Error Handling", () => {
  test("should classify connection errors", () => {
    const err = new Error("Connection refused")
    err["code"] = "ECONNREFUSED"
    
    const dbError = new DatabaseError(
      "Connection failed", 
      DatabaseErrorType.CONNECTION_FAILED, 
      err
    )
    
    expect(dbError.type).toBe(DatabaseErrorType.CONNECTION_FAILED)
    expect(dbError.message).toBe("Connection failed")
  })

  test("should classify constraint violations", () => {
    const err = new Error("Unique violation")
    err["code"] = "23505"
    
    const dbError = new DatabaseError(
      "Constraint violation", 
      DatabaseErrorType.CONSTRAINT_VIOLATION, 
      err
    )
    
    expect(dbError.type).toBe(DatabaseErrorType.CONSTRAINT_VIOLATION)
  })

  test("should classify deadlock errors", () => {
    const err = new Error("Deadlock detected")
    err["code"] = "40P01"
    
    const dbError = new DatabaseError(
      "Deadlock occurred", 
      DatabaseErrorType.DEADLOCK, 
      err
    )
    
    expect(dbError.type).toBe(DatabaseErrorType.DEADLOCK)
  })

  test("should classify serialization failures", () => {
    const err = new Error("Serialization failure")
    err["code"] = "40001"
    
    const dbError = new DatabaseError(
      "Serialization failed", 
      DatabaseErrorType.TRANSACTION_ERROR, 
      err
    )
    
    expect(dbError.type).toBe(DatabaseErrorType.TRANSACTION_ERROR)
  })

  test("should classify syntax errors", () => {
    const err = new Error("Syntax error")
    err["code"] = "42601"
    
    const dbError = new DatabaseError(
      "SQL syntax error", 
      DatabaseErrorType.QUERY_ERROR, 
      err
    )
    
    expect(dbError.type).toBe(DatabaseErrorType.QUERY_ERROR)
  })

  test("should classify permission denied errors", () => {
    const err = new Error("Permission denied")
    err["code"] = "42501"
    
    const dbError = new DatabaseError(
      "Database permission error", 
      DatabaseErrorType.ACCESS_ERROR, 
      err
    )
    
    expect(dbError.type).toBe(DatabaseErrorType.ACCESS_ERROR)
  })
})