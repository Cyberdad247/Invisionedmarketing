import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

interface SubscriptionFlowProps {
  className?: string;
  step?: number;
}

const SubscriptionFlow: React.FC<SubscriptionFlowProps> = ({ 
  className = '',
  step = 1
}) => {
  const [currentStep, setCurrentStep] = React.useState(step);
  const [selectedPlan, setSelectedPlan] = React.useState('professional');
  
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
      id: 'starter'
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
      id: 'professional'
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
      id: 'enterprise'
    }
  ];

  const handleContinue = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className={`py-8 ${className}`}>
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    stepNumber === currentStep 
                      ? 'bg-primary text-white' 
                      : stepNumber < currentStep 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {stepNumber < currentStep ? '✓' : stepNumber}
                </div>
                <div className="text-xs mt-2 text-gray-600">
                  {stepNumber === 1 && 'Plan'}
                  {stepNumber === 2 && 'Billing'}
                  {stepNumber === 3 && 'Review'}
                  {stepNumber === 4 && 'Confirm'}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 h-1 bg-gray-200 relative">
            <div 
              className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
              style={{ width: `${(currentStep - 1) * 33.33}%` }}
            ></div>
          </div>
        </div>
        
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          {currentStep === 1 && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-center">SELECT YOUR PLAN</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {plans.map((plan) => (
                  <div 
                    key={plan.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedPlan === plan.id 
                        ? 'border-primary shadow-md' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-bold">{plan.name}</h3>
                      <div className="mt-2">
                        <span className="text-2xl font-bold">{plan.price}</span>
                        <span className="text-gray-500">/{plan.period}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-center">
                          <div className="mr-2 text-primary">•</div>
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <button 
                      className={`w-full py-2 rounded-md font-medium transition-colors ${
                        selectedPlan === plan.id 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      SELECT
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {currentStep === 2 && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-center">BILLING INFORMATION</h2>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="john.doe@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Acme Inc."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <div className="flex space-x-4">
                    <button className="px-4 py-2 border border-primary bg-primary/10 text-primary rounded-md">
                      Credit Card
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md">
                      PayPal
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md">
                      Bank Transfer
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiration Date
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Security Code
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          
          {currentStep === 3 && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-center">REVIEW YOUR ORDER</h2>
              <div className="mb-6">
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <div className="font-bold mb-2">Selected Plan: PROFESSIONAL</div>
                  <div className="text-lg mb-2">Price: $99/month</div>
                  
                  <div className="mt-4">
                    <div className="font-medium mb-2">Plan Features:</div>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>5,000 Tokens per month</li>
                      <li>Advanced agent templates</li>
                      <li>Priority support</li>
                      <li>5 concurrent agents</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="font-bold mb-2">Billing Information:</div>
                  <div>John Doe</div>
                  <div>john.doe@example.com</div>
                  <div className="mt-2">Payment Method: Credit Card (ending in 1234)</div>
                </div>
                
                <div className="mt-6">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">
                      I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                    </span>
                  </label>
                </div>
              </div>
            </>
          )}
          
          {currentStep === 4 && (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <span className="text-green-500 text-2xl">✓</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">SUBSCRIPTION CONFIRMED</h2>
                <p className="text-gray-600">Thank you for subscribing to Marketers In Black!</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <div className="font-medium mb-2">Your PROFESSIONAL plan is now active.</div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex">
                    <span className="font-medium w-40">Order #:</span>
                    <span>MIB-12345</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-40">Date:</span>
                    <span>May 24, 2025</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-40">Amount:</span>
                    <span>$99.00</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-40">Next Billing Date:</span>
                    <span>June 24, 2025</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-600 mb-6">
                A confirmation email has been sent to john.doe@example.com
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button variant="primary">GET STARTED WITH YOUR AGENT</Button>
                <Button variant="outline">VIEW DASHBOARD</Button>
              </div>
            </>
          )}
          
          {currentStep < 4 && (
            <div className="flex justify-between mt-6">
              {currentStep > 1 ? (
                <button
                  onClick={handleBack}
                  className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  BACK
                </button>
              ) : (
                <div></div>
              )}
              
              <button
                onClick={handleContinue}
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                {currentStep === 3 ? 'CONFIRM PURCHASE' : 'CONTINUE'}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SubscriptionFlow;
