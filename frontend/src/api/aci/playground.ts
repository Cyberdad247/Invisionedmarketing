// frontend/src/api/aci/playground.ts

// Placeholder types - replace with actual types based on backend design
export interface PlaygroundSession {
  id: string;
  // Add other relevant session fields
}

export interface PlaygroundMessage {
  role: 'user' | 'agent';
  content: string;
  // Add other relevant message fields
}

/**
 * Creates a new Agent Playground session.
 * @returns A promise resolving to the created PlaygroundSession.
 */
export async function createPlaygroundSession(): Promise<PlaygroundSession> {
  try {
    const response = await fetch('/api/aci/playground/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add any required body for session creation if needed
      body: JSON.stringify({}),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: PlaygroundSession = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating playground session:", error);
    throw error;
  }
}

/**
 * Sends a message to an existing Agent Playground session.
 * @param sessionId The ID of the session.
 * @param message The message content to send.
 * @returns A promise resolving to the response from the session.
 */
export async function sendMessageToPlayground(sessionId: string, message: string): Promise<PlaygroundMessage> {
  try {
    const response = await fetch(`/api/aci/playground/sessions/${sessionId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: message }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: PlaygroundMessage = await response.json();
    return data;
  } catch (error) {
    console.error(`Error sending message to playground session ${sessionId}:`, error);
    throw error;
  }
}