import { useState, useCallback } from 'react';

interface GiftAnimationOptions {
  giftName: string;
  giftEmoji: string;
  senderUsername: string;
  streamerName: string;
  value: number;
}

export const useGiftAnimations = () => {
  const [currentAnimation, setCurrentAnimation] = useState<GiftAnimationOptions | null>(null);
  const [acknowledgmentMessage, setAcknowledgmentMessage] = useState<string | null>(null);

  const playGiftAnimation = useCallback((options: GiftAnimationOptions) => {
    // Set the current animation
    setCurrentAnimation(options);

    // Create acknowledgment message
    const message = `${options.senderUsername} sent ${options.giftEmoji} ${options.giftName} to ${options.streamerName}!`;
    setAcknowledgmentMessage(message);

    // Play sound effect based on gift value
    playGiftSound(options.value);

    // Clear animation after duration based on gift value
    const animationDuration = options.value >= 500 ? 6000 : options.value >= 100 ? 4500 : 3500;
    setTimeout(() => {
      setCurrentAnimation(null);
    }, animationDuration);

    // Clear acknowledgment message after duration
    setTimeout(() => {
      setAcknowledgmentMessage(null);
    }, animationDuration + 1500);
  }, []);

  const playGiftSound = (value: number) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create different sounds based on gift value
      let frequency = 440; // Base frequency (A4)
      let duration = 0.3;
      
      if (value >= 500) {
        // Premium gifts - deeper, longer sound
        frequency = 220;
        duration = 0.8;
      } else if (value >= 100) {
        // Large gifts - higher pitch
        frequency = 660;
        duration = 0.5;
      } else if (value >= 25) {
        // Medium gifts - medium pitch
        frequency = 550;
        duration = 0.4;
      }
      // Small gifts use default values

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = 'sine';

      // Create envelope for smoother sound
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);

      // Add sparkle effect for premium gifts
      if (value >= 100) {
        setTimeout(() => {
          const sparkleOsc = audioContext.createOscillator();
          const sparkleGain = audioContext.createGain();
          
          sparkleOsc.connect(sparkleGain);
          sparkleGain.connect(audioContext.destination);
          
          sparkleOsc.frequency.setValueAtTime(1320, audioContext.currentTime);
          sparkleOsc.type = 'triangle';
          
          sparkleGain.gain.setValueAtTime(0, audioContext.currentTime);
          sparkleGain.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.02);
          sparkleGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
          
          sparkleOsc.start(audioContext.currentTime);
          sparkleOsc.stop(audioContext.currentTime + 0.2);
        }, 200);
      }
    } catch (error) {
      console.error('Error playing gift sound:', error);
    }
  };

  return {
    currentAnimation,
    acknowledgmentMessage,
    playGiftAnimation
  };
};