import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  variant?: 'default' | 'premium' | 'outlined';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  variant = 'default',
  children,
  className = '',
  onClick,
  hover = true
}) => {
  const baseClasses = 'rounded-lg p-6 transition-all duration-300';
  
  const variantClasses = {
    default: 'bg-white shadow-md',
    premium: 'bg-white border border-secondary shadow-lg',
    outlined: 'border border-gray-200'
  };

  const hoverClasses = hover ? 'hover:shadow-lg hover:-translate-y-1' : '';

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { scale: 1.02 } : {}}
    >
      {variant === 'premium' && (
        <div className="absolute -top-3 -right-3">
          <div className="bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full">
            PREMIUM
          </div>
        </div>
      )}
      {children}
    </motion.div>
  );
};

export default Card;
