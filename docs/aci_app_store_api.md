# ACI App Store API Endpoints

These endpoints are designed to allow a frontend application to fetch and display available tools and integrations from the embedded ACI App Store within the Invisionedmarketing FastAPI application.

## List available Tools/Integrations

*   **Endpoint:** `/functions`
*   **Method:** `GET`
*   **Description:** Retrieves a list of all available functions (tools/integrations). This endpoint supports filtering by app names, limiting the number of results, and pagination using offset via query parameters. It is intended for populating the main listing view of the App Store.

## Fetch Details for a single Tool/Integration

*   **Endpoint:** `/functions/{function_name}/definition`
*   **Method:** `GET`
*   **Description:** Retrieves the detailed definition for a specific function (tool/integration). The function is identified by its unique name (`function_name`). A query parameter can be used to specify the desired format of the definition (e.g., 'openai', 'anthropic', 'basic'). This endpoint is suitable for displaying detailed information about a tool/integration when a user selects it from the listing.