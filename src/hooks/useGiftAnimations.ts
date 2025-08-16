import { useState, useCallback, useRef } from 'react';

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
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const ackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const playGiftAnimation = useCallback((options: GiftAnimationOptions) => {
    // Clear any existing timeouts
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    if (ackTimeoutRef.current) clearTimeout(ackTimeoutRef.current);

    // Set the current animation with throttling
    setCurrentAnimation(options);

    // Create acknowledgment message for chat
    const message = `${options.senderUsername} sent ${options.giftEmoji} ${options.giftName} to ${options.streamerName}!`;
    setAcknowledgmentMessage(message);

    // Play optimized sound effect
    playGiftSound(options.value);

    // Clear animation after appropriate duration
    const animationDuration = getAnimationDuration(options.value);
    animationTimeoutRef.current = setTimeout(() => {
      setCurrentAnimation(null);
    }, animationDuration);

    // Clear acknowledgment message after duration
    ackTimeoutRef.current = setTimeout(() => {
      setAcknowledgmentMessage(null);
    }, animationDuration + 500);
  }, []);

  const getAnimationDuration = (value: number): number => {
    if (value >= 500) return 4000; // Premium gifts
    if (value >= 100) return 3000; // Large gifts
    if (value >= 25) return 2500;  // Medium gifts
    return 2000; // Small gifts
  };

  const playGiftSound = useCallback((value: number) => {
    try {
      // Check if AudioContext is available and user has interacted
      if (!window.AudioContext && !(window as any).webkitAudioContext) {
        console.warn('AudioContext not supported');
        return;
      }

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Resume context if suspended (required for user interaction)
      if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
          playGiftSoundInternal(audioContext, value);
        });
      } else {
        playGiftSoundInternal(audioContext, value);
      }
    } catch (error) {
      console.error('Error playing gift sound:', error);
    }
  }, []);

  const playGiftSoundInternal = (audioContext: AudioContext, value: number) => {
    const currentTime = audioContext.currentTime;
    
    // Create different sounds based on gift value with better audio quality
    let baseFreq = 440;
    let duration = 0.4;
    let volume = 0.2;
    
    if (value >= 500) {
      // Premium gifts - majestic chord progression
      playChord(audioContext, [220, 277, 330], duration * 2, volume, currentTime);
      addSparkleEffect(audioContext, currentTime + 0.3, 3);
    } else if (value >= 100) {
      // Large gifts - bright ascending notes
      playChord(audioContext, [523, 659, 784], duration * 1.5, volume, currentTime);
      addSparkleEffect(audioContext, currentTime + 0.2, 2);
    } else if (value >= 25) {
      // Medium gifts - pleasant chime
      playChord(audioContext, [440, 554, 659], duration, volume, currentTime);
      addSparkleEffect(audioContext, currentTime + 0.1, 1);
    } else {
      // Small gifts - simple tone
      playNote(audioContext, 440, duration * 0.8, volume * 0.8, currentTime);
    }
  };

  const playNote = (audioContext: AudioContext, frequency: number, duration: number, volume: number, startTime: number) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, startTime);
    oscillator.type = 'sine';

    // Smooth envelope
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  };

  const playChord = (audioContext: AudioContext, frequencies: number[], duration: number, volume: number, startTime: number) => {
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        playNote(audioContext, freq, duration - (index * 0.1), volume * (1 - index * 0.1), audioContext.currentTime);
      }, index * 50);
    });
  };

  const addSparkleEffect = (audioContext: AudioContext, startTime: number, count: number) => {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const sparkleFreq = 1320 + (Math.random() * 400);
        playNote(audioContext, sparkleFreq, 0.15, 0.1, audioContext.currentTime);
      }, i * 100);
    }
  };

  return {
    currentAnimation,
    acknowledgmentMessage,
    playGiftAnimation
  };
};