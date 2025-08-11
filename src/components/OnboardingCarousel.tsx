import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Play, Gift, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OnboardingCarouselProps {
  onComplete: () => void;
}

const OnboardingCarousel = ({ onComplete }: OnboardingCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: <Play className="w-16 h-16" />,
      title: "Go Live & Earn Rewards",
      description: "Start streaming and earn coins from your viewers. Turn your passion into profit!",
      color: "from-primary to-primary-glow",
      animation: "bounce",
    },
    {
      icon: <Users className="w-16 h-16" />,
      title: "Meet Friends Worldwide",
      description: "Connect with people from around the globe. Make new friends and grow your community!",
      color: "from-secondary to-accent",
      animation: "bounce",
    },
    {
      icon: <Gift className="w-16 h-16" />,
      title: "Send Virtual Gifts",
      description: "Support your favorite streamers with beautiful virtual gifts and see amazing animations!",
      color: "from-accent to-secondary",
      animation: "sparkle",
    },
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const skipToEnd = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Skip Button */}
      <div className="flex justify-end p-4">
        <Button variant="ghost" onClick={skipToEnd} className="text-muted-foreground">
          Skip Intro
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="text-center max-w-sm"
          >
            <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${slides[currentSlide].color} flex items-center justify-center mb-8 mx-auto shadow-neon`}>
              <motion.div
                className="text-white"
                animate={slides[currentSlide].animation === "bounce" ? { y: [-5, 5, -5] } : { rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {slides[currentSlide].icon}
              </motion.div>
            </div>

            <h2 className="text-3xl font-black text-foreground mb-4 text-gradient-primary">
              {slides[currentSlide].title}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {slides[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Progress Indicators */}
        <div className="flex gap-2 mb-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-primary shadow-neon"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Action Button */}
        <Button
          onClick={nextSlide}
          size="lg"
          className="bg-gradient-to-r from-primary to-secondary text-white font-bold px-8 py-4 rounded-full shadow-neon hover:scale-105 transition-all duration-300"
        >
          {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
          <ChevronRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default OnboardingCarousel;