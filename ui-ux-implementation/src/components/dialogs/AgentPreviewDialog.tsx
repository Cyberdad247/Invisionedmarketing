import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from '../ui/dialog';
import Button from '../ui/Button';

interface AgentPreviewDialogProps {
  children: React.ReactNode;
  className?: string;
}

const AgentPreviewDialog: React.FC<AgentPreviewDialogProps> = ({ 
  children,
  className = '' 
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Agent Preview</DialogTitle>
          <DialogDescription>
            Test your agent before deploying it to production.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="border rounded-md p-4 h-64 overflow-y-auto">
            <div className="flex flex-col space-y-4">
              <div className="bg-gray-100 p-3 rounded-lg max-w-[80%]">
                <p>Hello! I'm your AI marketing agent. How can I help you today?</p>
              </div>
              
              <div className="bg-primary text-white p-3 rounded-lg max-w-[80%] ml-auto">
                <p>Can you help me create a social media campaign?</p>
              </div>
              
              <div className="bg-gray-100 p-3 rounded-lg max-w-[80%]">
                <p>Absolutely! I'd be happy to help you create a social media campaign. Could you tell me more about your target audience and campaign goals?</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex">
            <input
              type="text"
              placeholder="Type a message to test your agent..."
              className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              className="px-4 py-2 bg-primary text-white rounded-r-md hover:bg-primary/90"
            >
              Send
            </button>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline">Close</Button>
          <Button>Deploy Agent</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AgentPreviewDialog;
