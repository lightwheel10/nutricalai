import React from 'react';
import { motion } from 'framer-motion';
import { Twitter } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  { name: "Steven Tey", handle: "@steventey", message: "This AI calorie tracker is a game-changer! So easy to use.", avatar: "https://i.pravatar.cc/150?img=11" },
  { name: "Amritpal Chera", handle: "@achera23", message: "Loving how accurate the AI is at recognizing my meals!", avatar: "https://i.pravatar.cc/150?img=12" },
  { name: "Taishi JPCA", handle: "@taishik_", message: "Finally, a calorie tracker that doesn't feel like a chore to use.", avatar: "https://i.pravatar.cc/150?img=13" },
  { name: "Sand", handle: "@sxndrao", message: "The AI's ability to estimate portion sizes is impressive!", avatar: "https://i.pravatar.cc/150?img=14" },
  { name: "jordi", handle: "@jordienr", message: "This app has made tracking my macros so much easier.", avatar: "https://i.pravatar.cc/150?img=15" },
  { name: "Ben Everman", handle: "@beneverman", message: "The progress tracking feature is motivating me to stick to my diet!", avatar: "https://i.pravatar.cc/150?img=16" },
  { name: "Emma Watson", handle: "@emmawatson", message: "I love how I can just take a photo of my meal and get instant calorie info!", avatar: "https://i.pravatar.cc/150?img=5" },
  { name: "John Doe", handle: "@johndoe", message: "This app has helped me lose 10 pounds in just a month!", avatar: "https://i.pravatar.cc/150?img=17" },
  { name: "Samuel Smith", handle: "@samsmith", message: "The AI suggestions for healthier alternatives are so helpful.", avatar: "https://i.pravatar.cc/150?img=6" },
  { name: "Mike Johnson", handle: "@mikejohnson", message: "I'm amazed at how the AI learns my eating habits over time.", avatar: "https://i.pravatar.cc/150?img=18" },
  { name: "John Brown", handle: "@johnbrown", message: "The recipe feature based on my available ingredients is genius!", avatar: "https://i.pravatar.cc/150?img=7" },
  { name: "Tulip Wilson", handle: "@tupwilson", message: "I've never stuck to a diet plan this long before. Great app!", avatar: "https://i.pravatar.cc/150?img=19" },
];

const TestimonialCard: React.FC<typeof testimonials[0]> = ({ name, handle, message, avatar }) => (
  <div className="bg-white rounded-lg shadow-md p-4 m-2 w-80 border border-gray-200">
    <div className="flex items-center mb-2">
      <Avatar className="w-12 h-12 mr-3">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-grow">
        <p className="font-semibold text-sm">{name}</p>
        <p className="text-gray-500 text-xs">{handle}</p>
      </div>
      <Twitter className="w-5 h-5 text-blue-400" />
    </div>
    <p className="text-sm text-gray-600">{message}</p>
  </div>
);

const TestimonialMarquee: React.FC = () => {
  const upperTestimonials = testimonials.slice(0, 6);
  const lowerTestimonials = testimonials.slice(6);

  return (
    <section className="bg-gray-50 py-16 overflow-hidden">
      <h2 className="text-3xl font-bold text-center mb-8">What People Are Saying</h2>
      <div className="relative">
        <motion.div
          className="flex"
          animate={{ x: ["0%", "-100%"] }}
          transition={{ 
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 40,
              ease: "linear",
            },
          }}
        >
          <div className="flex">
            {upperTestimonials.map((testimonial, index) => (
              <TestimonialCard key={`upper-${index}`} {...testimonial} />
            ))}
          </div>
          <div className="flex">
            {upperTestimonials.map((testimonial, index) => (
              <TestimonialCard key={`upper-repeat-${index}`} {...testimonial} />
            ))}
          </div>
        </motion.div>
        <motion.div
          className="flex mt-4"
          animate={{ x: ["-100%", "0%"] }}
          transition={{ 
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 40,
              ease: "linear",
            },
          }}
        >
          <div className="flex">
            {lowerTestimonials.map((testimonial, index) => (
              <TestimonialCard key={`lower-${index}`} {...testimonial} />
            ))}
          </div>
          <div className="flex">
            {lowerTestimonials.map((testimonial, index) => (
              <TestimonialCard key={`lower-repeat-${index}`} {...testimonial} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialMarquee;