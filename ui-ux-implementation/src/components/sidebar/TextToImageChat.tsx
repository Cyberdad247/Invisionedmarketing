import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TextToImageChatProps {
  className?: string;
}

const TextToImageChat: React.FC<TextToImageChatProps> = ({ 
  className = '' 
}) => {
  const [messages, setMessages] = useState<Array<{type: 'user' | 'ai', content: string, image?: string}>>([
    { type: 'ai', content: 'Hello! I can generate images based on your descriptions. What would you like to create today?' }
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    // Add user message
    const newMessages = [...messages, { type: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    
    // Simulate AI response with image generation
    setIsGenerating(true);
    setTimeout(() => {
      setMessages([
        ...newMessages,
        { 
          type: 'ai', 
          content: 'Here\'s what I created based on your prompt:',
          // Placeholder for actual image generation
          image: 'https://via.placeholder.com/512x512/4B0082/FFFFFF?text=AI+Generated+Image' 
        }
      ]);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className={`flex flex-col h-full bg-white rounded-lg shadow-md ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-primary">Text-to-Image Chat</h2>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            className={`mb-4 ${message.type === 'user' ? 'ml-auto' : 'mr-auto'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div 
              className={`p-3 rounded-lg max-w-[80%] ${
                message.type === 'user' 
                  ? 'bg-primary text-white ml-auto' 
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p>{message.content}</p>
              {message.image && (
                <div className="mt-2">
                  <img 
                    src={message.image} 
                    alt="AI Generated" 
                    className="rounded-md w-full max-w-xs mx-auto"
                  />
                </div>
              )}
            </div>
          </motion.div>
        ))}
        
        {isGenerating && (
          <div className="flex items-center justify-center p-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe the image you want to create..."
            className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isGenerating}
          />
          <button
            type="submit"
            className={`px-4 py-2 bg-primary text-white rounded-r-md ${
              isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'
            }`}
            disabled={isGenerating}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default TextToImageChat;
