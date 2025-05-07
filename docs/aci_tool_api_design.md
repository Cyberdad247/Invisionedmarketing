# ACI Tool API Endpoint Design

This document outlines the proposed API endpoints within the Invisionedmarketing FastAPI application for searching and executing existing tools via the embedded ACI MCP server logic.

## Proposed API Endpoints:

### 1. Search Tools

*   **Path:** `/api/v1/tools/search`
*   **HTTP Method:** `GET`
*   **Description:** Searches for available ACI tools based on a query string. This endpoint can be used to find tools relevant to a user's intent or keywords.
*   **Request Considerations:**
    *   Query Parameter `q` (string, optional): The search query (keywords, intent). If omitted, the endpoint could return a default list of popular or recently added tools.
    *   Query Parameter `limit` (int, optional, default: 20): The maximum number of results to return.
    *   Query Parameter `offset` (int, optional, default: 0): The number of results to skip for pagination.
*   **Response Considerations:**
    *   A JSON array of tool objects. Each object should contain essential details about the tool, such as its name, a brief description, and potentially input/output schema summaries. The structure would likely be similar to the `FunctionDetails` schema used in `backend/aci_integration/routes/app_store.py`.

### 2. Execute Tool

*   **Path:** `/api/v1/tools/{tool_name}/execute`
*   **HTTP Method:** `POST`
*   **Description:** Executes a specific ACI tool by name, providing the necessary input parameters in the request body.
*   **Request Considerations:**
    *   Path Parameter `tool_name` (string, required): The unique name of the tool to be executed.
    *   Request Body (JSON object, required): A JSON object containing the parameters required by the specified tool. The structure of this object must conform to the input schema defined by the tool.
*   **Response Considerations:**
    *   The response will contain the result of the tool execution. The format and content of the response will vary depending on the specific tool being executed. It could be a JSON object representing data returned by the tool, a status message indicating success or failure, or an error message if the execution failed (e.g., invalid parameters, tool error). For synchronous execution, the response will be the direct result. For potentially long-running tasks, the response might include a task ID to poll for results. For this initial design, we assume synchronous execution.

## Plan Overview:

1.  Define the two endpoints (`/api/v1/tools/search` and `/api/v1/tools/{tool_name}/execute`) in a new or existing router file within `backend/aci_integration/routes/`. A new file like `backend/aci_integration/routes/tool_execution.py` might be appropriate to separate this functionality from the app store listing.
2.  Implement the logic for the search endpoint, which will likely involve calling into the embedded ACI server's functionality to search or list tools with filtering.
3.  Implement the logic for the execute endpoint, which will involve receiving the tool name and parameters, validating them against the tool's schema (if possible), and calling the embedded ACI server's execution function.
4.  Integrate the new router into `backend/main.py`.
5.  Add necessary request and response models using Pydantic.