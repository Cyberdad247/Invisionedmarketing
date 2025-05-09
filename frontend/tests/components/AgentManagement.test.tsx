import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { AgentManagement } from '../../src/components/AgentManagement';
import { useAgentStore } from '../../src/state/agentStore';

// Mock the agent store
vi.mock('../../src/state/agentStore', () => ({
  useAgentStore: vi.fn(() => ({
    agents: [],
    selectedAgent: null,
    loading: false,
    error: null,
    fetchAgents: vi.fn(),
    selectAgent: vi.fn(),
    createAgent: vi.fn(),
    updateAgent: vi.fn(),
    deleteAgent: vi.fn(),
  })),
}));

describe('AgentManagement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<AgentManagement />);
    expect(screen.getByText('Agent Management')).toBeInTheDocument();
  });

  it('displays agent creation form', () => {
    render(<AgentManagement />);
    expect(screen.getByPlaceholderText('Agent Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
    expect(screen.getByText('Create Agent')).toBeInTheDocument();
  });

  it('calls createAgent when form is submitted', async () => {
    const mockCreateAgent = vi.fn();
    vi.mocked(useAgentStore).mockImplementation(() => ({
      ...useAgentStore(),
      createAgent: mockCreateAgent,
    }));

    render(<AgentManagement />);
    
    fireEvent.change(screen.getByPlaceholderText('Agent Name'), {
      target: { value: 'Test Agent' },
    });
    fireEvent.change(screen.getByPlaceholderText('Description'), {
      target: { value: 'Test Description' },
    });
    fireEvent.click(screen.getByText('Create Agent'));

    await waitFor(() => {
      expect(mockCreateAgent).toHaveBeenCalledWith({
        name: 'Test Agent',
        description: 'Test Description',
        framework: 'crewai',
        config: {},
      });
    });
  });

  // TODO: Add more tests for agent list, selection, and deletion

  it('displays a list of agents when agents are present', () => {
    const mockAgents = [
      { id: '1', name: 'Agent Alpha', description: 'Description Alpha', framework: 'crewai', config: {} },
      { id: '2', name: 'Agent Beta', description: 'Description Beta', framework: 'crewai', config: {} },
    ];
    vi.mocked(useAgentStore).mockImplementation(() => ({
      ...useAgentStore(),
      agents: mockAgents,
      fetchAgents: vi.fn().mockResolvedValue(undefined),
    }));

    render(<AgentManagement />);

    expect(screen.getByText('Agent Alpha')).toBeInTheDocument();
    expect(screen.getByText('Agent Beta')).toBeInTheDocument();
  });

  it('calls selectAgent when an agent item is clicked', async () => {
    const mockSelectAgent = vi.fn();
    const mockAgents = [
      { id: '1', name: 'Selectable Agent', description: 'Click me', framework: 'crewai', config: {} },
    ];
    vi.mocked(useAgentStore).mockImplementation(() => ({
      ...useAgentStore(),
      agents: mockAgents,
      selectAgent: mockSelectAgent,
      fetchAgents: vi.fn().mockResolvedValue(undefined),
    }));

    render(<AgentManagement />);
    
    // Assuming agent name is part of the clickable element for selection
    fireEvent.click(screen.getByText('Selectable Agent'));

    await waitFor(() => {
      expect(mockSelectAgent).toHaveBeenCalledWith(mockAgents[0].id);
    });
  });

  it('calls deleteAgent when delete button for an agent is clicked', async () => {
    const mockDeleteAgent = vi.fn();
    const agentToDelete = { id: '1', name: 'Deletable Agent', description: 'Delete me', framework: 'crewai', config: {} };
    vi.mocked(useAgentStore).mockImplementation(() => ({
      ...useAgentStore(),
      agents: [agentToDelete],
      deleteAgent: mockDeleteAgent,
      fetchAgents: vi.fn().mockResolvedValue(undefined),
    }));

    render(<AgentManagement />);
    
    const agentItemContainer = screen.getByText('Deletable Agent').closest('div, li, tr, article'); // Common parent elements
    if (!agentItemContainer) {
      throw new Error('Agent item container not found for deletion test. The component might not render agents as expected or the agent name is not unique.');
    }

    const deleteButton = within(agentItemContainer).getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteAgent).toHaveBeenCalledWith(agentToDelete.id);
    });
  });
});