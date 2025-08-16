import { motion, AnimatePresence } from "framer-motion";
import { useGiftAnimations } from "@/hooks/useGiftAnimations";

interface GiftAnimationOverlayProps {
  className?: string;
}

const GiftAnimationOverlay = ({ className = "" }: GiftAnimationOverlayProps) => {
  const { currentAnimation, particles, acknowledgmentMessage } = useGiftAnimations();

  const getAnimationVariants = (animationType: string, value: number) => {
    const baseScale = value >= 500 ? 3 : value >= 100 ? 2.5 : 2;
    
    switch (animationType) {
      case 'explode':
        return {
          initial: { scale: 0, opacity: 0, rotate: 0 },
          animate: { 
            scale: [0, baseScale, baseScale * 0.8], 
            opacity: [0, 1, 1, 0], 
            rotate: [0, 360],
            transition: { duration: value >= 500 ? 3 : 2, times: [0, 0.3, 0.7, 1] }
          }
        };
      case 'sparkle':
        return {
          initial: { scale: 0, opacity: 0, y: 50 },
          animate: { 
            scale: [0, baseScale, baseScale * 1.2, baseScale], 
            opacity: [0, 1, 1, 0], 
            y: [50, 0, -20, 0],
            transition: { duration: value >= 500 ? 4 : 2.5, times: [0, 0.2, 0.6, 1] }
          }
        };
      case 'royal':
      case 'majestic':
        return {
          initial: { scale: 0, opacity: 0, y: -100, rotate: 0 },
          animate: { 
            scale: [0, baseScale * 1.5, baseScale], 
            opacity: [0, 1, 1, 0], 
            y: [-100, 0, 0, 100],
            rotate: [0, 15, -15, 0],
            transition: { duration: 5, times: [0, 0.3, 0.8, 1] }
          }
        };
      case 'float':
      default:
        return {
          initial: { scale: 0, opacity: 0, y: 0 },
          animate: { 
            scale: [0, baseScale, baseScale], 
            opacity: [0, 1, 1, 0], 
            y: [0, -30, -60, -100],
            transition: { duration: value >= 100 ? 3 : 2, times: [0, 0.2, 0.8, 1] }
          }
        };
    }
  };

  return (
    <div className={`fixed inset-0 pointer-events-none z-40 ${className}`}>
      {/* Main Gift Animation */}
      <AnimatePresence>
        {currentAnimation && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ width: '75%', height: '75%', left: '12.5%', top: '12.5%' }}
          >
            <motion.div
              className="flex flex-col items-center"
              {...getAnimationVariants(currentAnimation.animation, currentAnimation.value)}
            >
              <div className={`text-8xl ${currentAnimation.value >= 500 ? 'text-9xl' : currentAnimation.value >= 100 ? 'text-8xl' : 'text-6xl'}`}>
                {currentAnimation.giftEmoji}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-center"
              >
                <div className={`font-bold text-white ${currentAnimation.value >= 500 ? 'text-2xl' : currentAnimation.value >= 100 ? 'text-xl' : 'text-lg'}`}>
                  {currentAnimation.giftName}
                </div>
                <div className="text-white/80 text-sm mt-1">
                  from {currentAnimation.senderUsername}
                </div>
              </motion.div>
            </motion.div>

            {/* Flash effect for premium gifts */}
            {currentAnimation.value >= 500 && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 via-white/20 to-yellow-400/30 rounded-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0], scale: [0.8, 1.2, 1] }}
                transition={{ duration: 1, repeat: 2 }}
              />
            )}

            {/* Glow effect for large gifts */}
            {currentAnimation.value >= 100 && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-pink-400/20 rounded-2xl blur-xl"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.5, 2] }}
                transition={{ duration: 2, repeat: 1 }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Particle Effects */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: particle.color,
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
            }}
            initial={{ opacity: 1, scale: 1 }}
            animate={{ 
              opacity: particle.life,
              scale: particle.life * 1.5,
              x: particle.vx * 20,
              y: particle.vy * 20
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          />
        ))}
      </AnimatePresence>

      {/* Acknowledgment Message */}
      <AnimatePresence>
        {acknowledgmentMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-black/80 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
              <p className="text-white font-medium text-center whitespace-nowrap">
                {acknowledgmentMessage}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GiftAnimationOverlay;