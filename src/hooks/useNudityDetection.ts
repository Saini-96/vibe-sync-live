import { useRef, useCallback, useState } from 'react';
import { pipeline } from '@huggingface/transformers';

interface NudityDetectionResult {
  isNudityDetected: boolean;
  confidence: number;
  warnings: number;
  blocked: boolean;
}

export const useNudityDetection = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [warnings, setWarnings] = useState(0);
  const [blocked, setBlocked] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const detectorRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const initializeDetector = useCallback(async () => {
    if (detectorRef.current) return;
    
    try {
      console.log('Initializing nudity detection model...');
      detectorRef.current = await pipeline(
        'image-classification',
        'Falconsai/nsfw_image_detection',
        { device: 'webgpu' }
      );
      setIsInitialized(true);
      console.log('Nudity detection model initialized');
    } catch (error) {
      console.error('Failed to initialize nudity detection:', error);
    }
  }, []);

  const checkVideoFrame = useCallback(async (videoElement: HTMLVideoElement): Promise<NudityDetectionResult> => {
    if (!detectorRef.current || !videoElement || blocked) {
      return { isNudityDetected: false, confidence: 0, warnings, blocked };
    }

    setIsChecking(true);

    try {
      // Create canvas to capture video frame
      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // Set canvas size to match video
      canvas.width = videoElement.videoWidth || 640;
      canvas.height = videoElement.videoHeight || 480;

      // Draw current video frame
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      // Convert to blob for processing
      const imageData = canvas.toDataURL('image/jpeg', 0.8);

      // Run detection
      const result = await detectorRef.current(imageData);
      
      // Check for NSFW content
      const nsfwResult = result.find((r: any) => 
        r.label.toLowerCase().includes('nsfw') || 
        r.label.toLowerCase().includes('porn') ||
        r.label.toLowerCase().includes('explicit')
      );

      const isNudityDetected = nsfwResult && nsfwResult.score > 0.7; // 70% confidence threshold
      const confidence = nsfwResult ? nsfwResult.score : 0;

      if (isNudityDetected) {
        const newWarnings = warnings + 1;
        setWarnings(newWarnings);
        
        // Block after 3 warnings
        if (newWarnings >= 3) {
          setBlocked(true);
        }
      }

      return {
        isNudityDetected,
        confidence,
        warnings: isNudityDetected ? warnings + 1 : warnings,
        blocked: isNudityDetected && warnings >= 2 // Will be blocked on 3rd warning
      };

    } catch (error) {
      console.error('Error during nudity detection:', error);
      return { isNudityDetected: false, confidence: 0, warnings, blocked };
    } finally {
      setIsChecking(false);
    }
  }, [warnings, blocked]);

  const resetWarnings = useCallback(() => {
    setWarnings(0);
    setBlocked(false);
  }, []);

  return {
    isInitialized,
    isChecking,
    warnings,
    blocked,
    initializeDetector,
    checkVideoFrame,
    resetWarnings
  };
};