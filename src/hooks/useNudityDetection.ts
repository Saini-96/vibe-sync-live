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
    if (!detectorRef.current || !videoElement || blocked || !isInitialized) {
      return { isNudityDetected: false, confidence: 0, warnings, blocked };
    }

    // Skip if already checking to prevent overlapping checks
    if (isChecking) {
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

      // Set canvas size to match video (use smaller resolution for faster processing)
      const scale = 0.5; // Reduce resolution for faster processing
      canvas.width = (videoElement.videoWidth || 640) * scale;
      canvas.height = (videoElement.videoHeight || 480) * scale;

      // Skip if video dimensions are invalid
      if (canvas.width === 0 || canvas.height === 0) {
        return { isNudityDetected: false, confidence: 0, warnings, blocked };
      }

      // Draw current video frame at reduced resolution
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      // Convert to data URL for processing
      const imageData = canvas.toDataURL('image/jpeg', 0.7);

      // Run detection with timeout
      const detectionPromise = detectorRef.current(imageData);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Detection timeout')), 3000)
      );

      const result = await Promise.race([detectionPromise, timeoutPromise]);
      
      if (!result || !Array.isArray(result)) {
        throw new Error('Invalid detection result');
      }

      // Check for NSFW content with improved label matching
      const nsfwResult = result.find((r: any) => {
        const label = r.label?.toLowerCase() || '';
        return (
          label.includes('nsfw') || 
          label.includes('porn') ||
          label.includes('explicit') ||
          label.includes('nude') ||
          label.includes('sexual') ||
          label.includes('adult')
        );
      });

      const confidence = nsfwResult?.score || 0;
      const isNudityDetected = confidence > 0.7; // Increased threshold for better accuracy

      if (isNudityDetected) {
        const newWarnings = warnings + 1;
        setWarnings(newWarnings);
        
        console.log(`Nudity detected! Warning ${newWarnings}/3 (confidence: ${(confidence * 100).toFixed(1)}%)`);
        
        // Block after 3 warnings
        if (newWarnings >= 3) {
          setBlocked(true);
          console.log('Stream blocked due to repeated violations');
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
      // Return safe result on error
      return { isNudityDetected: false, confidence: 0, warnings, blocked };
    } finally {
      setIsChecking(false);
    }
  }, [warnings, blocked, isInitialized, isChecking]);

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