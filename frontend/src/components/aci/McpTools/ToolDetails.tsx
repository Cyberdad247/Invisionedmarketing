import React from 'react';
import { McpTool } from '../../../api/aci/mcpTools'; // Import McpTool type

interface ToolDetailsProps {
  /** The selected MCP tool to display details for. */
  tool: McpTool;
}

/**
 * ToolDetails component
 * This component displays the details of a selected ACI MCP tool.
 * It receives the tool data as a prop and renders its name and description.
 */
const ToolDetails: React.FC<ToolDetailsProps> = ({ tool }) => {
  return (
    <div className="border p-4">
      {/* Display tool name */}
      <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
      {/* Display tool description */}
      <p>{tool.description}</p>
      {/* Add other relevant tool details here as needed */}
    </div>
  );
};

export default ToolDetails;