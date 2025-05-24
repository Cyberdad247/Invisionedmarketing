import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface SubscriptionPlansProps {
  className?: string;
}

const plans = [
  {
    name: 'STARTER',
    price: '$29',
    period: 'month',
    features: [
      '1,000 Tokens per month',
      'Basic agent templates',
      'Standard support',
      '1 concurrent agent'
    ],
    variant: 'default'
  },
  {
    name: 'PROFESSIONAL',
    price: '$99',
    period: 'month',
    features: [
      '5,000 Tokens per month',
      'Advanced templates',
      'Priority support',
      '5 concurrent agents'
    ],
    variant: 'premium',
    recommended: true
  },
  {
    name: 'ENTERPRISE',
    price: '$299',
    period: 'month',
    features: [
      '20,000 Tokens per month',
      'Custom templates',
      'Dedicated support',
      'Unlimited agents'
    ],
    variant: 'default'
  }
];

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ 
  className = '' 
}) => {
  return (
    <div className={`py-16 bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">CHOOSE YOUR SUBSCRIPTION PLAN</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your business needs. Upgrade or downgrade anytime.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                variant={plan.variant === 'premium' ? 'premium' : 'default'} 
                className="h-full relative"
              >
                {plan.recommended && (
                  <div className="absolute -top-3 -right-3">
                    <div className="bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full">
                      RECOMMENDED
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-gray-500">/{plan.period}</span>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center">
                      <div className="mr-2 text-primary">•</div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-auto">
                  <Button 
                    variant={plan.variant === 'premium' ? 'secondary' : 'outline'} 
                    className="w-full"
                  >
                    SELECT PLAN
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
