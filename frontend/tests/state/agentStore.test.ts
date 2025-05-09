import { renderHook, act } from '@testing-library/react';
import { useAgentStore } from '../../src/state/agentStore';
import { Agent } from '../../src/types/agent';

describe('useAgentStore', () => {
  const testAgent: Agent = {
    id: 1,
    name: 'Test Agent',
    description: 'Test Description',
    framework: 'crewai',
    config: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    const { result } = renderHook(() => useAgentStore());
    act(() => result.current.agents = []);
  });

  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useAgentStore());
    expect(result.current.agents).toEqual([]);
    expect(result.current.selectedAgent).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should select an agent', () => {
    const { result } = renderHook(() => useAgentStore());
    act(() => result.current.selectAgent(testAgent));
    expect(result.current.selectedAgent).toEqual(testAgent);
  });

  // TODO: Add tests for async actions once API mocking is set up
});