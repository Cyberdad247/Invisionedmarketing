import React, { useState, useCallback } from 'react';
import { searchMcpTools, McpTool } from '../../../api/aci/mcpTools';

interface ToolSearchProps {
  /** Callback function to handle search results. */
  onSearchResults: (tools: McpTool[]) => void;
  /** Callback function to indicate loading state. */
  onLoading: (isLoading: boolean) => void;
  /** Callback function to handle errors. */
  onError: (error: Error | null) => void;
}

/**
 * ToolSearch component
 * This component provides the UI for searching ACI MCP tools.
 * It includes an input field and a search button.
 * It handles user input, triggers the search API call, and manages loading/error states.
 */
const ToolSearch: React.FC<ToolSearchProps> = ({ onSearchResults, onLoading, onError }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Handle input change to update the search query state
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  }, []);

  // Handle search button click to trigger the search
  const handleSearchClick = useCallback(async () => {
    // Basic client-side validation: Ensure query is not empty
    if (!query.trim()) {
      const validationError = new Error('Search query cannot be empty.');
      setError(validationError); // Set local error state
      onError(validationError); // Pass error to parent component
      onSearchResults([]); // Clear previous results on validation error
      return; // Stop execution if validation fails
    }

    setIsLoading(true);
    setError(null); // Clear previous errors
    onLoading(true);
    try {
      // Attempt to search for tools
      const results = await searchMcpTools(query);
      onSearchResults(results);
    } catch (err) {
      // Catch any errors during the API call
      const apiError = err as Error;
      setError(apiError); // Set local error state
      onError(apiError); // Pass error to parent component
      onSearchResults([]); // Clear previous results on API error
      console.error("Error searching MCP tools:", apiError); // Log the error for debugging
    } finally {
      // Always set loading to false after the attempt
      setIsLoading(false);
      onLoading(false);
    }
  }, [query, onSearchResults, onLoading, onError]); // Include all dependencies

  return (
    <div>
      {/* Input field for tool search */}
      <input
        type="text"
        placeholder="Search for tools..."
        className="border p-2 mr-2"
        value={query}
        onChange={handleInputChange}
        disabled={isLoading} // Disable input while loading
      />
      {/* Button to trigger the search */}
      <button
        className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
        onClick={handleSearchClick}
        disabled={isLoading} // Disable button while loading
      >
        Search
      </button>

      {/* Display loading state */}
      {isLoading && <p>Loading...</p>}

      {/* Display error state */}
      {error && <p className="text-red-500">Error: {error.message}</p>}
    </div>
  );
};

export default ToolSearch;