import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

interface CallToActionProps {
  className?: string;
}

const CallToAction: React.FC<CallToActionProps> = ({ 
  className = '' 
}) => {
  return (
    <div className={`py-16 bg-gradient-to-r from-primary/10 to-secondary/10 ${className}`}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            READY TO TRANSFORM YOUR MARKETING?
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Join thousands of businesses already leveraging AI agents to automate, optimize, and scale their marketing efforts.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              variant="primary" 
              size="lg"
            >
              GET STARTED NOW
            </Button>
            <Button 
              variant="secondary" 
              size="lg"
            >
              SCHEDULE A DEMO
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CallToAction;
