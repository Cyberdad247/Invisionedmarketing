// frontend/src/api/aci/mcpTools.ts

// Placeholder types - replace with actual types based on backend design
export interface McpTool {
  id: string;
  name: string;
  description: string;
  // Add other relevant tool fields
}

export interface McpToolExecutionResult {
  // Define structure based on backend execution result
  result: any; // Placeholder
}

export interface McpToolConfiguration {
  // Define structure based on backend configuration
  configuration: any; // Placeholder
}

/**
 * Searches for available MCP Tools.
 * @param query Optional search query.
 * @returns A promise resolving to an array of McpTool.
 */
export async function searchMcpTools(query?: string): Promise<McpTool[]> {
  try {
    const url = query ? `/api/aci/mcp/tools?q=${encodeURIComponent(query)}` : '/api/aci/mcp/tools';
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: McpTool[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching MCP tools:", error);
    throw error;
  }
}

/**
 * Executes a specific MCP Tool.
 * @param toolId The ID of the tool to execute.
 * @param args The arguments for the tool execution.
 * @returns A promise resolving to the execution result.
 */
export async function executeMcpTool(toolId: string, args: any): Promise<McpToolExecutionResult> {
  try {
    const response = await fetch(`/api/aci/mcp/tools/${toolId}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(args),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: McpToolExecutionResult = await response.json();
    return data;
  } catch (error) {
    console.error(`Error executing MCP tool ${toolId}:`, error);
    throw error;
  }
}

/**
 * Configures a specific MCP Tool.
 * @param toolId The ID of the tool to configure.
 * @param configuration The configuration data.
 * @returns A promise resolving when the configuration is successful.
 */
export async function configureMcpTool(toolId: string, configuration: McpToolConfiguration): Promise<void> {
  try {
    const response = await fetch(`/api/aci/mcp/tools/${toolId}/configure`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(configuration),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error configuring MCP tool ${toolId}:`, error);
    throw error;
  }
}

/**
 * Registers a new MCP Tool.
 * @param toolData The data for the tool to register.
 * @returns A promise resolving to the registered McpTool.
 */
export async function registerMcpTool(toolData: any): Promise<McpTool> {
  try {
    const response = await fetch('/api/aci/mcp/tools', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toolData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: McpTool = await response.json();
    return data;
  } catch (error) {
    console.error("Error registering MCP tool:", error);
    throw error;
  }
}