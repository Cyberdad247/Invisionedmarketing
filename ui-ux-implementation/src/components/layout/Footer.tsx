import React from 'react';
import { motion } from 'framer-motion';
import Logo from '../brand/Logo';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ 
  className = '' 
}) => {
  return (
    <footer className={`bg-gray-100 py-12 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Logo variant="full" className="mb-4" />
            <p className="text-sm text-gray-600 mt-4">
              Empowering small businesses through cutting-edge AI agent technology.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">RESOURCES</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-primary">Documentation</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary">API</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary">Tutorials</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary">Case Studies</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">COMPANY</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-primary">About Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary">Careers</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary">Press</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">CONNECT</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-primary">Twitter</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary">LinkedIn</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary">Facebook</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary">Instagram</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600">
            © 2025 Marketers In Black. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
