import React from 'react';
import { motion } from 'framer-motion';

interface DigitalEyeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const DigitalEye: React.FC<DigitalEyeProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <motion.div 
      className={`digital-eye relative rounded-full ${sizeClasses[size]} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.1 }}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal to-dark-blue">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-white opacity-80">MIB</span>
        </div>
      </div>
      <div className="absolute inset-0 rounded-full bg-matrix-green opacity-10 matrix-code"></div>
    </motion.div>
  );
};

export default DigitalEye;
