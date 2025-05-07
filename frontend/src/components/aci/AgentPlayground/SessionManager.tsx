import React from 'react';

interface SessionManagerProps {
  sessionId: string;
}

// Component for managing sessions in the Agent Playground
const SessionManager: React.FC<SessionManagerProps> = ({ sessionId }) => {
  return (
    <div className="p-4 border-b">
      {/* Basic UI element for session management */}
      <div>
        <span className="font-bold">Active Session ID:</span> {' '}
        {/* Display the session ID */}
        <span>{sessionId}</span>
      </div>
      {/* Add other session management elements as needed */}
    </div>
  );
};

export default SessionManager;