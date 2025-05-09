import { agentApi } from '../../src/api/agent';
import { vi } from 'vitest';
import { Agent } from '../../src/types/agent';

describe('agentApi', () => {
  const testAgent: Agent = {
    id: '1',
    name: 'Test Agent',
    description: 'Test Description',
    framework: 'crewai',
    config: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch agents', async () => {
    const mockResponse = { ok: true, json: () => Promise.resolve([testAgent]) };
    vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

    const agents = await agentApi.getAgents();
    expect(agents).toEqual([testAgent]);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/agents'));
  });

  it('should handle fetch agents error', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'));
    await expect(agentApi.getAgents()).rejects.toThrow('Failed to fetch agents');
  });

  // TODO: Add tests for other API methods
});