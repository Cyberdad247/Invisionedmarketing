import React from 'react';
import { motion } from 'framer-motion';
import Logo from '../brand/Logo';
import MatrixBackground from '../brand/MatrixBackground';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  className = '' 
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className={`bg-white shadow-sm relative z-10 ${className}`}>
      <MatrixBackground intensity="light" />
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Logo variant="full" />
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-primary font-medium">Home</a>
            <a href="#" className="text-gray-700 hover:text-primary font-medium">Features</a>
            <a href="#" className="text-gray-700 hover:text-primary font-medium">Pricing</a>
            <a href="#" className="text-gray-700 hover:text-primary font-medium">Resources</a>
            <a href="#" className="text-gray-700 hover:text-primary font-medium">Contact</a>
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            <a href="#" className="text-primary hover:text-primary/80 font-medium">Sign In</a>
            <a href="#" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              Get Started
            </a>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <span className="text-2xl">×</span>
            ) : (
              <span className="text-xl">☰</span>
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div 
          className="md:hidden bg-white shadow-lg absolute w-full"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <a href="#" className="text-gray-700 hover:text-primary font-medium py-2">Home</a>
              <a href="#" className="text-gray-700 hover:text-primary font-medium py-2">Features</a>
              <a href="#" className="text-gray-700 hover:text-primary font-medium py-2">Pricing</a>
              <a href="#" className="text-gray-700 hover:text-primary font-medium py-2">Resources</a>
              <a href="#" className="text-gray-700 hover:text-primary font-medium py-2">Contact</a>
              <div className="pt-4 border-t border-gray-200 flex flex-col space-y-4">
                <a href="#" className="text-primary hover:text-primary/80 font-medium">Sign In</a>
                <a href="#" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors text-center">
                  Get Started
                </a>
              </div>
            </nav>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
