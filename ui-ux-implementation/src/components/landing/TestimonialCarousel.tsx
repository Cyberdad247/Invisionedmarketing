import React from 'react';
import { motion } from 'framer-motion';

interface TestimonialCarouselProps {
  className?: string;
}

const testimonials = [
  {
    quote: "Marketers In Black transformed our marketing strategy. The AI agents have increased our conversion rates by 35% in just two months.",
    author: "Jane Smith",
    title: "CEO of SmallBiz Solutions",
    image: "/testimonials/jane-smith.jpg" // Placeholder path
  },
  {
    quote: "The agent building process is intuitive and powerful. We've automated our entire content creation workflow and saved countless hours.",
    author: "Michael Johnson",
    title: "Marketing Director at TechGrowth",
    image: "/testimonials/michael-johnson.jpg" // Placeholder path
  },
  {
    quote: "The ROI we've seen from using Marketers In Black has been incredible. It's like having an entire marketing team at a fraction of the cost.",
    author: "Sarah Williams",
    title: "Founder of EcoStart",
    image: "/testimonials/sarah-williams.jpg" // Placeholder path
  }
];

const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({ 
  className = '' 
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className={`py-16 bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">WHAT OUR CLIENTS SAY</h2>
        </motion.div>
        
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="bg-white p-8 rounded-lg shadow-md relative"
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 text-xl italic text-gray-700">
              "{testimonials[currentIndex].quote}"
            </div>
            
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-4">
                {/* Placeholder for profile image */}
                <div className="w-full h-full rounded-full flex items-center justify-center text-white bg-primary">
                  {testimonials[currentIndex].author.charAt(0)}
                </div>
              </div>
              
              <div>
                <div className="font-bold">{testimonials[currentIndex].author}</div>
                <div className="text-sm text-gray-600">{testimonials[currentIndex].title}</div>
              </div>
            </div>
          </motion.div>
          
          <div className="flex justify-center mt-8">
            <button 
              onClick={prevTestimonial}
              className="mx-2 p-2 rounded-full hover:bg-gray-200"
              aria-label="Previous testimonial"
            >
              ←
            </button>
            
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`mx-1 w-3 h-3 rounded-full ${
                  index === currentIndex ? 'bg-primary' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
            
            <button 
              onClick={nextTestimonial}
              className="mx-2 p-2 rounded-full hover:bg-gray-200"
              aria-label="Next testimonial"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCarousel;
