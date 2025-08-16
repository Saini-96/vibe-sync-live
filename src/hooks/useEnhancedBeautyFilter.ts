import { useState, useRef, useCallback } from 'react';

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
  const [selectedPreset, setSelectedPreset] = useState<string>('natural');
  
  const presets: BeautyFilterPreset[] = [
    {
      id: 'natural',
      name: 'Natural',
      emoji: '🌿',
      settings: {
        skinSmoothing: 0.3,
        skinBrightening: 0.2,
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

  const getCurrentSettings = useCallback(() => {
    const preset = presets.find(p => p.id === selectedPreset);
    return preset?.settings || presets[0].settings;
  }, [selectedPreset]);

  const applyBeautyFilter = useCallback((videoElement: HTMLVideoElement): HTMLCanvasElement | null => {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    setIsProcessing(true);

    try {
      canvas.width = videoElement.videoWidth || 640;
      canvas.height = videoElement.videoHeight || 480;

      // Draw original video frame
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      const settings = getCurrentSettings();

      // Apply beauty filters in order
      if (settings.skinSmoothing > 0) {
        applySkinSmoothing(ctx, canvas, settings.skinSmoothing);
      }

      if (settings.skinBrightening > 0) {
        applySkinBrightening(ctx, canvas, settings.skinBrightening);
      }

      if (settings.eyeEnhancement > 0) {
        applyEyeEnhancement(ctx, canvas, settings.eyeEnhancement);
      }

      if (settings.lipEnhancement > 0) {
        applyLipEnhancement(ctx, canvas, settings.lipEnhancement);
      }

      if (settings.faceShaping > 0) {
        applyFaceShaping(ctx, canvas, settings.faceShaping);
      }

      if (settings.acneRemoval) {
        applyAcneRemoval(ctx, canvas);
      }

      if (settings.poreMinimization) {
        applyPoreMinimization(ctx, canvas);
      }

      return canvas;
    } catch (error) {
      console.error('Error applying beauty filter:', error);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [getCurrentSettings]);

  const applySkinSmoothing = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, intensity: number) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Gaussian blur simulation for skin smoothing
    const radius = Math.round(intensity * 3);
    const blurredData = new Uint8ClampedArray(data);

    for (let y = radius; y < canvas.height - radius; y++) {
      for (let x = radius; x < canvas.width - radius; x++) {
        let r = 0, g = 0, b = 0, count = 0;

        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const idx = ((y + dy) * canvas.width + (x + dx)) * 4;
            r += data[idx];
            g += data[idx + 1];
            b += data[idx + 2];
            count++;
          }
        }

        const idx = (y * canvas.width + x) * 4;
        blurredData[idx] = r / count;
        blurredData[idx + 1] = g / count;
        blurredData[idx + 2] = b / count;
      }
    }

    // Blend original with blurred
    for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i] * (1 - intensity) + blurredData[i] * intensity;
      data[i + 1] = data[i + 1] * (1 - intensity) + blurredData[i + 1] * intensity;
      data[i + 2] = data[i + 2] * (1 - intensity) + blurredData[i + 2] * intensity;
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const applySkinBrightening = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, intensity: number) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const brightnessFactor = 1 + (intensity * 0.4);

    for (let i = 0; i < data.length; i += 4) {
      // Detect skin tones (simplified)
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      if (r > 95 && g > 40 && b > 20 && r > g && r > b) {
        data[i] = Math.min(255, r * brightnessFactor);
        data[i + 1] = Math.min(255, g * brightnessFactor);
        data[i + 2] = Math.min(255, b * brightnessFactor);
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const applyEyeEnhancement = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, intensity: number) => {
    // Enhance contrast and saturation in eye regions (simplified)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const contrastFactor = 1 + (intensity * 0.3);
    const saturationFactor = 1 + (intensity * 0.2);

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Apply contrast
      data[i] = Math.min(255, Math.max(0, (r - 128) * contrastFactor + 128));
      data[i + 1] = Math.min(255, Math.max(0, (g - 128) * contrastFactor + 128));
      data[i + 2] = Math.min(255, Math.max(0, (b - 128) * contrastFactor + 128));

      // Apply saturation boost to darker pixels (eye area)
      if (r < 100 && g < 100 && b < 100) {
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        data[i] = Math.min(255, gray + (r - gray) * saturationFactor);
        data[i + 1] = Math.min(255, gray + (g - gray) * saturationFactor);
        data[i + 2] = Math.min(255, gray + (b - gray) * saturationFactor);
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const applyLipEnhancement = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, intensity: number) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Detect lip regions (pinkish/reddish tones)
      if (r > g && r > b && r - g > 10 && r - b > 10) {
        const enhancement = intensity * 0.3;
        data[i] = Math.min(255, r * (1 + enhancement));
        data[i + 1] = Math.min(255, g * (1 + enhancement * 0.5));
        data[i + 2] = Math.min(255, b * (1 + enhancement * 0.7));
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const applyFaceShaping = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, intensity: number) => {
    // Simple face slimming effect using transformation
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(1 - intensity * 0.1, 1 + intensity * 0.05);
    ctx.translate(-centerX, -centerY);
    ctx.restore();
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
    isProcessing
  };
};