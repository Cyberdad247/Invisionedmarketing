# Guidelines for `utils` and `services` directories

This document outlines the intended purpose of the `utils` and `services` directories to ensure clarity and consistency in project structure.

## `src/utils`

The `utils` directory should contain pure utility functions. These functions are typically:

*   Stateless: They don't maintain any internal state.
*   Reusable: They can be used across different parts of the application.
*   Independent: They don't have specific dependencies on the application's business logic.

**Examples:**

*   Date formatting functions
*   String manipulation functions
*   Common calculation functions

## `src/services`

The `services` directory should contain services that interact with external resources or handle business logic. These services might:

## Code Splitting

This project utilizes Vite's built-in code splitting capabilities. Vite automatically code-splits based on entry points and dynamic imports (`import()`). To optimize performance, use dynamic imports for components or modules that are not needed on the initial page load.

*   Manage application state.
*   Interact with APIs or databases.
*   Implement specific business rules or workflows.

**Examples:**

*   Functions for fetching data from a server
*   Authentication services
*   Payment processing services