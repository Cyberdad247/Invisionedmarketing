import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="absolute top-0 left-0 right-0 p-4 fade-in">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Invisioned Marketing
        </Link>
        <div className="space-x-4">
          <Link to="/about" className="hover:text-blue-200">
            About
          </Link>
          <Link to="/services" className="hover:text-blue-200">
            Services
          </Link>
          <Link to="/contact" className="hover:text-blue-200">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;