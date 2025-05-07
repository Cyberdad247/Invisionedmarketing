import React, { useState, useCallback } from 'react';
import ToolSearch from '../../components/aci/McpTools/ToolSearch';
import ToolDetails from '../../components/aci/McpTools/ToolDetails';
import ToolConfiguration from '../../components/aci/McpTools/ToolConfiguration';
import ToolExecution from '../../components/aci/McpTools/ToolExecution';
import { McpTool } from '../api/aci/mcpTools'; // Import McpTool type

/**
 * AciMcpToolsPage component
 * This page serves as the main container for managing ACI MCP tools.
 * It includes sections for searching tools, viewing details, configuring, and executing them.
 * It manages the state for search results, selected tool, loading, and errors.
 */
const AciMcpToolsPage: React.FC = () => {
  const [searchResults, setSearchResults] = useState<McpTool[]>([]);
  const [selectedTool, setSelectedTool] = useState<McpTool | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Callback to handle search results from ToolSearch
  const handleSearchResults = useCallback((tools: McpTool[]) => {
    setSearchResults(tools);
    setSelectedTool(null); // Clear selected tool on new search
  }, []);

  // Callback to handle loading state from ToolSearch
  const handleLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  // Callback to handle errors from ToolSearch
  const handleError = useCallback((err: Error | null) => {
    setError(err);
  }, []);

  // Handle tool selection from search results
  const handleToolSelect = useCallback((tool: McpTool) => {
    setSelectedTool(tool);
    // TODO: Fetch detailed tool information if needed for configuration/execution
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ACI MCP Tool Management</h1>

      {/* Tool Search Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Search Tools</h2>
        {/* Pass callbacks to ToolSearch to handle results, loading, and errors */}
        <ToolSearch
          onSearchResults={handleSearchResults}
          onLoading={handleLoading}
          onError={handleError}
        />

        {/* Display loading state */}
        {isLoading && <p>Loading...</p>}

        {/* Display error state */}
        {error && <p className="text-red-500">Error: {error.message}</p>}

        {/* Display search results */}
        {searchResults.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Search Results</h3>
            <ul>
              {searchResults.map((tool) => (
                <li
                  key={tool.id}
                  className="cursor-pointer hover:bg-gray-200 p-2 rounded"
                  onClick={() => handleToolSelect(tool)}
                >
                  {tool.name} - {tool.description}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Tool Details Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Tool Details</h2>
        {/* Display ToolDetails component if a tool is selected */}
        {selectedTool ? (
          <ToolDetails tool={selectedTool} />
        ) : (
          <p>Select a tool from the search results to view details.</p>
        )}
      </section>

      {/* Tool Configuration Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Tool Configuration</h2>
        {/* Display ToolConfiguration component if a tool is selected */}
        {selectedTool ? (
          <ToolConfiguration tool={selectedTool} />
        ) : (
          <p>Select a tool to configure.</p>
        )}
      </section>

      {/* Tool Execution Section */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Tool Execution</h2>
        {/* Display ToolExecution component if a tool is selected */}
        {selectedTool ? (
          <ToolExecution tool={selectedTool} />
        ) : (
          <p>Select a tool to execute.</p>
        )}
      </section>
    </div>
  );
};

export default AciMcpToolsPage;