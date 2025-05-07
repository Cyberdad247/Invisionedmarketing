import React, { useState, useCallback, useEffect } from 'react';
import { McpTool, executeMcpTool, McpToolExecutionResult } from '../../../api/aci/mcpTools'; // Import necessary types and API function

interface ToolExecutionProps {
  /** The selected MCP tool to execute. */
  tool: McpTool;
}

/**
 * ToolExecution component
 * This component displays input fields for a selected ACI MCP tool's execution parameters,
 * handles user input, triggers the execution API call, and displays the results.
 * It also manages loading and error states for the execution.
 */
const ToolExecution: React.FC<ToolExecutionProps> = ({ tool }) => {
  // State to hold the execution parameters
  // Placeholder: Replace 'any' with a more specific type based on the tool's execution schema
  const [executionParams, setExecutionParams] = useState<any>({});
  const [executionResult, setExecutionResult] = useState<McpToolExecutionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Reset state when the selected tool changes
  useEffect(() => {
    // TODO: Initialize executionParams based on the tool's execution schema
    setExecutionParams({});
    setExecutionResult(null);
    setError(null);
  }, [tool]);

  // Handle changes in execution parameter inputs
  // Placeholder: This will need to be more dynamic based on the actual execution schema
  const handleParamChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setExecutionParams((prevParams: any) => ({
      ...prevParams,
      [name]: value,
    }));
  }, []);

  // Handle tool execution
  const handleExecuteClick = useCallback(async () => {
    // Basic client-side validation: Check if executionParams is empty (placeholder)
    // TODO: Implement more specific validation based on the tool's execution schema
    if (Object.keys(executionParams).length === 0) {
      setError(new Error('Execution parameters cannot be empty.')); // Set a user-friendly error message
      return; // Stop execution if validation fails
    }

    setIsLoading(true);
    setError(null); // Clear previous errors
    setExecutionResult(null); // Clear previous results
    try {
      // Call the executeMcpTool API function with the collected parameters
      const result = await executeMcpTool(tool.id, executionParams);
      setExecutionResult(result); // Store the execution result
    } catch (err) {
      // Catch any errors during the API call
      const apiError = err as Error;
      setError(apiError); // Set local error state
      console.error("Error executing MCP tool:", apiError); // Log the error for debugging
    } finally {
      // Always set loading to false after the attempt
      setIsLoading(false);
    }
  }, [tool.id, executionParams]); // Include all dependencies

  return (
    <div className="border p-4">
      <h3 className="text-lg font-semibold mb-2">Execute {tool.name}</h3>

      {/* Placeholder Execution Parameters Form */}
      {/* TODO: Implement a dynamic form based on the tool's execution schema */}
      <div className="mb-4">
        <label htmlFor="exampleParam" className="block text-sm font-medium text-gray-700">
          Example Execution Parameter:
        </label>
        <input
          type="text"
          id="exampleParam"
          name="exampleParam"
          value={executionParams.exampleParam || ''}
          onChange={handleParamChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          disabled={isLoading}
        />
      </div>
      {/* Add more execution parameter fields here */}

      <button
        className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
        onClick={handleExecuteClick}
        disabled={isLoading} // Disable button while loading
      >
        {isLoading ? 'Executing...' : 'Execute Tool'}
      </button>

      {/* Display loading state */}
      {isLoading && <p>Loading...</p>}

      {/* Display error state */}
      {error && <p className="text-red-500">Error: {error.message}</p>}

      {/* Display execution results */}
      {executionResult && (
        <div className="mt-4">
          <h4 className="text-md font-semibold mb-2">Execution Result:</h4>
          {/* Placeholder: Display the raw result for now */}
          <pre className="bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(executionResult, null, 2)}
          </pre>
          {/* TODO: Format the execution result based on its structure */}
        </div>
      )}
    </div>
  );
};

export default ToolExecution;