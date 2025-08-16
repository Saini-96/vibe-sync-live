import { useState, useCallback, useRef } from 'react';

interface GiftAnimationOptions {
  giftName: string;
  giftEmoji: string;
  senderUsername: string;
  streamerName: string;
  value: number;
  animation: string;
}

interface ParticleEffect {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

export const useGiftAnimations = () => {
  const [currentAnimation, setCurrentAnimation] = useState<GiftAnimationOptions | null>(null);
  const [acknowledgmentMessage, setAcknowledgmentMessage] = useState<string | null>(null);
  const [particles, setParticles] = useState<ParticleEffect[]>([]);
  const particleAnimationRef = useRef<number>();

  const createParticleEffect = useCallback((centerX: number, centerY: number, intensity: number) => {
    const newParticles: ParticleEffect[] = [];
    const particleCount = intensity > 500 ? 60 : intensity > 100 ? 40 : 20;
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: Math.random().toString(36),
        x: centerX + (Math.random() - 0.5) * 100,
        y: centerY + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 1,
        color: intensity > 500 ? '#FFD700' : intensity > 100 ? '#FF69B4' : '#87CEEB',
        size: intensity > 500 ? 8 : intensity > 100 ? 6 : 4
      });
    }
    
    setParticles(newParticles);
    
    // Animate particles
    const animateParticles = () => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          life: particle.life - 0.02
        })).filter(particle => particle.life > 0)
      );
      
      if (particles.length > 0) {
        particleAnimationRef.current = requestAnimationFrame(animateParticles);
      }
    };
    
    particleAnimationRef.current = requestAnimationFrame(animateParticles);
  }, [particles.length]);

  const playGiftAnimation = useCallback((options: GiftAnimationOptions) => {
    // Set the current animation
    setCurrentAnimation(options);

    // Create acknowledgment message
    const message = `${options.senderUsername} sent ${options.giftEmoji} ${options.giftName} to ${options.streamerName}!`;
    setAcknowledgmentMessage(message);

    // Create particle effects
    createParticleEffect(window.innerWidth * 0.6, window.innerHeight * 0.4, options.value);

    // Play sound effect based on gift value
    playGiftSound(options.value);

    // Clear animation after duration based on gift value
    const animationDuration = options.value >= 500 ? 8000 : options.value >= 100 ? 6000 : 4000;
    setTimeout(() => {
      setCurrentAnimation(null);
      setParticles([]);
      if (particleAnimationRef.current) {
        cancelAnimationFrame(particleAnimationRef.current);
      }
    }, animationDuration);

    // Clear acknowledgment message after duration
    setTimeout(() => {
      setAcknowledgmentMessage(null);
    }, animationDuration + 2000);
  }, [createParticleEffect]);

  const playGiftSound = (value: number) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create different sounds based on gift value
      let frequency = 440; // Base frequency (A4)
      let duration = 0.3;
      let volume = 0.3;
      
      if (value >= 500) {
        // Premium gifts - deeper, longer sound with chimes
        frequency = 220;
        duration = 1.2;
        volume = 0.5;
      } else if (value >= 100) {
        // Large gifts - higher pitch with sparkle
        frequency = 660;
        duration = 0.8;
        volume = 0.4;
      } else if (value >= 25) {
        // Medium gifts - medium pitch
        frequency = 550;
        duration = 0.5;
        volume = 0.35;
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = value >= 500 ? 'sawtooth' : value >= 100 ? 'triangle' : 'sine';

      // Create envelope for smoother sound
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);

      // Add multiple sparkle effects for premium gifts
      if (value >= 500) {
        // Multiple chimes for premium
        [200, 400, 600].forEach((delay, index) => {
          setTimeout(() => {
            const chimeOsc = audioContext.createOscillator();
            const chimeGain = audioContext.createGain();
            
            chimeOsc.connect(chimeGain);
            chimeGain.connect(audioContext.destination);
            
            chimeOsc.frequency.setValueAtTime(1320 + (index * 440), audioContext.currentTime);
            chimeOsc.type = 'triangle';
            
            chimeGain.gain.setValueAtTime(0, audioContext.currentTime);
            chimeGain.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.02);
            chimeGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            chimeOsc.start(audioContext.currentTime);
            chimeOsc.stop(audioContext.currentTime + 0.3);
          }, delay);
        });
      } else if (value >= 100) {
        // Single sparkle for large gifts
        setTimeout(() => {
          const sparkleOsc = audioContext.createOscillator();
          const sparkleGain = audioContext.createGain();
          
          sparkleOsc.connect(sparkleGain);
          sparkleGain.connect(audioContext.destination);
          
          sparkleOsc.frequency.setValueAtTime(1320, audioContext.currentTime);
          sparkleOsc.type = 'triangle';
          
          sparkleGain.gain.setValueAtTime(0, audioContext.currentTime);
          sparkleGain.gain.linearRampToValueAtTime(0.25, audioContext.currentTime + 0.02);
          sparkleGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);
          
          sparkleOsc.start(audioContext.currentTime);
          sparkleOsc.stop(audioContext.currentTime + 0.25);
        }, 250);
      }
    } catch (error) {
      console.error('Error playing gift sound:', error);
    }
  };

  return {
    currentAnimation,
    acknowledgmentMessage,
    particles,
    playGiftAnimation
  };
};