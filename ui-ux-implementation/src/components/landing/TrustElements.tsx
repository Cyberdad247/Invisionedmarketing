import React from 'react';
import { motion } from 'framer-motion';

interface TrustElementsProps {
  className?: string;
}

const badges = [
  {
    icon: "🔒",
    title: "256-bit SSL",
    description: "Encryption"
  },
  {
    icon: "🛡️",
    title: "GDPR Compliant",
    description: "Privacy"
  },
  {
    icon: "🔐",
    title: "End-to-End",
    description: "Encryption"
  },
  {
    icon: "📝",
    title: "SOC 2 Type II",
    description: "Compliant"
  },
  {
    icon: "⏱️",
    title: "99.9% Uptime",
    description: "Guaranteed"
  }
];

const TrustElements: React.FC<TrustElementsProps> = ({ 
  className = '' 
}) => {
  return (
    <div className={`py-12 bg-white ${className}`}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">TRUSTED AND SECURE</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your data and privacy are our top priorities. We implement industry-leading security measures.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.title}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="text-3xl mb-2">{badge.icon}</div>
              <div className="font-bold text-center">{badge.title}</div>
              <div className="text-sm text-gray-600 text-center">{badge.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustElements;
