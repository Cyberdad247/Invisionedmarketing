# Testing Guide

This directory contains tests for the frontend components and utilities of the Agent Platform.

## Structure

- `/components`: Tests for React components
- `/hooks`: Tests for custom hooks
- `/state`: Tests for state management (Zustand stores)
- `/utils`: Testing utilities and helpers

## Running Tests

To run the tests, use the following npm scripts:

\`\`\`bash
# Run all tests
npm test

# Run tests with coverage report
npm test -- --coverage

# Run tests in watch mode (useful during development)
npm test -- --watch

# Run a specific test file
npm test -- components/AgentForm.test.tsx
\`\`\`

## Writing Tests

### Component Tests

We use React Testing Library for testing components. Follow these patterns:

1. Import the component and required testing utilities
2. Mock any dependencies (API calls, context providers, etc.)
3. Render the component with required props
4. Query elements using accessible queries (getByRole, getByLabelText, etc.)
5. Interact with elements using fireEvent or userEvent
6. Assert on the expected outcomes

Example:

\`\`\`jsx
import { render, screen, fireEvent } from '../utils/test-utils'
import MyComponent from '@/components/MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('handles button click', () => {
    const handleClick = jest.fn()
    render(<MyComponent onClick={handleClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
\`\`\`

### Hooks Testing

For testing hooks, use the `renderHook` function from `@testing-library/react-hooks`:

\`\`\`jsx
import { renderHook, act } from '@testing-library/react'
import useCounter from '@/hooks/useCounter'

describe('useCounter', () => {
  it('increments counter', () => {
    const { result } = renderHook(() => useCounter())
    act(() => {
      result.current.increment()
    })
    expect(result.current.count).toBe(1)
  })
})
