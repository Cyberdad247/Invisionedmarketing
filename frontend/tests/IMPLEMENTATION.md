# Test Implementation Guide

This document provides guidelines for implementing tests in the Agent Platform project.

## Testing Strategy

We follow a pyramid testing strategy with:

1. **Unit Tests**: Testing individual functions and components in isolation
2. **Integration Tests**: Testing interactions between components
3. **End-to-End Tests**: Testing complete user flows

## Technology Stack

- **Jest**: Test runner and assertion library
- **React Testing Library**: For testing React components
- **MSW (Mock Service Worker)**: For mocking API calls
- **User Event**: For simulating user interactions

## Best Practices

### General

- Write tests before or alongside the implementation (Test-Driven Development)
- Keep tests simple and focused on a single behavior
- Use descriptive test names that explain the expected behavior
- Organize tests in a way that mirrors the source code structure
- Aim for high code coverage but prioritize meaningful tests over coverage percentage

### Component Testing

- Test from the user's perspective (prefer testing behavior over implementation details)
- Use accessible queries (getByRole, getByLabelText, etc.) instead of targeting CSS classes or IDs
- Test user interactions and state changes
- Test edge cases and error scenarios

Example component test structure:

\`\`\`jsx
describe('ComponentName', () => {
  // Setup and teardown
  beforeEach(() => {
    // Common setup
  })
  
  afterEach(() => {
    // Cleanup
  })
  
  // Rendering tests
  it('renders correctly with default props', () => {})
  it('renders correctly with custom props', () => {})
  
  // Interaction tests
  it('handles button click correctly', () => {})
  it('updates form state when inputs change', () => {})
  
  // Edge cases and errors
  it('displays an error message when API call fails', () => {})
  it('handles empty data gracefully', () => {})
})
\`\`\`

### State Testing

For testing Zustand stores:

- Test initial state
- Test each action independently
- Mock external dependencies (API calls, etc.)
- Verify state changes after actions

### API Testing

- Mock API responses for consistent testing
- Test successful responses
- Test error handling
- Test edge cases (empty responses, malformed data, etc.)

## Continuous Integration

Tests are automatically run in our CI pipeline. To ensure your tests pass in CI:

- Avoid flaky tests (tests that sometimes pass and sometimes fail)
- Don't rely on specific timing (use `waitFor` when needed)
- Clean up after each test to avoid test interdependence
- Make sure all tests can run without network access

## Adding New Tests

When adding new components or features:

1. Create a corresponding test file in the appropriate directory
2. Write tests for the main functionality and edge cases
3. Run tests locally to verify they pass
4. Submit the tests along with your implementation
