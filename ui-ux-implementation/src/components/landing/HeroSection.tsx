import React from 'react';
import Logo from '../brand/Logo';
import { motion } from 'framer-motion';
import MatrixBackground from '../brand/MatrixBackground';
import Button from '../ui/Button';

interface HeroSectionProps {
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  className = '' 
}) => {
  return (
    <div className={`relative overflow-hidden bg-white py-16 ${className}`}>
      <MatrixBackground intensity="light" />
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div 
            className="md:w-1/2 mb-10 md:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Empower Your Business with <span className="text-primary">AI Agents</span>
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Build, Deploy, and Scale AI Agents that Transform Your Marketing. 
              Unlock the power of artificial intelligence to drive results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="primary" 
                size="lg"
              >
                GET STARTED
              </Button>
              <Button 
                variant="outline" 
                size="lg"
              >
                VIEW PLANS
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            className="md:w-1/2 relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative w-full h-80 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg overflow-hidden">
              <div className="absolute inset-0 matrix-code"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 relative">
                  <div className="absolute inset-0 digital-eye"></div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white to-transparent"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
