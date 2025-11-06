import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, X, AlertCircle, Smartphone } from 'lucide-react';

interface ARViewerProps {
  monumentName: string;
  modelUrl?: string;
  onClose: () => void;
}


export default function ARViewer({ monumentName, modelUrl, onClose }: ARViewerProps) {
  const [arSupported, setArSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const modelViewerRef = useRef<ModelViewerElement | null>(null);

  useEffect(() => {
    // Check if model-viewer is already loaded
    if (customElements.get('model-viewer')) {
      checkARSupport();
      return;
    }

    // Load model-viewer script
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';
    script.onload = () => {
      // Wait a bit for custom element to register
      setTimeout(() => {
        checkARSupport();
      }, 100);
    };
    script.onerror = () => {
      setError('Failed to load AR viewer. Please check your internet connection.');
      setIsLoading(false);
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const checkARSupport = async () => {
    setIsLoading(true);
    
    // Check if HTTPS is required
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      setError('AR requires HTTPS. Please access this site over a secure connection.');
      setIsLoading(false);
      return;
    }

    // Check if model-viewer is loaded
    if (!customElements.get('model-viewer')) {
      setError('AR viewer not loaded. Please refresh the page.');
      setIsLoading(false);
      return;
    }

    // Check device type
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isChromeOrEdge = /Chrome|Edge|CriOS|EdgiOS/i.test(navigator.userAgent);
    const isSafari = /Safari/i.test(navigator.userAgent) && !isChromeOrEdge;

    // Model-viewer supports AR on:
    // - iOS Safari (AR Quick Look)
    // - Android Chrome/Edge (WebXR)
    if (isIOS && isSafari) {
      setArSupported(true);
      setError(null);
    } else if (isAndroid && isChromeOrEdge) {
      // Check WebXR support
      if ('xr' in navigator) {
        try {
          const xr = (navigator as XRNavigator).xr;
          if (xr && xr.isSessionSupported) {
            const supported = await xr.isSessionSupported('immersive-ar');
            setArSupported(supported);
            if (!supported) {
              setError('AR is not supported on this device. Your device may not support ARCore.');
            }
          } else {
            setArSupported(false);
            setError('WebXR is not available. Please use Chrome or Edge on Android.');
          }
        } catch (err) {
          setArSupported(false);
          setError('Unable to check AR support. Please try on a compatible device.');
        }
      } else {
        setArSupported(false);
        setError('WebXR is not available. Please use Chrome or Edge on Android.');
      }
    } else if (!isMobile) {
      setArSupported(false);
      setError('AR is only available on mobile devices. Please use a phone or tablet.');
    } else {
      setArSupported(false);
      setError('Please use Safari on iOS or Chrome/Edge on Android for AR support.');
    }

    setIsLoading(false);
  };

  const startAR = () => {
    if (modelViewerRef.current && modelViewerRef.current.activateAR) {
      modelViewerRef.current.activateAR();
    }
  };

  // Default model URL if not provided
  const defaultModelUrl = 'https://modelviewer.dev/shared-assets/models/Astronaut.glb';
  const displayModelUrl = modelUrl || defaultModelUrl;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-white" />
          <h2 className="text-white font-semibold">AR View: {monumentName}</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/20"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        {isLoading ? (
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading AR viewer...</p>
          </div>
        ) : error ? (
          <div className="max-w-md w-full space-y-4">
            <Alert className="bg-red-500/20 border-red-500 text-white">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">
                <p className="font-semibold mb-2">{error}</p>
              </AlertDescription>
            </Alert>
            
            <div className="bg-white/10 rounded-lg p-4 text-white">
              <p className="font-semibold mb-3 text-orange-300">To use AR features:</p>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li><strong>iOS:</strong> Use Safari browser</li>
                <li><strong>Android:</strong> Use Chrome or Edge browser</li>
                <li>Ensure your device supports ARCore (Android) or ARKit (iOS)</li>
                <li>Grant camera permissions when prompted</li>
                <li>Make sure you're using HTTPS (secure connection)</li>
                <li>Use a device with a rear-facing camera</li>
              </ul>
              
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-xs text-white/70 mb-2">
                  💡 <strong>Tip:</strong> You can still explore the monument in 3D view!
                </p>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="w-full mt-2 bg-white/10 text-white border-white/30 hover:bg-white/20"
                >
                  Continue with 3D View
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            {/* @ts-ignore - model-viewer is a web component */}
            <model-viewer
              ref={modelViewerRef}
              src={displayModelUrl}
              alt={monumentName}
              ar=""
              ar-mode="webxr"
              ar-scale="auto"
              ar-placement="floor"
              camera-controls=""
              auto-rotate=""
              interaction-prompt="none"
              shadow-intensity="1"
              exposure="1"
              className="w-full h-full bg-[#1a1a1a]"
            >
              <div slot="ar-button" className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20">
                <Button
                  size="lg"
                  onClick={startAR}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg"
                >
                  <Smartphone className="w-5 h-5 mr-2" />
                  View in AR
                </Button>
              </div>
            </model-viewer>
            
            <div className="absolute bottom-4 left-0 right-0 p-4 bg-black/50 backdrop-blur-sm text-white/80 text-sm text-center z-10">
              <p className="mb-2">
                💡 <strong>Tip:</strong> Use the AR button above to place this monument in your space!
              </p>
              <p className="text-xs text-white/60">
                Tap the AR button to start. Move your device to find a flat surface, then tap to place.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
