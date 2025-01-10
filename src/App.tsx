import React from 'react';
import { Menu, Home, User, Briefcase, Mail, X } from 'lucide-react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import heroImage from '"C:\Users\vizio\Downloads\1ee63fdd-05de-46d7-9b22-e48de34ab33b.jpg"';

// Pages
const HomePage = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="relative h-[80vh] flex items-center justify-center text-white">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Invisioned Marketing"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#050206]" />
        </div>
        <div className="relative text-center space-y-4 p-8">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            Invisioned Marketing
          </h1>
          <p className="text-2xl font-light text-blue-200">Dreams Don't Come True, Visions Do</p>
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">About Us</h2>
        <p className="text-xl text-gray-300 text-center">
          Empowering businesses with AI-driven marketing solutions to bring your visions to life.
        </p>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-primary/20 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-secondary/20 p-8 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4">AI Marketing</h3>
              <p className="text-gray-300">Innovative strategies powered by artificial intelligence.</p>
            </div>
            <div className="bg-secondary/20 p-8 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4">Web Development</h3>
              <p className="text-gray-300">Custom-built, responsive websites tailored to your brand.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">Contact Us</h2>
        <p className="text-xl text-center">
          Ready to get started?{' '}
          <a
            href="mailto:info@invisionedmarketing.com"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Let's talk!
          </a>
        </p>
      </section>
    </div>
  );
};

const AboutPage = () => (
  <div className="max-w-4xl mx-auto px-4 py-16">
    <h2 className="text-3xl font-bold mb-8">About Us</h2>
    <p className="text-xl text-gray-300">
      Empowering businesses with AI-driven marketing solutions to bring your visions to life.
    </p>
  </div>
);

const ServicesPage = () => (
  <div className="max-w-4xl mx-auto px-4 py-16">
    <h2 className="text-3xl font-bold mb-12">Our Services</h2>
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-secondary/20 p-8 rounded-lg backdrop-blur-sm">
        <h3 className="text-xl font-semibold mb-4">AI Marketing</h3>
        <p className="text-gray-300">Innovative strategies powered by artificial intelligence.</p>
      </div>
      <div className="bg-secondary/20 p-8 rounded-lg backdrop-blur-sm">
        <h3 className="text-xl font-semibold mb-4">Web Development</h3>
        <p className="text-gray-300">Custom-built, responsive websites tailored to your brand.</p>
      </div>
    </div>
  </div>
);

const ContactPage = () => (
  <div className="max-w-4xl mx-auto px-4 py-16">
    <h2 className="text-3xl font-bold mb-8">Contact Us</h2>
    <p className="text-xl">
      Ready to get started?{' '}
      <a
        href="mailto:info@invisionedmarketing.com"
        className="text-blue-400 hover:text-blue-300 transition-colors"
      >
        Let's talk!
      </a>
    </p>
  </div>
);

function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen bg-[#050206]">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-sm shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-white">
                Invisioned
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                About
              </Link>
              <Link to="/services" className="text-gray-300 hover:text-white transition-colors">
                Services
              </Link>
              <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 flex z-50 md:hidden transform ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#050206]">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 px-2 space-y-1">
              <Link
                to="/"
                className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <Home className="mr-4 h-6 w-6" />
                Home
              </Link>
              <Link
                to="/about"
                className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <User className="mr-4 h-6 w-6" />
                About
              </Link>
              <Link
                to="/services"
                className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <Briefcase className="mr-4 h-6 w-6" />
                Services
              </Link>
              <Link
                to="/contact"
                className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <Mail className="mr-4 h-6 w-6" />
                Contact
              </Link>
            </nav>
          </div>
        </div>
        <div className="flex-shrink-0 w-14" onClick={() => setIsMenuOpen(false)}></div>
      </div>

      {/* Main content */}
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </div>

      {/* Footer */}
      <footer className="bg-black/30 mt-16">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400">
            &copy; 2025 Invisioned Marketing. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;