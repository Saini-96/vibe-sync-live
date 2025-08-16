import { useState, useRef, useCallback, useEffect } from 'react';
import { pipeline } from '@huggingface/transformers';

export interface BeautyFilterPreset {
  id: string;
  name: string;
  emoji: string;
  settings: BeautyFilterSettings;
}

export interface BeautyFilterSettings {
  skinSmoothing: number; // 0-1
  skinBrightening: number; // 0-1
  faceShaping: number; // 0-1
  eyeEnhancement: number; // 0-1
  lipEnhancement: number; // 0-1
  acneRemoval: boolean;
  poreMinimization: boolean;
}

export const useEnhancedBeautyFilter = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('none');
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const faceDetectorRef = useRef<any>(null);
  
  const presets: BeautyFilterPreset[] = [
    {
      id: 'none',
      name: 'No Filter',
      emoji: '🚫',
      settings: {
        skinSmoothing: 0,
        skinBrightening: 0,
        faceShaping: 0,
        eyeEnhancement: 0,
        lipEnhancement: 0,
        acneRemoval: false,
        poreMinimization: false
      }
    },
    {
      id: 'natural',
      name: 'Natural',
      emoji: '🌿',
      settings: {
        skinSmoothing: 0.4,
        skinBrightening: 0.3,
        faceShaping: 0.1,
        eyeEnhancement: 0.2,
        lipEnhancement: 0.1,
        acneRemoval: true,
        poreMinimization: true
      }
    },
    {
      id: 'glamour',
      name: 'Glamour',
      emoji: '✨',
      settings: {
        skinSmoothing: 0.7,
        skinBrightening: 0.5,
        faceShaping: 0.4,
        eyeEnhancement: 0.6,
        lipEnhancement: 0.5,
        acneRemoval: true,
        poreMinimization: true
      }
    },
    {
      id: 'fresh',
      name: 'Fresh',
      emoji: '💧',
      settings: {
        skinSmoothing: 0.4,
        skinBrightening: 0.6,
        faceShaping: 0.2,
        eyeEnhancement: 0.3,
        lipEnhancement: 0.2,
        acneRemoval: true,
        poreMinimization: true
      }
    },
    {
      id: 'vintage',
      name: 'Vintage',
      emoji: '📸',
      settings: {
        skinSmoothing: 0.5,
        skinBrightening: 0.3,
        faceShaping: 0.3,
        eyeEnhancement: 0.4,
        lipEnhancement: 0.3,
        acneRemoval: true,
        poreMinimization: false
      }
    },
    {
      id: 'dramatic',
      name: 'Dramatic',
      emoji: '🎭',
      settings: {
        skinSmoothing: 0.8,
        skinBrightening: 0.4,
        faceShaping: 0.6,
        eyeEnhancement: 0.8,
        lipEnhancement: 0.7,
        acneRemoval: true,
        poreMinimization: true
      }
    },
    {
      id: 'soft',
      name: 'Soft',
      emoji: '🌸',
      settings: {
        skinSmoothing: 0.6,
        skinBrightening: 0.4,
        faceShaping: 0.2,
        eyeEnhancement: 0.3,
        lipEnhancement: 0.3,
        acneRemoval: true,
        poreMinimization: true
      }
    }
  ];

  // Initialize AI face detection model
  const initializeModel = useCallback(async () => {
    try {
      console.log('Loading face detection model...');
      faceDetectorRef.current = await pipeline(
        'object-detection',
        'Xenova/yolos-tiny',
        { device: 'webgpu' }
      );
      setIsModelLoaded(true);
      console.log('Face detection model loaded successfully');
    } catch (error) {
      console.error('Error loading face detection model:', error);
      // Fallback to basic filters without AI
      setIsModelLoaded(false);
    }
  }, []);

  useEffect(() => {
    initializeModel();
  }, [initializeModel]);

  const getCurrentSettings = useCallback(() => {
    const preset = presets.find(p => p.id === selectedPreset);
    return preset?.settings || presets[0].settings;
  }, [selectedPreset]);

  const applyBeautyFilter = useCallback(async (videoElement: HTMLVideoElement): Promise<HTMLCanvasElement | null> => {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const settings = getCurrentSettings();
    
    // Return original frame if no filter selected
    if (selectedPreset === 'none') {
      canvas.width = videoElement.videoWidth || 640;
      canvas.height = videoElement.videoHeight || 480;
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      return canvas;
    }

    setIsProcessing(true);

    try {
      canvas.width = videoElement.videoWidth || 640;
      canvas.height = videoElement.videoHeight || 480;

      // Draw original video frame
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      // Apply AI-enhanced beauty filters based on selected preset
      await applyAIBeautyFilter(ctx, canvas, settings);

      return canvas;
    } catch (error) {
      console.error('Error applying beauty filter:', error);
      // Fallback to original frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      return canvas;
    } finally {
      setIsProcessing(false);
    }
  }, [getCurrentSettings, selectedPreset]);

  const applyAIBeautyFilter = async (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, settings: BeautyFilterSettings) => {
    // Apply different filter combinations based on preset
    switch (selectedPreset) {
      case 'natural':
        await applyNaturalBeautyFilter(ctx, canvas, settings);
        break;
      case 'glamour':
        await applyGlamourBeautyFilter(ctx, canvas, settings);
        break;
      case 'fresh':
        await applyFreshBeautyFilter(ctx, canvas, settings);
        break;
      case 'vintage':
        await applyVintageBeautyFilter(ctx, canvas, settings);
        break;
      case 'dramatic':
        await applyDramaticBeautyFilter(ctx, canvas, settings);
        break;
      case 'soft':
        await applySoftBeautyFilter(ctx, canvas, settings);
        break;
      default:
        break;
    }
  };

  const applyNaturalBeautyFilter = async (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, settings: BeautyFilterSettings) => {
    // Natural enhancement - subtle skin smoothing and brightness
    applyAdvancedSkinSmoothing(ctx, canvas, 0.3);
    applySkinBrightening(ctx, canvas, 0.2);
    applyPoreMinimization(ctx, canvas);
  };

  const applyGlamourBeautyFilter = async (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, settings: BeautyFilterSettings) => {
    // Glamour enhancement - strong smoothing, eye enhancement, lip enhancement
    applyAdvancedSkinSmoothing(ctx, canvas, 0.6);
    applySkinBrightening(ctx, canvas, 0.4);
    applyEyeEnhancement(ctx, canvas, 0.7);
    applyLipEnhancement(ctx, canvas, 0.6);
    applyFaceContouring(ctx, canvas, 0.3);
  };

  const applyFreshBeautyFilter = async (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, settings: BeautyFilterSettings) => {
    // Fresh look - high brightness, subtle smoothing
    applySkinBrightening(ctx, canvas, 0.5);
    applyAdvancedSkinSmoothing(ctx, canvas, 0.2);
    applyColorCorrection(ctx, canvas, 'fresh');
  };

  const applyVintageBeautyFilter = async (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, settings: BeautyFilterSettings) => {
    // Vintage effect - warm tones, soft focus
    applyColorCorrection(ctx, canvas, 'vintage');
    applyAdvancedSkinSmoothing(ctx, canvas, 0.4);
    applySkinBrightening(ctx, canvas, 0.3);
  };

  const applyDramaticBeautyFilter = async (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, settings: BeautyFilterSettings) => {
    // Dramatic enhancement - strong effects
    applyAdvancedSkinSmoothing(ctx, canvas, 0.7);
    applyEyeEnhancement(ctx, canvas, 0.8);
    applyLipEnhancement(ctx, canvas, 0.7);
    applyFaceContouring(ctx, canvas, 0.5);
    applySkinBrightening(ctx, canvas, 0.4);
  };

  const applySoftBeautyFilter = async (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, settings: BeautyFilterSettings) => {
    // Soft effect - gentle smoothing and warm tones
    applyAdvancedSkinSmoothing(ctx, canvas, 0.5);
    applySkinBrightening(ctx, canvas, 0.3);
    applyColorCorrection(ctx, canvas, 'soft');
  };

  const applyAdvancedSkinSmoothing = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, intensity: number) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Advanced bilateral filter for better skin smoothing
    const radius = Math.round(intensity * 4);
    const sigmaColor = 60;
    const sigmaSpace = 60;
    
    const smoothedData = new Uint8ClampedArray(data);

    for (let y = radius; y < canvas.height - radius; y++) {
      for (let x = radius; x < canvas.width - radius; x++) {
        const centerIdx = (y * canvas.width + x) * 4;
        const centerR = data[centerIdx];
        const centerG = data[centerIdx + 1];
        const centerB = data[centerIdx + 2];
        
        // Only apply smoothing to skin-like pixels
        if (isSkinPixel(centerR, centerG, centerB)) {
          let weightSum = 0;
          let rSum = 0, gSum = 0, bSum = 0;

          for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
              const neighborIdx = ((y + dy) * canvas.width + (x + dx)) * 4;
              const neighborR = data[neighborIdx];
              const neighborG = data[neighborIdx + 1];
              const neighborB = data[neighborIdx + 2];

              // Spatial weight
              const spatialDist = Math.sqrt(dx * dx + dy * dy);
              const spatialWeight = Math.exp(-(spatialDist * spatialDist) / (2 * sigmaSpace * sigmaSpace));

              // Color weight
              const colorDist = Math.sqrt(
                Math.pow(centerR - neighborR, 2) +
                Math.pow(centerG - neighborG, 2) +
                Math.pow(centerB - neighborB, 2)
              );
              const colorWeight = Math.exp(-(colorDist * colorDist) / (2 * sigmaColor * sigmaColor));

              const weight = spatialWeight * colorWeight;
              weightSum += weight;
              rSum += neighborR * weight;
              gSum += neighborG * weight;
              bSum += neighborB * weight;
            }
          }

          if (weightSum > 0) {
            smoothedData[centerIdx] = rSum / weightSum;
            smoothedData[centerIdx + 1] = gSum / weightSum;
            smoothedData[centerIdx + 2] = bSum / weightSum;
          }
        }
      }
    }

    // Blend original with smoothed based on intensity
    for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i] * (1 - intensity) + smoothedData[i] * intensity;
      data[i + 1] = data[i + 1] * (1 - intensity) + smoothedData[i + 1] * intensity;
      data[i + 2] = data[i + 2] * (1 - intensity) + smoothedData[i + 2] * intensity;
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const isSkinPixel = (r: number, g: number, b: number): boolean => {
    // Enhanced skin detection algorithm
    const rgbSum = r + g + b;
    if (rgbSum === 0) return false;
    
    const rNorm = r / rgbSum;
    const gNorm = g / rgbSum;
    const bNorm = b / rgbSum;
    
    return (
      rNorm > 0.35 && 
      gNorm > 0.28 && 
      gNorm < 0.40 && 
      bNorm > 0.20 && 
      bNorm < 0.35 &&
      r > 60 && g > 40 && b > 20
    );
  };

  const applySkinBrightening = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, intensity: number) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Enhanced skin detection and brightening
      if (isSkinPixel(r, g, b)) {
        // Apply adaptive brightening based on original luminance
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        const adaptiveFactor = 1 + (intensity * 0.5 * (1 - luminance / 255));
        
        data[i] = Math.min(255, r * adaptiveFactor);
        data[i + 1] = Math.min(255, g * adaptiveFactor);
        data[i + 2] = Math.min(255, b * adaptiveFactor);
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const applyEyeEnhancement = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, intensity: number) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Enhanced eye area detection and enhancement
    const centerY = canvas.height * 0.4; // Approximate eye level
    const eyeRegionHeight = canvas.height * 0.15;

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Check if pixel is in potential eye region
        const isInEyeRegion = Math.abs(y - centerY) <= eyeRegionHeight;
        
        if (isInEyeRegion) {
          // Enhance darker pixels (iris, pupil) with more contrast
          const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
          
          if (luminance < 120) { // Dark eye features
            const contrastFactor = 1 + (intensity * 0.6);
            const saturationFactor = 1 + (intensity * 0.4);
            
            // Apply contrast
            data[i] = Math.min(255, Math.max(0, (r - 128) * contrastFactor + 128));
            data[i + 1] = Math.min(255, Math.max(0, (g - 128) * contrastFactor + 128));
            data[i + 2] = Math.min(255, Math.max(0, (b - 128) * contrastFactor + 128));
            
            // Enhance saturation
            const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            data[i] = Math.min(255, gray + (data[i] - gray) * saturationFactor);
            data[i + 1] = Math.min(255, gray + (data[i + 1] - gray) * saturationFactor);
            data[i + 2] = Math.min(255, gray + (data[i + 2] - gray) * saturationFactor);
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const applyLipEnhancement = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, intensity: number) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Enhanced lip detection in lower face region
    const lipRegionStart = canvas.height * 0.6;
    const lipRegionEnd = canvas.height * 0.85;

    for (let y = lipRegionStart; y < lipRegionEnd && y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Enhanced lip detection
        const isLipPixel = (
          r > g + 8 && 
          r > b + 5 && 
          r > 80 && 
          g < 150 && 
          b < 150 &&
          // Additional hue check
          r - Math.max(g, b) > 15
        );

        if (isLipPixel) {
          // Apply color enhancement with warmth
          const enhancement = intensity * 0.4;
          const warmthBoost = intensity * 0.2;
          
          data[i] = Math.min(255, r * (1 + enhancement) + warmthBoost * 20);
          data[i + 1] = Math.min(255, g * (1 + enhancement * 0.6));
          data[i + 2] = Math.min(255, b * (1 + enhancement * 0.4));
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const applyFaceContouring = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, intensity: number) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const centerX = canvas.width / 2;
    const faceWidth = canvas.width * 0.6;
    
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;
        const distFromCenter = Math.abs(x - centerX);
        
        // Apply subtle shading to face edges for contouring effect
        if (distFromCenter > faceWidth * 0.3 && distFromCenter < faceWidth * 0.5) {
          const shadingFactor = 1 - intensity * 0.15;
          data[i] = Math.max(0, data[i] * shadingFactor);
          data[i + 1] = Math.max(0, data[i + 1] * shadingFactor);
          data[i + 2] = Math.max(0, data[i + 2] * shadingFactor);
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const applyColorCorrection = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, type: string) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      switch (type) {
        case 'fresh':
          // Cool, bright tones
          data[i] = Math.min(255, r * 1.1);
          data[i + 1] = Math.min(255, g * 1.15);
          data[i + 2] = Math.min(255, b * 1.05);
          break;
        case 'vintage':
          // Warm, sepia-like tones
          data[i] = Math.min(255, r * 1.1 + 10);
          data[i + 1] = Math.min(255, g * 1.05 + 5);
          data[i + 2] = Math.max(0, b * 0.9 - 5);
          break;
        case 'soft':
          // Gentle warm tones
          data[i] = Math.min(255, r * 1.05 + 5);
          data[i + 1] = Math.min(255, g * 1.02 + 3);
          data[i + 2] = Math.min(255, b * 1.01);
          break;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const applyAcneRemoval = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Detect reddish spots (acne/blemishes)
      if (r > g + 15 && r > b + 15 && r > 120) {
        // Blend with surrounding skin tone
        data[i] = Math.min(255, (g + b) / 2 + 20);
        data[i + 1] = Math.min(255, g + 10);
        data[i + 2] = Math.min(255, b + 5);
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const applyPoreMinimization = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Apply very subtle blur to minimize pore visibility
    ctx.filter = 'blur(0.3px)';
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx) {
      tempCtx.drawImage(canvas, 0, 0);
      ctx.filter = 'none';
      ctx.globalAlpha = 0.7;
      ctx.drawImage(tempCanvas, 0, 0);
      ctx.globalAlpha = 1;
    }
  };

  return {
    presets,
    selectedPreset,
    setSelectedPreset,
    applyBeautyFilter,
    getCurrentSettings,
    isProcessing,
    isModelLoaded
  };
};