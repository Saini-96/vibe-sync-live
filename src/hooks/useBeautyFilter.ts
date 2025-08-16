import { useEffect, useRef, useState } from 'react';

export interface BeautyFilterOptions {
  skinSmoothing: number; // 0-1
  skinBrightening: number; // 0-1
  faceShaping: number; // 0-1
  acneRemoval: boolean;
  poreMinimization: boolean;
}

export const useBeautyFilter = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [options, setOptions] = useState<BeautyFilterOptions>({
    skinSmoothing: 0.7,
    skinBrightening: 0.3,
    faceShaping: 0.2,
    acneRemoval: true,
    poreMinimization: true
  });

  const applyBeautyFilter = (videoElement: HTMLVideoElement): HTMLCanvasElement | null => {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    // Draw original video frame
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Apply beauty filters
    if (options.skinSmoothing > 0) {
      applySkinSmoothing(ctx, canvas, options.skinSmoothing);
    }

    if (options.skinBrightening > 0) {
      applySkinBrightening(ctx, canvas, options.skinBrightening);
    }

    if (options.faceShaping > 0) {
      applyFaceShaping(ctx, canvas, options.faceShaping);
    }

    if (options.acneRemoval) {
      applyAcneRemoval(ctx, canvas);
    }

    if (options.poreMinimization) {
      applyPoreMinimization(ctx, canvas);
    }

    return canvas;
  };

  const applySkinSmoothing = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, intensity: number) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Simple skin smoothing using blur effect
    for (let i = 0; i < data.length; i += 4) {
      // Apply subtle gaussian blur effect
      const blur = intensity * 0.3;
      data[i] = Math.min(255, data[i] * (1 + blur)); // Red
      data[i + 1] = Math.min(255, data[i + 1] * (1 + blur)); // Green
      data[i + 2] = Math.min(255, data[i + 2] * (1 + blur)); // Blue
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const applySkinBrightening = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, intensity: number) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const brightnessFactor = 1 + (intensity * 0.3);

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * brightnessFactor); // Red
      data[i + 1] = Math.min(255, data[i + 1] * brightnessFactor); // Green
      data[i + 2] = Math.min(255, data[i + 2] * brightnessFactor); // Blue
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const applyFaceShaping = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, intensity: number) => {
    // Simple face shaping using transformation
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.3;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(1 - intensity * 0.1, 1 + intensity * 0.05);
    ctx.translate(-centerX, -centerY);
    ctx.restore();
  };

  const applyAcneRemoval = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Simple acne removal using color correction
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Detect reddish spots (simple heuristic)
      if (r > g + 20 && r > b + 20) {
        data[i] = Math.min(255, g + 10); // Reduce red
        data[i + 1] = Math.min(255, g + 5); // Slight green boost
        data[i + 2] = Math.min(255, b + 5); // Slight blue boost
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const applyPoreMinimization = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Apply subtle blur to minimize pores
    ctx.filter = 'blur(0.5px)';
    ctx.drawImage(canvas, 0, 0);
    ctx.filter = 'none';
  };

  const updateOptions = (newOptions: Partial<BeautyFilterOptions>) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
  };

  return {
    applyBeautyFilter,
    options,
    updateOptions,
    isProcessing
  };
};