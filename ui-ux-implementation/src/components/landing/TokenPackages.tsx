import React from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';

interface TokenPackagesProps {
  className?: string;
}

const packages = [
  {
    name: 'BASIC PACKAGE',
    tokens: '1,000',
    price: '$19',
    description: 'Best for testing and small projects',
  },
  {
    name: 'STANDARD PACKAGE',
    tokens: '5,000',
    price: '$79',
    description: 'Perfect for small businesses',
    featured: true
  },
  {
    name: 'PREMIUM PACKAGE',
    tokens: '10,000',
    price: '$149',
    description: 'Ideal for businesses with high volume needs',
  }
];

const TokenPackages: React.FC<TokenPackagesProps> = ({ 
  className = '' 
}) => {
  return (
    <div className={`py-16 bg-white ${className}`}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">TOKEN PACKAGES</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Purchase tokens to power your AI agents. The more tokens you buy, the more you save.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                variant={pkg.featured ? 'premium' : 'default'} 
                className="h-full token-package"
              >
                <div className="flex justify-center mb-6">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center ${pkg.featured ? 'bg-secondary/20' : 'bg-primary/10'}`}>
                    <span className={`text-2xl font-bold ${pkg.featured ? 'text-secondary' : 'text-primary'}`}>
                      {pkg.tokens.split(',')[0]}K
                    </span>
                  </div>
                </div>
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold">{pkg.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{pkg.price}</span>
                  </div>
                  <div className="mt-1 text-gray-600">
                    {pkg.tokens} Tokens
                  </div>
                </div>
                
                <div className="text-center text-gray-600 mb-8">
                  {pkg.description}
                </div>
                
                <div className="mt-auto">
                  <button 
                    className={`w-full py-2 rounded-md font-medium transition-colors ${
                      pkg.featured 
                        ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90' 
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                  >
                    PURCHASE
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TokenPackages;
