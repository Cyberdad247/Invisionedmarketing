import React from 'react';
import { motion } from 'framer-motion';

interface MatrixBackgroundProps {
  className?: string;
  intensity?: 'light' | 'medium' | 'heavy';
}

const MatrixBackground: React.FC<MatrixBackgroundProps> = ({ 
  className = '',
  intensity = 'medium'
}) => {
  const intensityClasses = {
    light: 'opacity-5',
    medium: 'opacity-10',
    heavy: 'opacity-20'
  };

  return (
    <motion.div 
      className={`absolute inset-0 overflow-hidden matrix-code ${intensityClasses[intensity]} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <div className="absolute inset-0 bg-matrix-green"></div>
    </motion.div>
  );
};

export default MatrixBackground;
