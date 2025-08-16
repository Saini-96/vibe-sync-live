import { useState, useRef, useEffect } from 'react';

export interface MediaAccessHook {
  stream: MediaStream | null;
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean;
  isCameraOn: boolean;
  isMicOn: boolean;
  isBeautyFilterOn: boolean;
  isFrontCamera: boolean;
  requestPermissions: () => Promise<void>;
  toggleCamera: () => void;
  toggleMic: () => void;
  toggleBeautyFilter: () => void;
  switchCamera: () => void;
  stopStream: () => void;
}

export const useMediaAccess = (): MediaAccessHook => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isBeautyFilterOn, setIsBeautyFilterOn] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const requestPermissions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: isFrontCamera ? 'user' : 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      setStream(mediaStream);
      setHasPermission(true);
    } catch (err) {
      console.error('Media access error:', err);
      setError('Camera and microphone access denied. Please allow permissions to go live.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCamera = () => {
    if (stream) {
      const videoTracks = stream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsCameraOn(!isCameraOn);
    }
  };

  const toggleMic = () => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMicOn(!isMicOn);
    }
  };

  const toggleBeautyFilter = () => {
    setIsBeautyFilterOn(!isBeautyFilterOn);
    // Beauty filter implementation would go here
    // For now, just toggle the state
  };

  const switchCamera = async () => {
    if (stream) {
      // Stop current stream
      stream.getTracks().forEach(track => track.stop());
      
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: !isFrontCamera ? 'user' : 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100
          }
        });
        
        setStream(newStream);
        setIsFrontCamera(!isFrontCamera);
      } catch (err) {
        console.error('Camera switch error:', err);
        setError('Failed to switch camera');
      }
    }
  };

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setHasPermission(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return {
    stream,
    isLoading,
    error,
    hasPermission,
    isCameraOn,
    isMicOn,
    isBeautyFilterOn,
    isFrontCamera,
    requestPermissions,
    toggleCamera,
    toggleMic,
    toggleBeautyFilter,
    switchCamera,
    stopStream
  };
};