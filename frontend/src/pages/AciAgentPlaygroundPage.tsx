import React, { useState, useEffect } from 'react';
import SessionManager from '../components/aci/AgentPlayground/SessionManager';
import PlaygroundChat from '../components/aci/AgentPlayground/PlaygroundChat';
import { createPlaygroundSession, sendMessageToPlayground, PlaygroundMessage } from '../api/aci/playground'; // Import specific functions and types

// Define the message structure for the chat
interface Message {
  role: 'user' | 'agent'; // Aligning role type with backend/api definition
  content: string;
}

// Page component for the ACI Agent Playground
const AciAgentPlaygroundPage: React.FC = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Effect to create a new session on component mount
  useEffect(() => {
    const createNewSession = async () => {
      try {
        setLoading(true);
        setLoading(true);
        // Call the API to create a new playground session
        const response = await createPlaygroundSession();
        // Store the new session ID in the state
        setSessionId(response.id); // Assuming the session ID is in response.id

        // TODO: Implement fetching and displaying previous message history
        // try {
        //   // Assuming a getHistory function exists in the API module
        //   const historyResponse = await getHistory(response.id);
        //   // Update the messages state with the fetched history
        //   setMessages(historyResponse); // Assuming historyResponse is an array of messages
        // } catch (historyErr) {
        //   console.error('Failed to fetch session history:', historyErr);
        //   // Optionally set an error specifically for history loading
        // }

      } catch (err) {
        // Set error state if session creation fails
        setError('Failed to create session.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    createNewSession();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Function to handle sending a message
  const handleSendMessage = async (content: string) => {
    // Basic client-side validation: Ensure message content is not empty
    if (!content.trim()) {
      setError('Message cannot be empty.'); // Set a user-friendly error message for validation failure
      return; // Stop execution if validation fails
    }

    // Clear any previous errors
    setError(null);

    if (!sessionId) {
      console.error('No active session.');
      setError('No active session. Please refresh the page.'); // Provide a user-friendly message
      return;
    }

    // Create a new message object for the user's input
    const newMessage: Message = { role: 'user', content };
    // Add the user's message to the messages state immediately (optimistic update)
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      // Call the API to send the message to the active session
      const response: PlaygroundMessage = await sendMessageToPlayground(sessionId, content);
      // Add the agent's response to the messages list
      setMessages((prevMessages) => [...prevMessages, response]);
    } catch (err) {
      // Catch any errors during the API call
      setError('Failed to send message.'); // Set a user-friendly error message for API failure
      console.error("Error sending message to ACI Playground:", err); // Log the error for debugging
      // Remove the optimistic user message if sending failed
      setMessages((prevMessages) => prevMessages.filter(msg => msg !== newMessage));
    }
  };

  if (loading) {
    return <div>Loading playground...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Session Manager */}
      {sessionId && <SessionManager sessionId={sessionId} />}

      {/* Chat Interface */}
      <div className="flex-1">
        <PlaygroundChat messages={messages} onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default AciAgentPlaygroundPage;