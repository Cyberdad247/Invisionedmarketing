import React from 'react';
import { motion } from 'framer-motion';
import DigitalEye from './DigitalEye';
import MatrixBackground from './MatrixBackground';

interface LogoProps {
  variant?: 'full' | 'compact';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  variant = 'full',
  className = '' 
}) => {
  return (
    <motion.div 
      className={`flex items-center gap-3 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <DigitalEye size={variant === 'full' ? 'md' : 'sm'} />
      </div>
      
      {variant === 'full' && (
        <motion.div 
          className="flex flex-col"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-xl font-bold tracking-wider text-black">
            MARKETERS <span className="text-primary">IN</span> <span className="text-secondary">BLACK</span>
          </h1>
          <p className="text-xs text-gray-600">Empowering businesses with AI</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Logo;
