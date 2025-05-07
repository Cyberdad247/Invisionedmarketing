import React, { useState, useCallback, useEffect } from 'react';
import { McpTool, configureMcpTool, registerMcpTool, McpToolConfiguration } from '../../../api/aci/mcpTools'; // Import necessary types and API functions

interface ToolConfigurationProps {
  /** The selected MCP tool to configure. */
  tool: McpTool;
}

/**
 * ToolConfiguration component
 * This component displays a form for configuring a selected ACI MCP tool,
 * handles user input, and triggers configuration and registration API calls.
 * It also manages loading and error states for these operations.
 */
const ToolConfiguration: React.FC<ToolConfigurationProps> = ({ tool }) => {
  // State to hold the configuration data for the tool
  // Placeholder: Replace 'any' with a more specific type based on the tool's configuration schema
  const [configuration, setConfiguration] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isConfigured, setIsConfigured] = useState(false); // State to track if configuration is complete

  // Reset configuration state when the selected tool changes
  useEffect(() => {
    // TODO: Fetch existing configuration for the tool if available
    setConfiguration({});
    setIsConfigured(false);
    setError(null);
  }, [tool]);

  // Handle changes in configuration form inputs
  // Placeholder: This will need to be more dynamic based on the actual configuration schema
  const handleConfigurationChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setConfiguration((prevConfig: any) => ({
      ...prevConfig,
      [name]: value,
    }));
  }, []);

  // Handle submission of the configuration form
  const handleConfigureSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();

    // Basic client-side validation: Check if configuration is empty (placeholder)
    // TODO: Implement more specific validation based on the tool's schema
    if (Object.keys(configuration).length === 0) {
      setError(new Error('Configuration cannot be empty.')); // Set a user-friendly error message
      return; // Stop execution if validation fails
    }

    setIsLoading(true);
    setError(null); // Clear previous errors
    try {
      // Call the configureMcpTool API function
      await configureMcpTool(tool.id, configuration as McpToolConfiguration); // Cast to McpToolConfiguration
      setIsConfigured(true); // Mark as configured on success
      alert('Tool configured successfully!'); // Basic success feedback
    } catch (err) {
      // Catch any errors during the API call
      const apiError = err as Error;
      setError(apiError); // Set local error state
      console.error("Error configuring MCP tool:", apiError); // Log the error for debugging
    } finally {
      // Always set loading to false after the attempt
      setIsLoading(false);
    }
  }, [tool.id, configuration]); // Include all dependencies

  // Handle initiating tool registration
  const handleRegisterClick = useCallback(async () => {
    // Basic client-side validation: Ensure tool is configured before attempting registration
    if (!isConfigured) {
      setError(new Error('Tool must be configured before registration.')); // Set a user-friendly error message
      return; // Stop execution if validation fails
    }

    setIsLoading(true);
    setError(null); // Clear previous errors
    try {
      // Call the registerMcpTool API function
      await registerMcpTool({ toolId: tool.id, configuration }); // Pass tool ID and configuration
      alert('Tool registration initiated successfully!'); // Basic success feedback
    } catch (err) {
      // Catch any errors during the API call
      const apiError = err as Error;
      setError(apiError); // Set local error state
      console.error("Error registering MCP tool:", apiError); // Log the error for debugging
    } finally {
      // Always set loading to false after the attempt
      setIsLoading(false);
    }
  }, [tool.id, configuration, isConfigured]); // Include all dependencies

  return (
    <div className="border p-4">
      <h3 className="text-lg font-semibold mb-2">Configure {tool.name}</h3>

      {/* Placeholder Configuration Form */}
      {/* TODO: Implement a dynamic form based on the tool's configuration schema */}
      <form onSubmit={handleConfigureSubmit} className="mb-4">
        <div className="mb-2">
          <label htmlFor="exampleConfig" className="block text-sm font-medium text-gray-700">
            Example Configuration Field:
          </label>
          <input
            type="text"
            id="exampleConfig"
            name="exampleConfig"
            value={configuration.exampleConfig || ''}
            onChange={handleConfigurationChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            disabled={isLoading}
          />
        </div>
        {/* Add more configuration fields here */}

        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Configuring...' : 'Configure Tool'}
        </button>
      </form>

      {/* Registration Button (only enabled after configuration) */}
      <button
        className="bg-purple-500 text-white p-2 rounded disabled:opacity-50"
        onClick={handleRegisterClick}
        disabled={isLoading || !isConfigured} // Disable while loading or before configuration
      >
        {isLoading ? 'Registering...' : 'Register Tool'}
      </button>

      {/* Display loading state */}
      {isLoading && <p>Loading...</p>}

      {/* Display error state */}
      {error && <p className="text-red-500">Error: {error.message}</p>}
    </div>
  );
};

export default ToolConfiguration;