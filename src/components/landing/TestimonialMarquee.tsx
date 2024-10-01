import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  { name: "Sarah L.", message: "This AI calorie tracker has revolutionized my diet!", rating: 5 },
  { name: "Mike R.", message: "So easy to use. I'm hitting my fitness goals faster than ever.", rating: 5 },
  { name: "Emily T.", message: "The accuracy of the AI is incredible. No more guesswork!", rating: 4 },
  { name: "David W.", message: "I've tried many apps, but this one is by far the best.", rating: 5 },
  { name: "Jessica M.", message: "Love how it learns my eating habits over time.", rating: 4 },
  { name: "Chris B.", message: "The AI suggestions have really improved my nutrition.", rating: 5 },
];

const TestimonialMarquee: React.FC = () => {
  return (
    <section className="bg-white py-16 overflow-hidden mb-16"> {/* Added mb-16 for bottom margin */}
      <h2 className="text-3xl font-bold text-center mb-8">What Our Users Say</h2>
      <motion.div
        className="flex"
        animate={{ x: [0, -2000] }}
        transition={{ 
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
      >
        {testimonials.concat(testimonials).map((testimonial, index) => (
          <div key={index} className="inline-block mx-4">
            <div className="bg-gray-100 rounded-lg shadow-md p-6 w-80 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <p className="font-semibold text-gray-800">{testimonial.name}</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-3">{testimonial.message}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export default TestimonialMarquee;
