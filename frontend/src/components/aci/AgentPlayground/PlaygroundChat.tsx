import React, { useState } from 'react';

interface Message {
  role: 'user' | 'agent'; // Aligning role type with backend/api definition
  content: string;
}

interface PlaygroundChatProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
}

// Component for the chat interface within the Agent Playground
// Component for the chat interface within the Agent Playground
const PlaygroundChat: React.FC<PlaygroundChatProps> = ({ messages, onSendMessage }) => {
  // State to manage the user's input in the chat field
  const [input, setInput] = useState('');

  // Function to handle sending a message
  const handleSendMessage = () => {
    // Check if the input is not empty or just whitespace
    if (input.trim()) {
      // Call the onSendMessage prop with the current input value
      onSendMessage(input);
      // Clear the input field after sending the message
      setInput('');
    }
  };

  // Function to handle key press events in the input field
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // If the pressed key is 'Enter', send the message
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Area to display messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Display messages */}
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              {message.content}
            </span>
          </div>
        ))}
      </div>

      {/* Input field for user prompts */}
      <div className="p-4 border-t flex">
        {/* Input element for typing messages */}
        <input
          type="text"
          placeholder="Enter your prompt..."
          className="flex-1 p-2 border rounded-l"
          value={input}
          // Update the input state as the user types
          onChange={(e) => setInput(e.target.value)}
          // Handle sending message on Enter key press
          onKeyPress={handleKeyPress}
        />
        {/* Button to send the message */}
        <button
          className="bg-blue-500 text-white p-2 rounded-r disabled:opacity-50"
          // Call handleSendMessage when the button is clicked
          onClick={handleSendMessage}
          // Disable the button if the input is empty or just whitespace
          disabled={!input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default PlaygroundChat;